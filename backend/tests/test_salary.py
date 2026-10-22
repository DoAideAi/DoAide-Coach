import pytest

from app.engines import salary


@pytest.mark.parametrize("loc,tier", [("Bengaluru", 1), ("bangalore ", 1), ("Remote", 1), ("Jaipur", 2), ("Ranchi", 3)])
def test_city_tier(loc, tier):
    assert salary.city_tier(loc) == tier


def test_round_half():
    assert salary.round_half(12.26) == 12.5
    assert salary.round_half(12.2) == 12.0


def test_low_offer_gets_counter_above_offer():
    n = salary.compute_numbers(10, 11, 4, "Pune")
    assert n["offer_strength"] == "below_market"
    assert n["offered_hike_pct"] == 10.0
    assert n["typical_hike_pct"] == 35
    assert 11 < n["counter_offer"] <= 11 * 1.25
    assert n["walk_away"] == 11.5


def test_strong_offer():
    n = salary.compute_numbers(10, 16, 2, "Ranchi")
    assert n["offer_strength"] == "strong"
    assert n["counter_offer"] == salary.round_half(16 * 1.12)


def test_competing_offer_raises_counter():
    base = salary.compute_numbers(20, 24, 10, "Mumbai")
    with_comp = salary.compute_numbers(20, 24, 10, "Mumbai", competing_offer=28)
    assert with_comp["counter_offer"] > base["counter_offer"]
    assert with_comp["counter_offer"] <= 24 * 1.25


async def test_plan_fallback_mentions_counter():
    plan = await salary.negotiation_plan({"current_ctc": 8, "offered_ctc": 9, "experience_years": 3,
                                          "location": "Hyderabad", "role": "Data Analyst", "company": "Swiggy"})
    assert plan["source"] == "fallback"
    assert f"₹{plan['counter_offer']:g} LPA" in plan["script"]["counter_ask"]
    assert "Swiggy" in plan["script"]["email_template"]


def test_endpoint_ai(client, fake_ai):
    fake_ai({"opening": "Hi", "justification": ["a", "b"], "counter_ask": "Ask",
             "pushback_responses": [{"if_they_say": "No", "you_say": "Ok"}, {"if_they_say": ""}, "x"],
             "email_template": "Subject: x", "tips": ["t"]})
    data = client.post("/api/salary/negotiate", json={"current_ctc": 10, "offered_ctc": 12,
                                                      "experience_years": 5, "location": "Delhi"}).json()
    assert data["source"] == "ai"
    assert data["script"]["pushback_responses"] == [{"if_they_say": "No", "you_say": "Ok"}]
    assert data["counter_offer"] > 12


def test_endpoint_ai_empty_fields_use_fallback(client, fake_ai):
    fake_ai({"pushback_responses": []})
    data = client.post("/api/salary/negotiate", json={"current_ctc": 10, "offered_ctc": 12,
                                                      "experience_years": 5, "location": "Delhi"}).json()
    assert len(data["script"]["pushback_responses"]) == 3
    assert data["script"]["tips"]


def test_endpoint_rejects_rupees_instead_of_lpa(client):
    resp = client.post("/api/salary/negotiate", json={"current_ctc": 8, "offered_ctc": 900,
                                                      "experience_years": 3, "location": "Pune"})
    assert resp.status_code == 422
    assert client.post("/api/salary/negotiate", json={"current_ctc": 0, "offered_ctc": 5,
                                                      "experience_years": 1, "location": "Pune"}).status_code == 422
