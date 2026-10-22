"""Resume vs job-description scoring.

The match score and keyword gap are computed locally and deterministically,
so the number is stable and explainable. Gemini (when available) adds
tailored suggestions and blends in its own read of the fit.
"""
from __future__ import annotations

import re
from collections import Counter

from app import gemini
from app.engines.text import STOPWORDS, clamp, str_list, tokens

# Skills and terms that recruiters in India commonly screen for. Multi-word
# terms are matched as phrases.
SKILL_LEXICON = [
    # tech
    "python", "java", "javascript", "typescript", "react", "angular", "node.js", "nodejs", "spring boot",
    "django", "fastapi", "flask", "sql", "mysql", "postgresql", "mongodb", "redis", "kafka", "aws", "azure",
    "gcp", "docker", "kubernetes", "git", "rest api", "microservices", "system design", "data structures",
    "algorithms", "c++", "c#", ".net", "golang", "html", "css", "tailwind", "linux", "ci/cd", "jenkins",
    "terraform", "machine learning", "deep learning", "nlp", "pandas", "numpy", "tensorflow", "pytorch",
    "power bi", "tableau", "excel", "advanced excel", "data analysis", "statistics", "etl", "spark",
    "selenium", "testing", "agile", "scrum", "jira", "sap", "salesforce",
    # finance
    "financial modelling", "financial modeling", "valuation", "dcf", "gst", "tds", "tally", "ifrs", "ind as",
    "audit", "taxation", "accounts payable", "accounts receivable", "reconciliation", "budgeting",
    "forecasting", "mis", "credit analysis", "risk management", "kyc", "aml", "equity research", "ca", "cfa",
    # marketing / sales
    "seo", "sem", "google ads", "meta ads", "google analytics", "content marketing", "social media",
    "email marketing", "performance marketing", "brand management", "market research", "copywriting",
    "crm", "lead generation", "b2b", "b2c", "negotiation", "business development", "key account management",
    "hubspot", "go-to-market",
    # general / management
    "project management", "stakeholder management", "communication", "leadership", "product management",
    "roadmap", "a/b testing", "analytics", "problem solving", "team management", "operations",
    "supply chain", "procurement", "logistics", "recruitment", "talent acquisition", "payroll", "hrms",
    "employee engagement", "mba", "b.tech", "pmp", "six sigma",
]

ACTION_VERBS = {
    "led", "built", "designed", "developed", "launched", "managed", "improved", "increased", "reduced",
    "delivered", "created", "implemented", "drove", "owned", "optimised", "optimized", "automated",
    "negotiated", "achieved", "mentored", "scaled", "streamlined", "spearheaded",
}

SECTIONS = {
    "experience": ("experience", "employment", "work history"),
    "education": ("education", "qualification", "academic"),
    "skills": ("skills", "technical skills", "core competencies"),
    "projects": ("projects", "achievements", "accomplishments"),
}

EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
PHONE = re.compile(r"(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}")
METRIC = re.compile(r"\d+(\.\d+)?\s?(%|x|lpa|lakh|lakhs|crore|cr|k|\+)|₹\s?\d|rs\.?\s?\d", re.I)


def _has_phrase(text: str, phrase: str) -> bool:
    return re.search(rf"(?<![a-z0-9]){re.escape(phrase)}(?![a-z0-9])", text) is not None


def extract_keywords(jd: str, limit: int = 25) -> list[str]:
    """Pick the terms a screener would look for in this JD."""
    low = jd.lower()
    found = [s for s in SKILL_LEXICON if _has_phrase(low, s)]
    # Drop shorter terms subsumed by a longer one found ("excel" in "advanced excel").
    found = [s for s in found if not any(s != o and s in o for o in found)]
    counts = Counter(
        t for t in tokens(jd) if len(t) > 3 and t not in STOPWORDS and not t.isdigit()
    )
    extra = [t for t, n in counts.most_common() if n >= 2 and not any(t in f for f in found)]
    return (found + extra)[:limit]


def structure_checks(resume: str) -> dict[str, bool]:
    low = resume.lower()
    words = len(resume.split())
    verbs = {t for t in tokens(resume)} & ACTION_VERBS
    checks = {
        "contact_email": bool(EMAIL.search(resume)),
        "contact_phone": bool(PHONE.search(resume)),
        "quantified_achievements": len(METRIC.findall(resume)) >= 3,
        "action_verbs": len(verbs) >= 4,
        "good_length": 200 <= words <= 1000,
    }
    for name, heads in SECTIONS.items():
        checks[f"section_{name}"] = any(h in low for h in heads)
    return checks


