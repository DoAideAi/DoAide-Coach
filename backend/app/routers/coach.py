"""AI coaching endpoints: mock interview, resume scorer, salary negotiator."""
from __future__ import annotations

import uuid
from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field, model_validator

from app.engines import interview, resume, salary
from app.ratelimit import ai_rate_limit

router = APIRouter(prefix="/api", dependencies=[Depends(ai_rate_limit)])

Level = Literal["fresher", "junior", "mid", "senior"]


class InterviewStart(BaseModel):
    role: str = Field("", max_length=80)
    company: str = Field("", max_length=80)
    industry: str = Field("", max_length=40)
    level: Level = "junior"
    count: int = Field(5, ge=1, le=10)


class AnswerIn(BaseModel):
    question: str = Field(..., min_length=3, max_length=600)
    answer: str = Field(..., min_length=1, max_length=6000)
    role: str = Field("", max_length=80)
    company: str = Field("", max_length=80)
    category: str = Field("behavioral", max_length=20)
    level: Level = "junior"


class ResumeIn(BaseModel):
    resume: str = Field(..., min_length=50, max_length=20000)
    job_description: str = Field(..., min_length=30, max_length=15000)
    target_role: str = Field("", max_length=80)


class SalaryIn(BaseModel):
    current_ctc: float = Field(..., gt=0, le=1000, description="LPA")
    offered_ctc: float = Field(..., gt=0, le=1000, description="LPA")
    experience_years: float = Field(..., ge=0, le=50)
    location: str = Field(..., min_length=2, max_length=60)
    role: str = Field("", max_length=80)
    company: str = Field("", max_length=80)
    industry: str = Field("", max_length=40)
    competing_offer: float | None = Field(None, gt=0, le=1000)

    @model_validator(mode="after")
    def _sane(self) -> "SalaryIn":
        if self.offered_ctc > self.current_ctc * 10:
            raise ValueError("Offered CTC looks off. Enter both values in LPA (lakhs per annum).")
        return self


@router.post("/interview/start")
async def start_interview(body: InterviewStart) -> dict:
    questions, source = await interview.generate_questions(
        body.industry, body.role, body.company, body.level, body.count
    )
    return {"session_id": str(uuid.uuid4()), "questions": questions, "source": source}


@router.post("/interview/feedback")
async def interview_feedback(body: AnswerIn) -> dict:
    return await interview.answer_feedback(
        body.question, body.answer, body.role, body.company, body.category, body.level
    )


@router.post("/resume/score")
async def score_resume(body: ResumeIn) -> dict:
    return await resume.score_resume(body.resume, body.job_description, body.target_role)


@router.post("/salary/negotiate")
async def negotiate(body: SalaryIn) -> dict:
    return await salary.negotiation_plan(body.model_dump())
