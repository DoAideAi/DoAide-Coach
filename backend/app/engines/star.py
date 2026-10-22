"""The STAR answer builder: deterministic template, AI-polished.

The template stitches the candidate's Situation, Task, Action and Result into
one spoken answer, using only the facts they typed. Gemini rewrites it more
naturally when available, under the same no-invented-facts rule.
"""
from __future__ import annotations

import json
import re

from app import gemini
from app.engines.text import str_list

WORDS_PER_MINUTE = 130  # a calm interview pace

TIPS = [
    "Spend most of your time on Action and Result — interviewers skim the setup.",
    "Say 'I', not 'we', for the parts you personally did.",
    "End with a number: %, ₹, time saved, users — a result they can remember.",
    "Keep it under 2 minutes. If the story needs more, it is two stories.",
]

CONNECTORS = {
    "situation": ("", ""),
    "task": ("My responsibility was ", "I had to "),
    "action": ("So I ", "What I did: "),
    "result": ("As a result, ", "The outcome: "),
}


def sentence(text: str) -> str:
    text = text.strip().rstrip(".")
    return f"{text[:1].upper()}{text[1:]}." if text else ""


def _lead_in(text: str, lead: str) -> str:
    """Prefix a lead-in unless the text already starts like a sentence of its own."""
    text = text.strip().rstrip(".")
    if not text:
        return ""
    low = text.lower()
    if low.startswith(("i ", "i'", "my ", "we ", "so ", "as a result", "the ")):
        return sentence(text)
    return sentence(lead + text[:1].lower() + text[1:])


def build_star(data: dict) -> str:
    parts = [
        sentence(data.get("situation", "")),
        _lead_in(data.get("task", ""), "My task was to "),
        _lead_in(data.get("action", ""), "So I "),
        _lead_in(data.get("result", ""), "As a result, "),
    ]
    learning = data.get("learning", "").strip()
    if learning:
        parts.append(_lead_in(learning, "What I took away from it: "))
    return " ".join(p for p in parts if p)


def stats(text: str) -> dict:
    words = len(text.split())
    return {"word_count": words, "speaking_seconds": round(words / WORDS_PER_MINUTE * 60)}


def check_structure(data: dict) -> list[str]:
    """Deterministic coaching notes about the raw inputs."""
    notes = []
    result = data.get("result", "")
    if result and not re.search(r"\d", result):
        notes.append("Your Result has no number. Add a metric: %, ₹, time saved, users or rank.")
    action = data.get("action", "")
    if action and " we " in f" {action.lower()} " and " i " not in f" {action.lower()} ":
        notes.append("Your Action only says 'we'. Interviewers want what YOU did — switch at least one step to 'I'.")
    if len(action.split()) < 15:
        notes.append("The Action is the heart of the story. Add 1-2 concrete steps you personally took.")
    return notes


def _prompt(data: dict) -> str:
    question = data.get("question", "").strip()
    facts = {k: v for k, v in data.items() if v not in ("", None)}
    return (
        "Rewrite these notes into one spoken STAR interview answer"
        + (f" to the question: '{question}'" if question else "")
        + ".\n"
        f"Notes (JSON): {json.dumps(facts, ensure_ascii=False)}\n"
        "Rules: first person, 120-200 words, natural Indian English, smooth flow (no 'Situation:' headings), "
        "keep every number exactly as given. Use ONLY the facts in the notes: never invent companies, metrics "
        "or outcomes. No greeting, no bullet points.\n"
        'Return JSON: {"answer": string, "tips": [2-3 short, specific suggestions to make this story stronger]}'
    )


async def generate_star(data: dict) -> dict:
    fallback = build_star(data)
    structure_notes = check_structure(data)
    ai = await gemini.generate_json(_prompt(data), temperature=0.7)
    answer = str(ai.get("answer", "")).strip() if ai else ""
    # Reject empty or wildly off-length output rather than show it.
    if answer and 50 <= len(answer.split()) <= 320:
        tips = str_list(ai.get("tips"), limit=3) or TIPS[:3]
        return {"answer": answer, "tips": (structure_notes + tips)[:4], "source": "ai", **stats(answer)}
    tips = (structure_notes + TIPS)[:4]
    return {"answer": fallback, "tips": tips, "source": "fallback", **stats(fallback)}
