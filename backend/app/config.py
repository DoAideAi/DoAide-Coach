"""Runtime settings, read from environment variables.

Secrets (the Gemini key, the session secret) live only here on the server.
Nothing in this module is ever sent to the browser except the public Google
OAuth client ID, which Google expects to be public.
"""
from __future__ import annotations

import os
import secrets
from dataclasses import dataclass, field
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent


def _read_key_file(path: str) -> str:
    if not path:
        return ""
    try:
        return Path(path).expanduser().read_text().strip()
    except OSError:
        return ""


def _gemini_key() -> str:
    return os.getenv("GEMINI_API_KEY", "").strip() or _read_key_file(
        os.getenv("GEMINI_API_KEY_FILE", "")
    )


@dataclass
class Settings:
    port: int = int(os.getenv("PORT", "3103"))
    site_url: str = os.getenv("SITE_URL", "https://coach.doaide.com").rstrip("/")
    gemini_api_key: str = field(default_factory=_gemini_key)
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
    gemini_timeout: float = float(os.getenv("GEMINI_TIMEOUT", "30"))
    google_client_id: str = os.getenv("GOOGLE_CLIENT_ID", "")
    # A random per-process secret means tokens die on restart; set
    # SESSION_SECRET in production so sign-ins survive deploys.
    session_secret: str = os.getenv("SESSION_SECRET", "") or secrets.token_hex(32)
    session_ttl_days: int = int(os.getenv("SESSION_TTL_DAYS", "30"))
    db_path: str = os.getenv("DB_PATH", str(BACKEND_DIR / "coach.db"))
    frontend_dist: str = os.getenv(
        "FRONTEND_DIST", str(BACKEND_DIR.parent / "frontend" / "dist")
    )
    cors_origins: list[str] = field(
        default_factory=lambda: [
            o.strip()
            for o in os.getenv(
                "CORS_ORIGINS", "http://localhost:3104,https://coach.doaide.com"
            ).split(",")
            if o.strip()
        ]
    )
    # AI calls per client IP per window, to keep one visitor from burning the key.
    ai_rate_limit: int = int(os.getenv("AI_RATE_LIMIT", "40"))
    ai_rate_window_seconds: int = int(os.getenv("AI_RATE_WINDOW", "600"))

    @property
    def ai_enabled(self) -> bool:
        return bool(self.gemini_api_key)


settings = Settings()
