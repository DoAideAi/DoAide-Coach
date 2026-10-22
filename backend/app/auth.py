"""Optional Google sign-in.

The browser gets a Google ID token from Google Identity Services and posts it
here. We verify it with Google's tokeninfo endpoint, then hand back our own
short HMAC-signed token so later requests don't round-trip to Google.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import time

import httpx
from fastapi import Header, HTTPException

from app import db
from app.config import settings

TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo"
GOOGLE_ISSUERS = {"accounts.google.com", "https://accounts.google.com"}


def _sign(payload: str) -> str:
    mac = hmac.new(settings.session_secret.encode(), payload.encode(), hashlib.sha256)
    return base64.urlsafe_b64encode(mac.digest()).decode().rstrip("=")


def issue_token(uid: str, now: float | None = None) -> str:
    exp = int((now or time.time()) + settings.session_ttl_days * 86400)
    payload = f"{base64.urlsafe_b64encode(uid.encode()).decode().rstrip('=')}.{exp}"
    return f"{payload}.{_sign(payload)}"


def read_token(token: str, now: float | None = None) -> str | None:
    try:
        uid_b64, exp, sig = token.split(".")
    except ValueError:
        return None
    payload = f"{uid_b64}.{exp}"
    if not hmac.compare_digest(sig, _sign(payload)):
        return None
    if not exp.isdigit() or int(exp) < (now or time.time()):
        return None
    padded = uid_b64 + "=" * (-len(uid_b64) % 4)
    try:
        return base64.urlsafe_b64decode(padded).decode()
    except ValueError:
        return None


async def verify_google_credential(credential: str) -> dict:
    """Return Google's claims for a valid ID token issued to our client."""
    if not settings.google_client_id:
        raise HTTPException(503, "Google sign-in is not configured")
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(TOKENINFO_URL, params={"id_token": credential})
    if resp.status_code != 200:
        raise HTTPException(401, "Invalid Google credential")
    claims = resp.json()
    if claims.get("aud") != settings.google_client_id:
        raise HTTPException(401, "Credential was issued to a different app")
    if claims.get("iss") not in GOOGLE_ISSUERS:
        raise HTTPException(401, "Unexpected token issuer")
    if str(claims.get("email_verified")).lower() != "true":
        raise HTTPException(401, "Google email is not verified")
    return claims


def current_user(authorization: str = Header(default="")) -> dict:
    """FastAPI dependency: the signed-in user, or 401."""
    token = authorization.removeprefix("Bearer ").strip()
    uid = read_token(token) if token else None
    user = db.get_user(uid) if uid else None
    if not user:
        raise HTTPException(401, "Sign in required")
    return user
