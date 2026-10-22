"""The "Tell me about yourself" builder: deterministic template, AI-polished.

The template answer follows the present → past → future structure Indian
interviewers expect and only uses facts the candidate typed. Gemini rewrites
it more naturally when available, under the same no-invented-facts rule.
"""
from __future__ import annotations

import json
import re

from app import gemini
from app.engines.text import str_list

WORDS_PER_MINUTE = 130  # a calm interview pace
LENGTHS = {"short": (60, 110), "standard": (110, 190)}

TIPS = [
    "Keep it to 60-90 seconds. Stop after the 'why this role' line and let them ask.",
    "Lead with what you do now, then one proof point, then why you want this job.",
    "Do not repeat your resume line by line, and skip personal details like family or hometown unless asked.",
    "Practise it aloud 5 times so it sounds natural, not memorised.",
]


def split_skills(skills: str) -> list[str]:
    return [s.strip() for s in re.split(r"[,\n;/]+", skills) if s.strip()][:6]


def join_list(items: list[str]) -> str:
    if len(items) <= 1:
        return "".join(items)
    return ", ".join(items[:-1]) + " and " + items[-1]


def sentence(text: str) -> str:
    text = text.strip().rstrip(".")
    return f"{text[:1].upper()}{text[1:]}." if text else ""


def build_intro(data: dict) -> str:
    name = data.get("name", "").strip()
    role = data.get("target_role", "").strip() or "this role"
    current = data.get("current_role", "").strip()
    company = data.get("current_company", "").strip()
    years = data.get("experience_years") or 0
    education = data.get("education", "").strip()
    skills = split_skills(data.get("skills", ""))
    achievement = data.get("achievement", "").strip()
    target_company = data.get("target_company", "").strip()
    why = data.get("why", "").strip()
    fresher = data.get("level") == "fresher" or (not current and not years)

    parts = [f"Thank you for the opportunity. I'm {name}." if name else "Thank you for the opportunity."]
    if fresher:
        parts.append(f"I recently completed {education}." if education else "I am a recent graduate.")
    else:
        exp = f"{years:g} year{'s' if years != 1 else ''} of experience" if years else "experience"
        at = f" at {company}" if company else ""
        parts.append(f"I'm currently working as a {current or 'professional'}{at}, with {exp}.")
        if education:
            parts.append(f"I studied {education}.")
    if skills:
        parts.append(f"My core skills are {join_list(skills)}.")
    if achievement:
        lead = "One thing I'm proud of: " if fresher else "A recent highlight: "
        parts.append(lead + sentence(achievement))
    target = f"the {role} role" + (f" at {target_company}" if target_company else "")
    if why:
        parts.append(f"I'm applying for {target} because {why.rstrip('.')}.")
    else:
        parts.append(f"I'm excited about {target} because it lets me build on these skills and grow further.")
    parts.append("I'd be happy to walk you through any of this in more detail.")
    return " ".join(p for p in parts if p)


def stats(text: str) -> dict:
    words = len(text.split())
    return {"word_count": words, "speaking_seconds": round(words / WORDS_PER_MINUTE * 60)}


def _prompt(data: dict, length: str) -> str:
    lo, hi = LENGTHS[length]
    facts = {k: v for k, v in data.items() if v not in ("", None, 0)}
    return (
        "Write a spoken answer to the interview question 'Tell me about yourself' for this candidate.\n"
        f"Facts (JSON): {json.dumps(facts, ensure_ascii=False)}\n"
        f"Rules: first person, {lo}-{hi} words, natural Indian English, structure present -> past -> future, "
        "end with why this role/company. Use ONLY the facts given: never invent numbers, employers, degrees "
        "or achievements. No greeting like 'Good morning', no headings, no bullet points.\n"
        'Return JSON: {"intro": string, "tips": [2-3 short, specific suggestions to make it stronger]}'
    )


async def generate_intro(data: dict, length: str = "standard") -> dict:
    fallback = build_intro(data)
    ai = await gemini.generate_json(_prompt(data, length), temperature=0.7)
    intro = str(ai.get("intro", "")).strip() if ai else ""
    lo, hi = LENGTHS[length]
    # Reject empty or wildly off-length output rather than show it.
    if intro and lo * 0.6 <= len(intro.split()) <= hi * 1.5:
        tips = str_list(ai.get("tips"), limit=3) or TIPS[:3]
        return {"intro": intro, "tips": tips, "source": "ai", **stats(intro)}
    return {"intro": fallback, "tips": TIPS, "source": "fallback", **stats(fallback)}
