"""Salary negotiation: deterministic numbers, AI-written script.

The counter-offer math is a transparent rule of thumb for Indian lateral
moves (typical switch hikes of 20-40%). It is presented as indicative, not
as market data.
"""
from __future__ import annotations

from app import gemini
from app.engines.text import str_list

TIER1_CITIES = {
    "bengaluru", "bangalore", "mumbai", "delhi", "new delhi", "gurugram", "gurgaon", "noida",
    "hyderabad", "pune", "chennai",
}
TIER2_CITIES = {
    "kolkata", "ahmedabad", "jaipur", "kochi", "chandigarh", "indore", "coimbatore", "lucknow",
    "nagpur", "bhubaneswar", "thiruvananthapuram", "mysuru", "mysore", "vadodara", "visakhapatnam",
}


def round_half(value: float) -> float:
    """Round to the nearest 0.5 LPA, which is how Indian offers are usually quoted."""
    return round(value * 2) / 2


def city_tier(location: str) -> int:
    loc = location.strip().lower()
    if loc in TIER1_CITIES or loc == "remote":
        return 1
    if loc in TIER2_CITIES:
        return 2
    return 3


def target_hike(experience_years: float, tier: int) -> float:
    if experience_years < 3:
        hike = 0.35
    elif experience_years <= 8:
        hike = 0.30
    else:
        hike = 0.25
    return hike + (0.05 if tier == 1 else 0.0)


def compute_numbers(
    current_ctc: float,
    offered_ctc: float,
    experience_years: float,
    location: str,
    competing_offer: float | None = None,
) -> dict:
    tier = city_tier(location)
    hike = target_hike(experience_years, tier)
    offered_hike = (offered_ctc - current_ctc) / current_ctc * 100 if current_ctc else 0.0
    counter = max(offered_ctc * 1.12, current_ctc * (1 + hike))
    if competing_offer and competing_offer > offered_ctc:
        counter = max(counter, competing_offer * 1.03)
    # Don't ask for more than ~25% above the offer; it tends to stall talks.
    counter = min(counter, offered_ctc * 1.25)
    walk_away = max(offered_ctc, current_ctc * 1.15)
    counter = round_half(max(counter, walk_away))
    if offered_hike >= hike * 100 + 10:
        strength = "strong"
    elif offered_hike >= hike * 100 - 5:
        strength = "fair"
    else:
        strength = "below_market"
    return {
        "offered_hike_pct": round(offered_hike, 1),
        "typical_hike_pct": round(hike * 100),
        "counter_offer": counter,
        "walk_away": round_half(walk_away),
        "offer_strength": strength,
        "city_tier": tier,
    }


def fallback_script(inp: dict, nums: dict) -> dict:
    role = inp.get("role") or "this role"
    company = inp.get("company") or "the company"
    counter = nums["counter_offer"]
    return {
        "opening": (
            f"Thank you so much for the offer for {role}. I'm genuinely excited about joining {company} "
            "and the work the team is doing."
        ),
        "justification": [
            f"With {inp['experience_years']:g} years of experience, I bring hands-on expertise that lets me contribute from day one.",
            f"My current CTC is ₹{inp['current_ctc']:g} LPA, and the offer is a {nums['offered_hike_pct']:g}% increase, "
            f"while typical hikes for a move like this are around {nums['typical_hike_pct']}%.",
            "I've delivered measurable results in my current role, and I'm happy to walk through specific examples.",
        ],
        "counter_ask": (
            f"Based on my experience and market benchmarks, I was hoping for a CTC closer to ₹{counter:g} LPA. "
            "Is there flexibility to get there, either in fixed pay or through a joining bonus?"
        ),
        "pushback_responses": [
            {"if_they_say": "This is the maximum for this band.",
             "you_say": "I understand. Could we bridge the gap with a one-time joining bonus, or an early salary review after 6 months?"},
            {"if_they_say": "We can't match your expectation.",
             "you_say": "I appreciate your transparency. Could we look at the fixed component, or at covering my notice-period buyout?"},
            {"if_they_say": "Why do you expect this much?",
             "you_say": "It's based on my current CTC, the scope of this role, and what similar roles in the market offer. I'm confident about the value I'll add."},
        ],
        "email_template": (
            f"Subject: Offer discussion – {role}\n\nDear Hiring Team,\n\nThank you for the offer for the {role} position. "
            f"I'm excited about the opportunity at {company}.\n\nAfter reviewing the offer, I'd like to discuss the compensation. "
            f"Considering my experience and the role's responsibilities, I'd be grateful if we could revise the CTC to ₹{counter:g} LPA. "
            "I'm flexible on how this is structured.\n\nLooking forward to your response.\n\nWarm regards,\n[Your Name]"
        ),
        "tips": [
            "Ask for the full CTC break-up: fixed, variable, PF, gratuity, insurance and ESOPs. Negotiate the fixed part first.",
            "Variable pay is often paid out at 60-80%, so compare offers on fixed pay plus guaranteed components.",
            "If you have a 60-90 day notice period, ask whether they'll cover a notice buyout.",
            "Negotiate on a call, confirm in writing, and never accept verbally before you have the revised offer letter.",
        ],
    }


async def negotiation_plan(inp: dict) -> dict:
    nums = compute_numbers(
        inp["current_ctc"], inp["offered_ctc"], inp["experience_years"], inp["location"],
        inp.get("competing_offer"),
    )
    prompt = f"""Write a salary negotiation script for an Indian job seeker.
Inputs: current CTC ₹{inp["current_ctc"]} LPA, offered CTC ₹{inp["offered_ctc"]} LPA,
competing offer: {inp.get("competing_offer") or "none"}, experience {inp["experience_years"]} years,
location {inp["location"]} (tier {nums["city_tier"]}), role "{inp.get("role") or "unspecified"}",
industry "{inp.get("industry") or "unspecified"}", company "{inp.get("company") or "unspecified"}".
Our calculation: offered hike {nums["offered_hike_pct"]}%, typical hike {nums["typical_hike_pct"]}%,
recommended counter ₹{nums["counter_offer"]} LPA, walk-away ₹{nums["walk_away"]} LPA.
Use the recommended counter number exactly. Be polite and confident, and use Indian HR norms
(CTC break-up, fixed vs variable, joining bonus, notice buyout, ESOPs).

Return JSON with exactly these keys:
{{"opening": "1-2 sentences",
 "justification": ["3 talking points"],
 "counter_ask": "the exact sentence to make the ask",
 "pushback_responses": [{{"if_they_say": "...", "you_say": "..."}}, 3 items],
 "email_template": "a short email including a Subject line",
 "tips": ["4 practical tips specific to this situation"]}}"""
    ai = await gemini.generate_json(prompt, temperature=0.5)
    base = fallback_script(inp, nums)
    if ai:
        pushback = [
            {"if_they_say": str(p.get("if_they_say", "")).strip(), "you_say": str(p.get("you_say", "")).strip()}
            for p in ai.get("pushback_responses", []) if isinstance(p, dict)
        ][:4]
        script = {
            "opening": str(ai.get("opening") or base["opening"]).strip(),
            "justification": str_list(ai.get("justification"), 5) or base["justification"],
            "counter_ask": str(ai.get("counter_ask") or base["counter_ask"]).strip(),
            "pushback_responses": [p for p in pushback if p["if_they_say"] and p["you_say"]]
            or base["pushback_responses"],
            "email_template": str(ai.get("email_template") or base["email_template"]).strip(),
            "tips": str_list(ai.get("tips"), 6) or base["tips"],
        }
        source = "ai"
    else:
        script, source = base, "fallback"
    return {**nums, "script": script, "source": source}
