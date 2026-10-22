import pytest
from fastapi.testclient import TestClient

from app import gemini, ratelimit
from app.config import settings


@pytest.fixture(autouse=True)
def isolated(tmp_path, monkeypatch):
    """Fresh DB, no real Gemini key, and a clean rate limiter for every test."""
    monkeypatch.setattr(settings, "db_path", str(tmp_path / "test.db"))
    monkeypatch.setattr(settings, "gemini_api_key", "")
    monkeypatch.setattr(settings, "frontend_dist", str(tmp_path / "dist"))
    monkeypatch.setattr(settings, "session_secret", "test-secret")
    ratelimit.reset()
    yield


@pytest.fixture
def client():
    from app.main import create_app

    with TestClient(create_app()) as c:
        yield c


@pytest.fixture
def fake_ai(monkeypatch):
    """Make gemini.generate_json return a canned dict and record prompts."""
    calls = []

    def install(response):
        async def fake(prompt, temperature=0.6):
            calls.append(prompt)
            return response(prompt) if callable(response) else response

        monkeypatch.setattr(gemini, "generate_json", fake)
        return calls

    return install
