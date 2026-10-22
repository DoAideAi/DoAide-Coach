from app.engines import resume

JD = """We are hiring a Backend Developer in Bengaluru. Requirements: 3+ years with Python, FastAPI or Django,
PostgreSQL, Redis, Docker and AWS. Experience with microservices and system design. Kafka is a plus.
You will build payment APIs and payment reconciliation services."""

GOOD = """Rahul Sharma | rahul.sharma@example.com | +91 98765 43210
SUMMARY Backend developer with 4 years building payment systems.
EXPERIENCE
Razorpay - Backend Developer (2021-2024)
- Built payment APIs in Python and FastAPI serving 2M requests/day
- Reduced reconciliation time by 40% using PostgreSQL and Redis
- Led migration of 6 microservices to Docker on AWS, cutting costs by 25%
- Designed retry system that improved success rate by 3%
- Mentored 3 juniors and owned on-call for payment services
EDUCATION B.Tech, Computer Science, VIT Vellore, 2020
SKILLS Python, FastAPI, Django, PostgreSQL, Redis, Docker, AWS, system design, microservices
PROJECTS Open-source rate limiter; implemented token bucket in Python and launched internal tooling.
""" + "Delivered features across payment reconciliation and payment APIs. " * 15

WEAK = "I am a hard working person looking for a job. I know MS Office and can do data entry work quickly." * 2


def test_extract_keywords_prefers_lexicon_and_dedupes():
    kws = resume.extract_keywords(JD)
    for k in ["python", "fastapi", "django", "postgresql", "redis", "docker", "aws", "kafka", "system design"]:
        assert k in kws
    assert "payment" in kws  # repeated JD term
    kws2 = resume.extract_keywords("Need advanced excel and excel macros. Advanced Excel is a must.")
    assert "advanced excel" in kws2 and "excel" not in kws2


def test_structure_checks():
    checks = resume.structure_checks(GOOD)
    assert all(checks.values()), checks
    weak = resume.structure_checks(WEAK)
    assert not weak["contact_email"] and not weak["section_experience"]


def test_local_score_orders_good_above_weak():
    good = resume.local_score(GOOD, JD)
    weak = resume.local_score(WEAK, JD)
    assert good["score"] > 75 > weak["score"]
    assert "kafka" in good["missing_keywords"]
    assert "python" in good["matched_keywords"]


def test_word_boundaries():
    assert not resume._has_phrase("javascript developer", "java")
    assert resume._has_phrase("c++ and java", "c++")


async def test_score_fallback_has_suggestions():
    res = await resume.score_resume(WEAK, JD)
    assert res["source"] == "fallback"
    assert res["suggestions"][0].startswith("Work these JD keywords")
    assert res["summary"] == resume.verdict(res["score"])


def test_verdict_bands():
    assert "Strong" in resume.verdict(80)
    assert "Decent" in resume.verdict(60)
    assert "Needs work" in resume.verdict(20)


def test_score_endpoint_blends_ai(client, fake_ai):
    local = resume.local_score(GOOD, JD)["score"]
    fake_ai({"fit_score": 100, "summary": "Great fit", "strengths": ["Payments"], "suggestions": ["Add Kafka"],
             "rewritten_summary": "Backend dev."})
    data = client.post("/api/resume/score", json={"resume": GOOD, "job_description": JD}).json()
    assert data["source"] == "ai"
    assert data["score"] == round(0.6 * local + 40)
    assert data["suggestions"] == ["Add Kafka"]


def test_score_endpoint_ai_garbage_fit_score(client, fake_ai):
    fake_ai({"fit_score": "n/a", "suggestions": []})
    data = client.post("/api/resume/score", json={"resume": GOOD, "job_description": JD}).json()
    assert data["score"] == resume.local_score(GOOD, JD)["score"]
    assert data["suggestions"]  # falls back to local suggestions


def test_score_validation(client):
    assert client.post("/api/resume/score", json={"resume": "short", "job_description": JD}).status_code == 422
