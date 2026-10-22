# DoAide Coach

AI interview prep and career coaching for Indian job seekers. A DoAide product.

- **AI mock interviews**: pick a role, company, industry and level. The AI asks questions one at a time, and each typed answer gets a rating out of 10, strengths, improvements and a model answer.
- **Resume scorer**: paste a resume and a job description to get a match score, matched and missing keywords, an ATS checklist and suggestions.
- **Question bank**: 60+ behavioral, technical and HR questions, filterable by industry, company (TCS, Infosys, Amazon, Flipkart, HDFC Bank…) and role.
- **Salary negotiator**: enter current CTC, offer, experience and city to get a counter-offer, a walk-away number and a full script with an email template.
- **Progress dashboard**: scores over time, trend, weakest category.
- **No-login by default**: history lives in localStorage. Optional Google sign-in syncs it across devices.

## Stack

| Part | Tech | Port |
|---|---|---|
| Backend | FastAPI + SQLite, Gemini REST (`gemini-3.5-flash-lite`) | 3103 |
| Frontend | React 18 + Vite 6 + Tailwind 3.4 + React Router 6 | 3104 |

The FastAPI app also serves `frontend/dist` with an SPA fallback, so a single process on 3103 can host everything. `/sitemap.xml` and `/robots.txt` come from the backend.

### AI design

Every AI feature has a deterministic engine underneath, so the app still works if Gemini is down or no key is set (responses carry `"source": "ai" | "fallback"`):

- The resume score is computed locally (70% keyword coverage, 30% ATS structure) and blended 60/40 with Gemini's holistic fit score.
- Salary counter and walk-away numbers come from a transparent rule of thumb. Gemini only writes the script around them.
- Interview questions fall back to the curated bank, and feedback falls back to a STAR/length/metrics heuristic.

The Gemini key is read **only on the server** (`GEMINI_API_KEY` or `GEMINI_API_KEY_FILE`). It is sent in the `x-goog-api-key` header, never in a URL, and never reaches the browser. `/api/config` exposes only the public Google client ID and an `ai_enabled` flag. AI endpoints are rate limited per IP.

## Develop

```bash
# backend
cd backend
python3 -m venv venv && ./venv/bin/pip install -r requirements-dev.txt
cp .env.example .env   # set GEMINI_API_KEY_FILE etc.
./venv/bin/pytest --cov=app

# frontend
cd frontend
npm install
npm test
npm run build          # outputs dist/ for static serving
```

Run locally: `uvicorn app.main:app --port 3103` in `backend/` (serves the API and the built frontend), or `npm run dev` in `frontend/` (port 3104, proxies `/api` to 3103).

## Deploy

See `deploy/` for systemd units and the Caddy snippet (`coach.doaide.com`). The API binds to 127.0.0.1:3103, and `serve -s dist` handles 3104.

## Google sign-in

Create an OAuth 2.0 Web client in Google Cloud and add `https://coach.doaide.com` (and `http://localhost:3104`) as authorised JavaScript origins. Then set `GOOGLE_CLIENT_ID` and `SESSION_SECRET` on the backend. The frontend reads the client ID from `/api/config`, so no rebuild is needed.
