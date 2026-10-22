from app.config import settings


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_public_config_never_exposes_gemini_key(client, monkeypatch):
    monkeypatch.setattr(settings, "gemini_api_key", "SECRET-KEY-123")
    monkeypatch.setattr(settings, "google_client_id", "abc.apps.googleusercontent.com")
    resp = client.get("/api/config")
    assert resp.json() == {"google_client_id": "abc.apps.googleusercontent.com", "ai_enabled": True}
    assert "SECRET-KEY-123" not in resp.text


def test_sitemap_is_xml_and_lists_all_routes(client):
    resp = client.get("/sitemap.xml")
    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("application/xml")
    for path in ["/interview", "/resume", "/questions", "/salary", "/dashboard", "/tell-me-about-yourself",
                 "/star-method", "/coach-vs-interviewbit", "/guides",
                 "/guides/how-to-negotiate-salary-india", "/guides/tell-me-about-yourself-answer",
                 "/guides/ats-resume-keywords-india"]:
        assert f"<loc>https://coach.doaide.com{path}</loc>" in resp.text


def test_robots(client):
    resp = client.get("/robots.txt")
    assert resp.headers["content-type"].startswith("text/plain")
    assert "Sitemap: https://coach.doaide.com/sitemap.xml" in resp.text


def test_unknown_api_route_is_json_404(client):
    resp = client.get("/api/nope")
    assert resp.status_code == 404
    assert resp.json() == {"detail": "Not found"}


def test_spa_without_build_returns_404(client):
    assert client.get("/interview").status_code == 404


def test_spa_serves_index_for_client_routes(tmp_path, monkeypatch):
    from fastapi.testclient import TestClient

    from app.main import create_app

    dist = tmp_path / "built"
    (dist / "assets").mkdir(parents=True)
    (dist / "index.html").write_text("<html>coach</html>")
    (dist / "assets" / "app.js").write_text("console.log(1)")
    (dist / "favicon.svg").write_text("<svg/>")
    monkeypatch.setattr(settings, "frontend_dist", str(dist))
    with TestClient(create_app()) as c:
        assert c.get("/salary").text == "<html>coach</html>"
        assert c.get("/assets/app.js").text == "console.log(1)"
        assert c.get("/favicon.svg").text == "<svg/>"
        assert c.get("/../../etc/passwd").text == "<html>coach</html>"


def test_rate_limit_on_ai_endpoints(client, monkeypatch):
    monkeypatch.setattr(settings, "ai_rate_limit", 2)
    body = {"role": "software engineer", "industry": "it", "count": 3}
    assert client.post("/api/interview/start", json=body).status_code == 200
    assert client.post("/api/interview/start", json=body).status_code == 200
    assert client.post("/api/interview/start", json=body).status_code == 429
    # Non-AI endpoints are not limited.
    assert client.get("/api/questions").status_code == 200
