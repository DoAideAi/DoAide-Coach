"""Mock interview: question selection and per-answer feedback."""
from __future__ import annotations

import random
import re

from app import gemini
from app.data import question_bank
from app.engines.text import clamp, str_list, tokens

STAR_MARKERS = {
    "situation": ("situation", "when i was", "at my previous", "in my last", "while working"),
    "task": ("task", "my goal", "i was responsible", "needed to", "had to"),
    "action": ("i decided", "i built", "i led", "i created", "i implemented", "i worked", "action", "so i"),
    "result": ("result", "as a result", "which led", "increased", "reduced", "improved", "saved", "%"),
}


def bank_questions(industry: str, role: str, company: str, count: int, seed: int | None = None) -> list[dict]:
    """A balanced mix from the bank: an HR opener, then technical/behavioral, ending with HR."""
    rng = random.Random(seed)
    pool = question_bank.search(industry=industry, company=company, role=role)
    if len(pool) < count:
        pool = question_bank.search(industry=industry, company=company) or question_bank.search(industry=industry)
    opener = next((q for q in pool if q["question"].startswith("Tell me about yourself")), None)
    rest = [q for q in pool if q is not opener]
    # Prefer company- and industry-specific questions, then fill with generic ones.
    specific = [q for q in rest if q["companies"] or q["industry"] != "all"]
    generic = [q for q in rest if q not in specific]
    rng.shuffle(specific)
    rng.shuffle(generic)
    picked = ([opener] if opener else []) + specific + generic
    return [
        {"question": q["question"], "category": q["category"], "tip": q["tip"]}
        for q in picked[:count]
    ]


async def generate_questions(
    industry: str, role: str, company: str, level: str, count: int
) -> tuple[list[dict], str]:
    prompt = f"""Create a realistic mock interview for an Indian candidate.
Role: {role or "general"}; Company: {company or "a typical Indian employer in this industry"};
Industry: {industry or "general"}; Experience level: {level}.
Ask exactly {count} questions in the order a real interviewer would. Start with an introduction question,
mix behavioral and role-specific technical questions suited to the level, and end with an HR question.
If a company is given, reflect its known interview style and values.

Return JSON: {{"questions": [{{"question": "...", "category": "behavioral|technical|hr", "tip": "one-line hint on what a great answer covers"}}]}}"""
    ai = await gemini.generate_json(prompt, temperature=0.8)
    if ai and isinstance(ai.get("questions"), list):
        qs = []
        for q in ai["questions"]:
            if not isinstance(q, dict) or not str(q.get("question", "")).strip():
                continue
            cat = str(q.get("category", "")).lower()
            qs.append({
                "question": str(q["question"]).strip(),
                "category": cat if cat in question_bank.CATEGORIES else "behavioral",
                "tip": str(q.get("tip", "")).strip(),
            })
        if len(qs) >= max(1, count // 2):
            return qs[:count], "ai"
    return bank_questions(industry, role, company, count), "fallback"


def heuristic_feedback(question: str, answer: str, category: str) -> dict:
    text = answer.strip()
    low = text.lower()
    words = len(text.split())
    star_hits = [k for k, markers in STAR_MARKERS.items() if any(m in low for m in markers)]
    has_numbers = bool(re.search(r"\d", text))
    vocab = len(set(tokens(text)))

    rating = 2.0
    rating += clamp(words / 40, 0, 3)          # up to +3 for a developed answer (~120 words)
    rating += 0.75 * len(star_hits)            # up to +3 for STAR structure
    rating += 1.0 if has_numbers else 0.0      # quantified impact
    rating += 1.0 if vocab > 50 else 0.0
    if words < 15:
        rating = min(rating, 3)
    rating = int(round(clamp(rating, 1, 10)))

    strengths, improvements = [], []
    if words >= 60:
        strengths.append("Well-developed answer with enough detail.")
    else:
        improvements.append("Expand your answer: aim for 1-2 minutes (about 120-200 words) with a concrete example.")
    if has_numbers:
        strengths.append("Good use of numbers to show impact.")
    else:
        improvements.append("Add a measurable result (%, ₹, time saved, users) to make it memorable.")
    if category == "behavioral" or len(star_hits) >= 2:
        missing = [k for k in STAR_MARKERS if k not in star_hits]
        if missing:
            improvements.append(f"Structure it with STAR. Make the {', '.join(missing)} part clearer.")
        else:
            strengths.append("Clear STAR structure.")
    if not strengths:
        strengths.append("You attempted the question, which is the first step. Keep practising!")

    bank = next((q for q in question_bank.QUESTIONS if q["question"].lower() == question.strip().lower()), None)
    model = (
        f"A strong answer would: {bank['tip']}" if bank
        else "A strong answer gives context in one line, explains specifically what YOU did, and ends with a measurable result and what you learned."
    )
    return {
        "rating": rating,
        "verdict": "Great answer!" if rating >= 8 else "Good start, with room to sharpen." if rating >= 5 else "Needs more depth.",
        "strengths": strengths,
        "improvements": improvements,
        "model_answer": model,
    }


async def answer_feedback(
    question: str, answer: str, role: str, company: str, category: str, level: str
) -> dict:
    prompt = f"""You are interviewing an Indian candidate for "{role or "the role"}"{f" at {company}" if company else ""} ({level} level).
Question ({category}): {question}
Candidate's answer: {answer}

Assess it like a fair but demanding interviewer. Reward specifics, structure (STAR for behavioral),
correctness (for technical), and measurable impact. Penalise vague or off-topic answers.

Return JSON with exactly these keys:
{{"rating": integer 1-10,
 "verdict": "one short encouraging sentence",
 "strengths": ["1-3 specific things done well"],
 "improvements": ["1-3 specific, actionable suggestions"],
 "model_answer": "a concise model answer (80-150 words) the candidate could adapt"}}"""
    ai = await gemini.generate_json(prompt, temperature=0.4)
    if ai:
        try:
            rating = int(round(clamp(float(ai.get("rating", 5)), 1, 10)))
        except (TypeError, ValueError):
            rating = 5
        fb = {
            "rating": rating,
            "verdict": str(ai.get("verdict", "")).strip(),
            "strengths": str_list(ai.get("strengths"), 3),
            "improvements": str_list(ai.get("improvements"), 3),
            "model_answer": str(ai.get("model_answer", "")).strip(),
        }
        if fb["model_answer"]:
            return {**fb, "source": "ai"}
    return {**heuristic_feedback(question, answer, category), "source": "fallback"}
