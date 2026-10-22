import httpx
import pytest

from app import auth
from app.config import settings

CLIENT_ID = "test-client.apps.googleusercontent.com"
CLAIMS = {"sub": "g-123", "email": "asha@example.com", "name": "Asha", "picture": "https://p",
          "aud": CLIENT_ID, "iss": "https://accounts.google.com", "email_verified": "true"}


class _FakeGoogle:
    def __init__(self, status, claims):
        self.status, self.claims = status, claims

    def __call__(self, **_):
        return self

    async def __aenter__(self):
        return self

    async def __aexit__(self, *a):
        return False

    async def get(self, url, params):
        assert params["id_token"]
        return httpx.Response(self.status, json=self.claims)


@pytest.fixture
def google(monkeypatch):
    monkeypatch.setattr(settings, "google_client_id", CLIENT_ID)

    def install(status=200, **overrides):
        monkeypatch.setattr(auth.httpx, "AsyncClient", _FakeGoogle(status, {**CLAIMS, **overrides}))

    return install


def login(client):
    return client.post("/api/auth/google", json={"credential": "x" * 40})


def test_token_roundtrip_and_tamper():
    tok = auth.issue_token("user-1", now=1000)
    assert auth.read_token(tok, now=1001) == "user-1"
    assert auth.read_token(tok, now=1000 + 31 * 86400) is None  # expired
    uid, exp, sig = tok.split(".")
    assert auth.read_token(f"{uid}.{int(exp) + 99}.{sig}", now=1001) is None
    assert auth.read_token("garbage") is None


def test_login_requires_configuration(client):
    assert login(client).status_code == 503


def test_login_and_me(client, google):
    google()
    data = login(client).json()
    assert data["user"]["email"] == "asha@example.com"
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {data['token']}"})
    assert me.json()["user"]["id"] == "g-123"


@pytest.mark.parametrize("status,overrides", [
    (400, {}),
    (200, {"aud": "someone-else"}),
    (200, {"iss": "evil.com"}),
    (200, {"email_verified": "false"}),
])
def test_login_rejections(client, google, status, overrides):
    google(status, **overrides)
    assert login(client).status_code == 401


def test_sessions_require_auth(client):
    assert client.get("/api/sessions").status_code == 401
    assert client.get("/api/sessions", headers={"Authorization": "Bearer bad.token.here"}).status_code == 401


def test_sync_merges_and_clear(client, google):
    google()
    h = {"Authorization": f"Bearer {login(client).json()['token']}"}
    s1 = {"id": "a", "kind": "interview", "created_at": 2.0, "score": 70, "title": "SDE @ TCS"}
    s2 = {"id": "b", "kind": "resume", "created_at": 1.0, "score": 55}
    assert [s["id"] for s in client.post("/api/sessions/sync", json={"sessions": [s1]}, headers=h).json()["sessions"]] == ["a"]
    merged = client.post("/api/sessions/sync", json={"sessions": [s2, {**s1, "score": 80}]}, headers=h).json()["sessions"]
    assert [s["id"] for s in merged] == ["b", "a"]
    assert merged[1]["score"] == 80
    assert client.get("/api/sessions", headers=h).json()["sessions"] == merged
    assert client.delete("/api/sessions", headers=h).json() == {"ok": True}
    assert client.get("/api/sessions", headers=h).json()["sessions"] == []


def test_sync_validation(client, google):
    google()
    h = {"Authorization": f"Bearer {login(client).json()['token']}"}
    bad = {"id": "a", "kind": "poetry", "created_at": 1.0}
    assert client.post("/api/sessions/sync", json={"sessions": [bad]}, headers=h).status_code == 422
