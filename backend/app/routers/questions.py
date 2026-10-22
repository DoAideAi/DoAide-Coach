"""Question bank browsing."""
from __future__ import annotations

from fastapi import APIRouter, Query

from app.data import question_bank

router = APIRouter(prefix="/api/questions")


@router.get("")
def list_questions(
    category: str = Query("", max_length=20),
    industry: str = Query("", max_length=40),
    company: str = Query("", max_length=80),
    role: str = Query("", max_length=80),
    q: str = Query("", max_length=100),
) -> dict:
    items = question_bank.search(category, industry, company, role, q)
    return {"total": len(items), "questions": items}


@router.get("/meta")
def meta() -> dict:
    return {
        "categories": question_bank.CATEGORIES,
        "industries": question_bank.INDUSTRIES,
        "companies": question_bank.companies(),
        "roles": question_bank.roles(),
        "total": len(question_bank.QUESTIONS),
    }
