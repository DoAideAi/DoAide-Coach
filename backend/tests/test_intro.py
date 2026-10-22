from app.engines import intro

FRESHER = {
    "name": "Priya",
    "level": "fresher",
    "target_role": "Software Engineer",
    "target_company": "Infosys",
    "education": "B.Tech in Computer Science from VIT",
    "skills": "Java, SQL, React",
    "achievement": "built a library app used by 300 students",
    "why": "I want to work on large client projects",
}

EXPERIENCED = {
    "name": "Arjun",
    "level": "mid",
    "target_role": "Data Analyst",
    "current_role": "MIS Executive",
    "current_company": "HDFC Bank",
    "experience_years": 4,
    "skills": "Excel; Power BI\nSQL",
}


def test_split_and_join_skills():
    assert intro.split_skills("Java, SQL; React\nPython / Git") == ["Java", "SQL", "React", "Python", "Git"]
    assert intro.join_list(["Java", "SQL", "React"]) == "Java, SQL and React"
    assert intro.join_list(["Java"]) == "Java"


def test_fresher_template_uses_only_given_facts():
    text = intro.build_intro(FRESHER)
    assert "I'm Priya" in text
    assert "I recently completed B.Tech in Computer Science from VIT." in text
    assert "Java, SQL and React" in text
    assert "One thing I'm proud of: Built a library app used by 300 students." in text
    assert "the Software Engineer role at Infosys because I want to work on large client projects." in text
    assert "currently working" not in text


def test_experienced_template():
    text = intro.build_intro(EXPERIENCED)
    assert "currently working as a MIS Executive at HDFC Bank, with 4 years of experience" in text
    assert "Excel, Power BI and SQL" in text
    assert "excited about the Data Analyst role" in text


def test_stats_speaking_time():
    s = intro.stats("word " * 130)
    assert s == {"word_count": 130, "speaking_seconds": 60}


async def test_fallback_without_ai():
    out = await intro.generate_intro(FRESHER)
    assert out["source"] == "fallback"
    assert out["intro"] == intro.build_intro(FRESHER)
    assert out["tips"] == intro.TIPS
    assert out["word_count"] > 20


async def test_ai_answer_is_used_and_prompt_forbids_invention(fake_ai):
    polished = " ".join(["word"] * 120)
    calls = fake_ai({"intro": polished, "tips": ["Add a number", ""]})
    out = await intro.generate_intro(FRESHER, "standard")
    assert out == {"intro": polished, "tips": ["Add a number"], "source": "ai", "word_count": 120, "speaking_seconds": 55}
    assert "never invent" in calls[0]
    assert "Infosys" in calls[0]


async def test_ai_answer_with_wrong_length_falls_back(fake_ai):
    fake_ai({"intro": "Too short."})
    out = await intro.generate_intro(FRESHER, "short")
    assert out["source"] == "fallback"


def test_endpoint(client):
    resp = client.post("/api/intro/generate", json={**FRESHER, "length": "short"})
    assert resp.status_code == 200
    assert resp.json()["source"] == "fallback"
    assert "Priya" in resp.json()["intro"]


def test_endpoint_validates(client):
    assert client.post("/api/intro/generate", json={"name": "X"}).status_code == 422
    assert client.post("/api/intro/generate", json={"target_role": "SE", "length": "long"}).status_code == 422
