"""DoAide Coach API, which also serves the built frontend from frontend/dist."""
from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles

from app import db
from app.config import settings
from app.routers import account, coach, questions

ROUTES = ["/", "/interview", "/resume", "/questions", "/salary", "/dashboard"]


@asynccontextmanager
async def lifespan(_: FastAPI):
    db.init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="DoAide Coach API", version="1.0.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["GET", "POST", "DELETE"],
        allow_headers=["Authorization", "Content-Type"],
    )
    app.include_router(coach.router)
    app.include_router(questions.router)
    app.include_router(account.router)

    @app.get("/api/health")
    def health() -> dict:
        return {"status": "ok"}

    @app.get("/api/config")
    def public_config() -> dict:
        # Only public values. The Gemini key never leaves the server.
        return {"google_client_id": settings.google_client_id, "ai_enabled": settings.ai_enabled}

    @app.get("/sitemap.xml")
    def sitemap() -> Response:
        urls = "".join(
            f"<url><loc>{settings.site_url}{path}</loc><changefreq>weekly</changefreq>"
            f"<priority>{'1.0' if path == '/' else '0.8'}</priority></url>"
            for path in ROUTES
        )
        xml = (
            '<?xml version="1.0" encoding="UTF-8"?>'
            f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>'
        )
        return Response(xml, media_type="application/xml")

    @app.get("/robots.txt")
    def robots() -> Response:
        body = f"User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: {settings.site_url}/sitemap.xml\n"
        return Response(body, media_type="text/plain")

    @app.api_route("/api/{path:path}", methods=["GET", "POST", "DELETE"])
    def api_not_found(path: str) -> JSONResponse:
        return JSONResponse({"detail": "Not found"}, status_code=404)

    dist = Path(settings.frontend_dist)
    if (dist / "assets").is_dir():
        app.mount("/assets", StaticFiles(directory=dist / "assets"), name="assets")

    @app.get("/{path:path}", include_in_schema=False)
    def spa(path: str) -> FileResponse:
        index = dist / "index.html"
        if not index.is_file():
            raise HTTPException(404, "Frontend not built. Run `npm run build` in frontend/.")
        # Serve real files from dist (favicon, og image); everything else is a client route.
        candidate = (dist / path).resolve()
        if path and candidate.is_file() and candidate.is_relative_to(dist.resolve()):
            return FileResponse(candidate)
        return FileResponse(index)

    return app


app = create_app()
