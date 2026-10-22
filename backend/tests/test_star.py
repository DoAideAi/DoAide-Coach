from app.engines import star

STORY = {
    "question": "Tell me about a time you missed a deadline.",
    "situation": "Our client release was due in two weeks and a teammate fell sick",
    "task": "deliver the reporting module on time with half the team",
    "action": "I cut the scope to the three must-have reports, automated the test data setup and paired daily with the junior developer",
    "result": "we shipped 1 day early and the client signed off with zero defects",
    "learning": "scope is the first lever, not working nights",
}


def test_template_uses_only_given_facts():
    text = star.build_star(STORY)
    assert text.startswith("Our client release was due in two weeks")
    assert "My task was to deliver the reporting module" in text
    assert "I cut the scope to the three must-have reports" in text
    assert "we shipped 1 day early" in text.lower()
    assert "scope is the first lever" in text.lower()


def test_lead_in_skips_texts_that_already_flow():
    assert star._lead_in("I negotiated a new date", "So I ") == "I negotiated a new date."
    assert star._lead_in("fixed the build", "So I ") == "So I fixed the build."
    assert star._lead_in("", "So I ") == ""


def test_structure_notes_flag_missing_metric_and_we_only_action():
    notes = star.check_structure({
        "action": "we all worked together as a team on it",
        "result": "the project went well",
    })
    joined = " ".join(notes)
    assert "no number" in joined
    assert "'we'" in joined


def test_structure_notes_quiet_on_good_story():
    notes = star.check_structure(STORY)
    assert notes == []


def test_stats_speaking_time():
    s = star.stats("word " * 130)
    assert s == {"word_count": 130, "speaking_seconds": 60}


async def test_fallback_without_ai():
    out = await star.generate_star(STORY)
    assert out["source"] == "fallback"
    assert out["answer"] == star.build_star(STORY)
    assert len(out["tips"]) >= 2
    assert out["word_count"] > 20


async def test_ai_answer_is_used_and_prompt_forbids_invention(fake_ai):
    polished = " ".join(["word"] * 150)
    calls = fake_ai({"answer": polished, "tips": ["Name the client's industry", ""]})
    out = await star.generate_star(STORY)
    assert out["answer"] == polished
    assert out["source"] == "ai"
    assert "Name the client's industry" in out["tips"]
    assert "never invent" in calls[0]
    assert "missed a deadline" in calls[0]


async def test_ai_answer_with_wrong_length_falls_back(fake_ai):
    fake_ai({"answer": "too short", "tips": []})
    out = await star.generate_star(STORY)
    assert out["source"] == "fallback"


def test_api_endpoint(client):
    body = {k: v for k, v in STORY.items()}
    r = client.post("/api/star/generate", json=body)
    assert r.status_code == 200
    data = r.json()
    assert data["source"] == "fallback"
    assert "I cut the scope" in data["answer"]
    assert data["word_count"] > 20


def test_api_validates_short_inputs(client):
    r = client.post("/api/star/generate", json={"situation": "x", "task": "y", "action": "z", "result": "ok"})
    assert r.status_code == 422
