"""Optional Google sign-in and cross-device sync of practice sessions."""
from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app import auth, db

router = APIRouter(prefix="/api")


class GoogleLogin(BaseModel):
    credential: str = Field(..., min_length=20, max_length=4096)


class SessionIn(BaseModel):
    id: str = Field(..., min_length=1, max_length=64)
    kind: Literal["interview", "resume", "salary"]
    created_at: float = Field(..., gt=0)
    score: float | None = Field(None, ge=0, le=100)
    title: str = Field("", max_length=200)
    details: dict = Field(default_factory=dict)


class SyncIn(BaseModel):
    sessions: list[SessionIn] = Field(default_factory=list, max_length=500)


@router.post("/auth/google")
async def google_login(body: GoogleLogin) -> dict:
    claims = await auth.verify_google_credential(body.credential)
    user = db.upsert_user(
        claims["sub"], claims.get("email", ""), claims.get("name", ""), claims.get("picture", "")
    )
    return {"token": auth.issue_token(user["id"]), "user": user}


@router.get("/auth/me")
def me(user: dict = Depends(auth.current_user)) -> dict:
    return {"user": user}


@router.get("/sessions")
def get_sessions(user: dict = Depends(auth.current_user)) -> dict:
    return {"sessions": db.list_sessions(user["id"])}


@router.post("/sessions/sync")
def sync_sessions(body: SyncIn, user: dict = Depends(auth.current_user)) -> dict:
    """Merge the browser's sessions into the account and return the union."""
    db.upsert_sessions(user["id"], [s.model_dump() for s in body.sessions])
    return {"sessions": db.list_sessions(user["id"])}


@router.delete("/sessions")
def clear_sessions(user: dict = Depends(auth.current_user)) -> dict:
    db.delete_sessions(user["id"])
    return {"ok": True}
