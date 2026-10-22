from app.data import question_bank as qb


def test_bank_is_well_formed():
    assert len(qb.QUESTIONS) >= 50
    ids = [q["id"] for q in qb.QUESTIONS]
    assert len(ids) == len(set(ids))
    for q in qb.QUESTIONS:
        assert q["category"] in qb.CATEGORIES
        assert q["industry"] in qb.INDUSTRIES + ["all"]
        assert q["difficulty"] in ("easy", "medium", "hard")
        assert q["tip"]
    # Every industry has at least one specific question.
    for ind in qb.INDUSTRIES:
        assert any(q["industry"] == ind for q in qb.QUESTIONS), ind


def test_search_filters():
    tech = qb.search(category="technical", industry="finance")
    assert tech and all(q["category"] == "technical" and q["industry"] in ("finance", "all") for q in tech)
    assert all(q["industry"] in ("it", "all") for q in qb.search(industry="it"))


def test_company_filter_puts_company_questions_first():
    res = qb.search(company="zomato")
    assert res[0]["companies"] and "Zomato" in res[0]["companies"]
    assert not any(q["companies"] and "Zomato" not in q["companies"] for q in res)


def test_text_search():
    res = qb.search(query="linked list")
    assert len(res) == 1 and "linked list" in res[0]["question"]


def test_questions_endpoint(client):
    data = client.get("/api/questions", params={"category": "hr"}).json()
    assert data["total"] == len(data["questions"]) > 5
    assert all(q["category"] == "hr" for q in data["questions"])


def test_meta_endpoint(client):
    meta = client.get("/api/questions/meta").json()
    assert meta["categories"] == ["behavioral", "technical", "hr"]
    assert "TCS" in meta["companies"] and "Flipkart" in meta["companies"]
    assert "software engineer" in meta["roles"]
    assert meta["total"] == len(qb.QUESTIONS)
