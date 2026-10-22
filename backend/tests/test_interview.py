from app.engines import interview


def test_bank_questions_starts_with_intro_and_respects_count():
    qs = interview.bank_questions("it", "software engineer", "", 5, seed=1)
    assert len(qs) == 5
    assert qs[0]["question"] == "Tell me about yourself."
    assert len({q["question"] for q in qs}) == 5


def test_bank_questions_falls_back_when_filters_too_narrow():
    qs = interview.bank_questions("finance", "nonexistent role", "Nowhere Ltd", 4, seed=2)
    assert len(qs) == 4


def test_heuristic_feedback_rewards_structure_and_numbers():
    weak = interview.heuristic_feedback("Tell me about a failure.", "I failed once.", "behavioral")
    strong_answer = (
        "In my last role at an e-commerce startup, the situation was that checkout errors were rising. "
        "My goal was to cut failed payments before the festive sale. I decided to add retries with "
        "idempotency keys and I led a small team of three to ship it in two weeks. As a result, failed "
        "payments reduced by 38% and we saved roughly ₹12 lakh in lost orders. I learned to involve the "
        "payments partner early and to monitor dashboards daily during launches, which improved our "
        "release process across the whole engineering organisation."
    )
    strong = interview.heuristic_feedback("Tell me about a failure.", strong_answer, "behavioral")
    assert weak["rating"] <= 3
    assert strong["rating"] >= 8
    assert strong["rating"] > weak["rating"]
    assert any("STAR" in s for s in strong["strengths"])
    assert weak["improvements"]


def test_heuristic_model_answer_uses_bank_tip():
    fb = interview.heuristic_feedback("Tell me about yourself.", "I am an engineer.", "hr")
    assert "Present-Past-Future" in fb["model_answer"]


def test_start_fallback(client):
    resp = client.post("/api/interview/start", json={"industry": "it", "role": "software engineer", "count": 4})
    data = resp.json()
    assert resp.status_code == 200
    assert data["source"] == "fallback"
    assert len(data["questions"]) == 4
    assert data["session_id"]


def test_start_uses_ai_and_sanitises(client, fake_ai):
    calls = fake_ai({"questions": [
        {"question": "Introduce yourself.", "category": "HR", "tip": "Be brief"},
        {"question": "Why Flipkart?", "category": "weird"},
        {"question": "   "},
        "garbage",
    ]})
    data = client.post("/api/interview/start", json={"company": "Flipkart", "count": 3}).json()
    assert data["source"] == "ai"
    assert [q["category"] for q in data["questions"]] == ["hr", "behavioral"]
    assert "Flipkart" in calls[0]


def test_start_falls_back_when_ai_returns_too_few(client, fake_ai):
    fake_ai({"questions": [{"question": "Only one?"}]})
    data = client.post("/api/interview/start", json={"industry": "it", "count": 6}).json()
    assert data["source"] == "fallback" and len(data["questions"]) == 6


def test_start_validation(client):
    assert client.post("/api/interview/start", json={"count": 50}).status_code == 422
    assert client.post("/api/interview/start", json={"level": "ceo"}).status_code == 422


def test_feedback_fallback(client):
    body = {"question": "Tell me about yourself.", "answer": "I am a developer with 3 years at TCS.", "category": "hr"}
    data = client.post("/api/interview/feedback", json=body).json()
    assert data["source"] == "fallback"
    assert 1 <= data["rating"] <= 10
    assert data["model_answer"]


def test_feedback_ai_clamps_rating(client, fake_ai):
    fake_ai({"rating": 14, "verdict": "Nice", "strengths": "Clear", "improvements": ["More data"],
             "model_answer": "Model."})
    data = client.post("/api/interview/feedback", json={"question": "Why us?", "answer": "Because."}).json()
    assert data == {"rating": 10, "verdict": "Nice", "strengths": ["Clear"], "improvements": ["More data"],
                    "model_answer": "Model.", "source": "ai"}


def test_feedback_ai_bad_rating_and_missing_model_answer(client, fake_ai):
    fake_ai({"rating": "great", "model_answer": "M"})
    assert client.post("/api/interview/feedback", json={"question": "Why us?", "answer": "x"}).json()["rating"] == 5
    fake_ai({"rating": 7})
    assert client.post("/api/interview/feedback", json={"question": "Why us?", "answer": "x"}).json()["source"] == "fallback"


def test_feedback_validation(client):
    assert client.post("/api/interview/feedback", json={"question": "Why us?", "answer": ""}).status_code == 422
