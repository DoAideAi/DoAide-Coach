"""In-memory sliding-window limit on AI endpoints, keyed by client IP."""
from __future__ import annotations

import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

from app.config import settings

_hits: dict[str, deque[float]] = defaultdict(deque)


def reset() -> None:
    _hits.clear()


def client_ip(request: Request) -> str:
    # Behind Caddy/Cloudflare the real client is the first forwarded hop.
    forwarded = request.headers.get("cf-connecting-ip") or request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def ai_rate_limit(request: Request) -> None:
    now = time.monotonic()
    window = _hits[client_ip(request)]
    while window and now - window[0] > settings.ai_rate_window_seconds:
        window.popleft()
    if len(window) >= settings.ai_rate_limit:
        raise HTTPException(429, "You're practising fast! Please wait a few minutes and try again.")
    window.append(now)
