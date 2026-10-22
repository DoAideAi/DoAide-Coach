"""Thin async client for the Gemini REST API that always asks for JSON.

``generate_json`` returns ``None`` rather than raising when the key is
missing or the call fails, so every feature can fall back to its
deterministic engine and the app keeps working without AI.
"""
from __future__ import annotations

import json
import logging
import re
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

SYSTEM_PROMPT = (
    "You are DoAide Coach, a warm, honest career coach for Indian job seekers. "
    "You know Indian hiring: campus and lateral hiring, CTC/LPA salary structures, "
    "notice periods, service companies vs product companies vs startups, and "
    "common interview formats at Indian firms and MNC offices in India. "
    "Be specific and encouraging, never generic. Always reply with valid JSON only."
)

_FENCE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)


def parse_json_text(text: str) -> Any:
    """Parse model output, tolerating stray markdown code fences."""
    cleaned = _FENCE.sub("", text.strip()).strip()
    return json.loads(cleaned)


async def generate_json(prompt: str, temperature: float = 0.6) -> dict | None:
    if not settings.gemini_api_key:
        return None
    body = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "responseMimeType": "application/json",
            "thinkingConfig": {"thinkingLevel": "minimal"},
        },
    }
    try:
        async with httpx.AsyncClient(timeout=settings.gemini_timeout) as client:
            resp = await client.post(
                API_URL.format(model=settings.gemini_model),
                headers={"x-goog-api-key": settings.gemini_api_key},
                json=body,
            )
        if resp.status_code != 200:
            logger.warning("Gemini HTTP %s: %s", resp.status_code, resp.text[:300])
            return None
        parts = resp.json()["candidates"][0]["content"]["parts"]
        text = "".join(p.get("text", "") for p in parts if not p.get("thought"))
        data = parse_json_text(text)
        return data if isinstance(data, dict) else None
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
        logger.warning("Gemini call failed: %s", exc)
        return None
