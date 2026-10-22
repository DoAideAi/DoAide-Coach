import httpx
import pytest

from app import gemini
from app.config import settings


def test_parse_json_text_strips_fences():
    assert gemini.parse_json_text('```json\n{"a": 1}\n```') == {"a": 1}
    assert gemini.parse_json_text('{"b": 2}') == {"b": 2}


async def test_no_key_returns_none():
    assert await gemini.generate_json("hi") is None


class _FakeClient:
    def __init__(self, response=None, exc=None, **_):
        self.response, self.exc, self.sent = response, exc, None

    async def __aenter__(self):
        return self

    async def __aexit__(self, *a):
        return False

    async def post(self, url, headers, json):
        self.sent = (url, headers, json)
        if self.exc:
            raise self.exc
        return self.response


@pytest.fixture
def keyed(monkeypatch):
    monkeypatch.setattr(settings, "gemini_api_key", "k-test")


async def test_success_sends_key_in_header_and_parses(keyed, monkeypatch):
    payload = {"candidates": [{"content": {"parts": [{"text": '{"ok": true}'}]}}]}
    fake = _FakeClient(httpx.Response(200, json=payload))
    monkeypatch.setattr(gemini.httpx, "AsyncClient", lambda **kw: fake)
    assert await gemini.generate_json("prompt") == {"ok": True}
    url, headers, body = fake.sent
    assert headers == {"x-goog-api-key": "k-test"}
    assert "k-test" not in url
    assert body["generationConfig"]["responseMimeType"] == "application/json"
    assert body["generationConfig"]["thinkingConfig"] == {"thinkingLevel": "minimal"}


@pytest.mark.parametrize("response,exc", [
    (httpx.Response(404, text="gone"), None),
    (httpx.Response(200, json={"candidates": []}), None),
    (httpx.Response(200, json={"candidates": [{"content": {"parts": [{"text": "not json"}]}}]}), None),
    (httpx.Response(200, json={"candidates": [{"content": {"parts": [{"text": "[1,2]"}]}}]}), None),
    (None, httpx.ConnectTimeout("slow")),
])
async def test_failures_return_none(keyed, monkeypatch, response, exc):
    monkeypatch.setattr(gemini.httpx, "AsyncClient", lambda **kw: _FakeClient(response, exc))
    assert await gemini.generate_json("prompt") is None


def test_key_file_is_read(tmp_path, monkeypatch):
    from app import config

    f = tmp_path / "key"
    f.write_text("  file-key\n")
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.setenv("GEMINI_API_KEY_FILE", str(f))
    assert config._gemini_key() == "file-key"
    monkeypatch.setenv("GEMINI_API_KEY_FILE", str(tmp_path / "missing"))
    assert config._gemini_key() == ""