def local_score(resume: str, jd: str) -> dict:
    keywords = extract_keywords(jd)
    low = resume.lower()
    matched = [k for k in keywords if _has_phrase(low, k)]
    missing = [k for k in keywords if k not in matched]
    keyword_pct = 100 * len(matched) / len(keywords) if keywords else 50
    checks = structure_checks(resume)
    structure_pct = 100 * sum(checks.values()) / len(checks)
    score = round(clamp(0.7 * keyword_pct + 0.3 * structure_pct, 0, 100))
    return {
        "score": score,
        "keyword_score": round(keyword_pct),
        "structure_score": round(structure_pct),
        "matched_keywords": matched,
        "missing_keywords": missing,
        "checks": checks,
    }


CHECK_ADVICE = {
    "contact_email": "Add a professional email address at the top.",
    "contact_phone": "Add a reachable mobile number (with +91) in the header.",
    "quantified_achievements": "Quantify impact: add numbers like % growth, ₹ saved, users served, or time reduced.",
    "action_verbs": "Start bullets with strong action verbs such as Led, Built, Reduced, Launched.",
    "good_length": "Keep it to 1-2 pages (roughly 300-800 words) for most roles.",
    "section_experience": "Add a clear 'Experience' section with role, company, dates and impact bullets.",
    "section_education": "Add an 'Education' section (degree, college, year).",
    "section_skills": "Add a 'Skills' section that mirrors the job description's keywords.",
    "section_projects": "Add a 'Projects' or 'Key Achievements' section to show applied skills.",
}


def fallback_suggestions(result: dict) -> list[str]:
    tips = [CHECK_ADVICE[k] for k, ok in result["checks"].items() if not ok]
    if result["missing_keywords"]:
        top = ", ".join(result["missing_keywords"][:6])
        tips.insert(0, f"Work these JD keywords into your experience bullets where truthful: {top}.")
    if not tips:
        tips.append("Strong match! Tailor your summary line to this exact role title before applying.")
    return tips[:8]


async def score_resume(resume: str, jd: str, target_role: str = "") -> dict:
    result = local_score(resume, jd)
    prompt = f"""Evaluate this resume against the job description for an Indian job applicant.
Target role: {target_role or "as per JD"}
Keyword analysis already done locally: matched={result["matched_keywords"]}, missing={result["missing_keywords"]}.

Return JSON with exactly these keys:
{{"fit_score": integer 0-100 (your holistic judgement of fit),
 "summary": "2 sentence honest, encouraging verdict",
 "strengths": ["up to 4 specific strengths"],
 "suggestions": ["up to 6 concrete, specific edits, referencing actual resume lines where possible"],
 "rewritten_summary": "a 2-3 line professional summary tailored to this JD"}}

JOB DESCRIPTION:
{jd}

RESUME:
{resume}"""
    ai = await gemini.generate_json(prompt, temperature=0.4)
    if ai:
        try:
            fit = float(ai.get("fit_score", result["score"]))
        except (TypeError, ValueError):
            fit = result["score"]
        result["score"] = round(clamp(0.6 * result["score"] + 0.4 * clamp(fit, 0, 100), 0, 100))
        result["summary"] = str(ai.get("summary", "")).strip()
        result["strengths"] = str_list(ai.get("strengths"), 4)
        result["suggestions"] = str_list(ai.get("suggestions"), 6) or fallback_suggestions(result)
        result["rewritten_summary"] = str(ai.get("rewritten_summary", "")).strip()
        result["source"] = "ai"
    else:
        result["summary"] = verdict(result["score"])
        result["strengths"] = [f"Already covers {k}" for k in result["matched_keywords"][:4]]
        result["suggestions"] = fallback_suggestions(result)
        result["rewritten_summary"] = ""
        result["source"] = "fallback"
    return result


def verdict(score: int) -> str:
    if score >= 75:
        return "Strong match. A few targeted tweaks and you're ready to apply."
    if score >= 50:
        return "Decent match. Close the keyword gaps below to get past ATS screens."
    return "Needs work for this role. Focus on the missing keywords and quantified impact."
