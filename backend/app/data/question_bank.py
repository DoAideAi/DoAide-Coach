"""Curated interview questions for the Indian job market.

Each entry: (question, category, industry, roles, companies, difficulty, tip).
``companies`` lists firms where the question (or a close variant) is commonly
reported; an empty tuple means it is asked broadly.
"""
from __future__ import annotations

CATEGORIES = ["behavioral", "technical", "hr"]
INDUSTRIES = ["it", "finance", "marketing", "sales", "consulting", "product", "hr", "operations"]

ANY = ()

_RAW: list[tuple[str, str, str, tuple[str, ...], tuple[str, ...], str, str]] = [
    # --- HR (asked across industries) ---
    ("Tell me about yourself.", "hr", "all", ANY, ANY, "easy",
     "Use Present-Past-Future: current role, 2 key achievements, why this role next. Keep it to 90 seconds."),
    ("Why do you want to leave your current company?", "hr", "all", ANY, ANY, "medium",
     "Focus on growth you're seeking, never criticise your current employer."),
    ("What are your salary expectations?", "hr", "all", ANY, ANY, "medium",
     "Give a researched range in LPA anchored slightly above your target, and ask about the CTC break-up."),
    ("What is your notice period, and can it be negotiated?", "hr", "all", ANY, ANY, "easy",
     "State it honestly. Mention if buyout or early release is possible and what you've already discussed."),
    ("Where do you see yourself in five years?", "hr", "all", ANY, ANY, "easy",
     "Show ambition aligned with the company's growth path: deeper expertise or leading a team."),
    ("Why should we hire you?", "hr", "all", ANY, ANY, "medium",
     "Map 3 of your strengths directly to the job description with one proof point each."),
    ("Are you open to relocation or working from the office five days a week?", "hr", "all", ANY,
     ("TCS", "Infosys", "Wipro", "Amazon"), "easy",
     "Be honest about constraints, but show flexibility where you can."),
    ("Why do you have a gap in your resume?", "hr", "all", ANY, ANY, "medium",
     "Be brief and factual, then pivot to what you learned or did to stay current."),
    ("Do you have any other offers in hand?", "hr", "all", ANY, ANY, "medium",
     "Be truthful. Mentioning an offer is fine; don't bluff a number you can't back up."),
    ("What do you know about our company?", "hr", "all", ANY, ANY, "easy",
     "Mention a recent product launch, earnings result, or news item, and connect it to your role."),
    ("What are your strengths and weaknesses?", "hr", "all", ANY, ANY, "easy",
     "Pick a real, non-critical weakness and show the concrete steps you're taking to improve it."),
    ("Do you have any questions for us?", "hr", "all", ANY, ANY, "easy",
     "Always ask 2 questions: what success looks like in 90 days, and how the team is structured."),

    # --- Behavioral ---
    ("Tell me about a time you handled a conflict with a teammate.", "behavioral", "all", ANY, ANY, "medium",
     "Use STAR. Show that you listened, found common ground, and focused on the outcome."),
    ("Describe a situation where you missed a deadline. What did you do?", "behavioral", "all", ANY, ANY, "medium",
     "Own the miss, explain how you communicated early, and what process you changed afterwards."),
    ("Tell me about your biggest professional achievement.", "behavioral", "all", ANY, ANY, "easy",
     "Quantify the impact: revenue, time saved, users, percentage improvement."),
    ("Give an example of when you showed leadership without formal authority.", "behavioral", "all", ANY,
     ("Amazon", "Flipkart"), "medium",
     "Show initiative: you spotted a problem, rallied people, and drove it to completion."),
    ("Tell me about a time you disagreed with your manager.", "behavioral", "all", ANY, ("Amazon",), "hard",
     "Show you disagreed with data, respectfully, and committed once a decision was made."),
    ("Describe a time you had to learn something new very quickly.", "behavioral", "all", ANY, ANY, "easy",
     "Name the skill, how you learned it (docs, mentors, practice) and the result you delivered."),
    ("Tell me about a time you went above and beyond for a customer.", "behavioral", "all", ANY,
     ("Amazon", "Zomato", "Swiggy"), "medium",
     "Customer obsession: describe the customer's pain, your extra effort, and the measurable result."),
    ("Describe a failure and what you learned from it.", "behavioral", "all", ANY, ANY, "medium",
     "Pick a genuine failure, take ownership, and spend most of the answer on the lessons."),
    ("How do you prioritise when everything is urgent?", "behavioral", "all", ANY, ANY, "medium",
     "Explain a framework (impact vs effort, Eisenhower) and a real example of using it."),
    ("Tell me about a time you used data to make a decision.", "behavioral", "all", ANY, ANY, "medium",
     "Walk through the data source, the analysis, the decision, and the measured outcome."),

    # --- IT / software ---
    ("Explain the four pillars of object-oriented programming with examples.", "technical", "it",
     ("software engineer", "java developer"), ("TCS", "Infosys", "Wipro", "HCLTech", "Cognizant"), "easy",
     "Cover encapsulation, abstraction, inheritance, polymorphism, each with a short real-world code example."),
    ("What is the difference between a process and a thread?", "technical", "it",
     ("software engineer",), ("Infosys", "Accenture", "Capgemini"), "easy",
     "Talk about memory space, context-switch cost, and when you would choose each."),
    ("Find the second largest element in an array in one pass.", "technical", "it",
     ("software engineer",), ("TCS", "Wipro", "Cognizant"), "easy",
     "Track the largest and second largest in a single loop; handle duplicates and arrays shorter than 2."),
    ("Reverse a linked list iteratively and recursively.", "technical", "it",
     ("software engineer",), ("Amazon", "Flipkart", "Paytm"), "medium",
     "Explain pointer changes step by step and state the O(n) time and space for each approach."),
    ("Design a URL shortener like bit.ly.", "technical", "it",
     ("software engineer", "backend developer"), ("Flipkart", "Amazon", "Razorpay", "PhonePe"), "hard",
     "Cover the API, ID generation (base62), storage, caching, redirects, analytics and scale estimates."),
    ("Design a food delivery order-tracking system.", "technical", "it",
     ("software engineer", "backend developer"), ("Zomato", "Swiggy"), "hard",
     "Discuss real-time location updates, websockets vs polling, state machine for orders, and scaling."),
    ("What are the differences between SQL and NoSQL databases? When would you use each?", "technical", "it",
     ("software engineer", "backend developer", "data analyst"), ANY, "medium",
     "Compare schema, consistency, scaling and query patterns; give one use case for each."),
    ("Explain how React's virtual DOM and reconciliation work.", "technical", "it",
     ("frontend developer",), ("Flipkart", "Swiggy", "CRED"), "medium",
     "Describe diffing, keys in lists, and how batching avoids unnecessary DOM writes."),
    ("Write a SQL query to find the top 3 salaries in each department.", "technical", "it",
     ("data analyst", "backend developer"), ("Deloitte", "Accenture", "Amazon"), "medium",
     "Use DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) and filter rank <= 3."),
    ("How would you handle a payment API that times out but may have succeeded?", "technical", "it",
     ("backend developer",), ("Razorpay", "PhonePe", "Paytm"), "hard",
     "Talk about idempotency keys, status reconciliation, retries with backoff and webhooks."),
    ("What happens when you type a URL into the browser and press Enter?", "technical", "it",
     ("software engineer",), ANY, "medium",
     "DNS lookup, TCP/TLS handshake, HTTP request, server processing, rendering pipeline."),
    ("Explain the difference between overfitting and underfitting.", "technical", "it",
     ("data scientist", "data analyst"), ("Fractal", "Mu Sigma", "Tiger Analytics"), "easy",
     "Use the bias-variance tradeoff, and mention regularisation, cross-validation and more data as fixes."),

    # --- Finance ---
    ("Walk me through the three financial statements and how they link.", "technical", "finance",
     ("financial analyst", "investment banking analyst"), ("Goldman Sachs", "JP Morgan", "Deloitte"), "medium",
     "Net income flows to retained earnings and the cash flow statement; depreciation links all three."),
    ("How would you value a company? Explain DCF.", "technical", "finance",
     ("financial analyst", "investment banking analyst"), ("Goldman Sachs", "Kotak", "Axis Capital"), "hard",
     "Project free cash flows, discount at WACC, add terminal value, and sanity-check with comparables."),
    ("Explain GST input tax credit with an example.", "technical", "finance",
     ("accountant", "chartered accountant"), ("Deloitte", "EY", "KPMG", "PwC"), "medium",
     "Show tax paid on purchases offset against output tax, and mention conditions like GSTR-2B matching."),
    ("What is the difference between NPA and a written-off loan?", "technical", "finance",
     ("credit analyst", "relationship manager"), ("HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"), "medium",
     "NPA: overdue 90+ days and still on books; write-off removes it from the books but recovery continues."),
    ("How does an increase in the RBI repo rate affect banks and borrowers?", "technical", "finance",
     ("financial analyst", "relationship manager"), ("HDFC Bank", "ICICI Bank", "Kotak"), "easy",
     "Costlier borrowing for banks, higher EMIs for floating-rate loans, slower credit growth, lower inflation."),
    ("What is working capital, and how would you improve it?", "technical", "finance",
     ("financial analyst", "accountant"), ANY, "easy",
     "Current assets minus current liabilities; improve via faster receivables, inventory control, better payables terms."),
    ("Explain the difference between TDS and advance tax.", "technical", "finance",
     ("accountant", "chartered accountant"), ("EY", "KPMG"), "easy",
     "TDS is deducted by the payer at source; advance tax is paid by the taxpayer in instalments."),
    ("Pitch me a stock you'd invest in.", "behavioral", "finance",
     ("equity research analyst", "investment banking analyst"), ("Motilal Oswal", "Kotak", "JP Morgan"), "hard",
     "Cover the thesis, valuation, catalysts and key risks in under 2 minutes."),

    # --- Marketing ---
    ("How would you launch a new D2C brand in tier-2 cities?", "technical", "marketing",
     ("marketing manager", "brand manager"), ("Hindustan Unilever", "Mamaearth", "boAt"), "hard",
     "Cover vernacular content, regional influencers, quick commerce/marketplaces, sampling and pricing packs."),
    ("Which metrics would you track for a performance marketing campaign?", "technical", "marketing",
     ("digital marketing executive", "performance marketer"), ("Nykaa", "Meesho", "Myntra"), "medium",
     "CTR, CPC, CPA, ROAS, conversion rate and LTV:CAC, and explain how they connect."),
    ("What is the difference between SEO and SEM?", "technical", "marketing",
     ("digital marketing executive",), ANY, "easy",
     "Organic vs paid, time to results, cost model, and how they complement each other."),
    ("Our app's installs dropped 20% last month. How would you investigate?", "technical", "marketing",
     ("growth marketer", "product marketer"), ("Swiggy", "Zomato", "CRED"), "hard",
     "Segment by channel, geo, platform, and creative; check tracking, seasonality, competitor activity."),
    ("Tell me about a campaign you admire and why.", "behavioral", "marketing",
     ("brand manager", "marketing manager"), ("Hindustan Unilever", "ITC", "P&G"), "easy",
     "Pick an Indian campaign (e.g. Cadbury, Zomato notifications), explain the insight, execution, and results."),
    ("How would you allocate a ₹10 lakh monthly marketing budget?", "technical", "marketing",
     ("marketing manager", "performance marketer"), ANY, "medium",
     "Tie the split to goals and funnel stage, keep 10-20% for experiments, and define how you'll measure."),

    # --- Sales ---
    ("Sell me this pen.", "behavioral", "sales", ("sales executive", "business development"), ANY, "easy",
     "Ask questions first to uncover a need, then pitch benefits that match it, then ask for the close."),
    ("How do you handle a client who says your product is too expensive?", "behavioral", "sales",
     ("sales executive", "account manager"), ("Zoho", "Freshworks", "BYJU'S"), "medium",
     "Acknowledge, reframe around value and ROI, offer options, and avoid discounting straight away."),
    ("How do you build a sales pipeline from scratch in a new territory?", "technical", "sales",
     ("business development", "sales manager"), ("Zoho", "Freshworks", "IndiaMART"), "medium",
     "ICP definition, lead sources (LinkedIn, events, referrals), outreach cadence, and CRM tracking."),

    # --- Consulting ---
    ("Estimate the number of cars sold in India each year.", "technical", "consulting",
     ("consultant", "business analyst"), ("McKinsey", "BCG", "Bain", "Deloitte"), "hard",
     "State assumptions clearly: households, ownership rates, replacement cycle. Sanity-check your final number."),
    ("A retail client's profits have fallen 15%. How would you approach this?", "technical", "consulting",
     ("consultant", "business analyst"), ("McKinsey", "BCG", "Accenture"), "hard",
     "Use a profit tree: revenue (price x volume) vs costs (fixed/variable), then dig into the biggest driver."),
    ("Why consulting?", "hr", "consulting", ("consultant",), ("McKinsey", "BCG", "Bain", "EY"), "easy",
     "Talk about problem variety, learning curve and impact, backed by an experience that shows the fit."),

    # --- Product ---
    ("How would you improve UPI payments for first-time users in rural India?", "technical", "product",
     ("product manager",), ("PhonePe", "Google", "Paytm"), "hard",
     "Define the user, pain points (trust, language, PIN anxiety), solutions, prioritisation, and success metrics."),
    ("Which metric would you choose as the north star for a quick-commerce app?", "technical", "product",
     ("product manager",), ("Zepto", "Blinkit", "Swiggy"), "medium",
     "Justify a metric like weekly ordering customers, and list the guardrail metrics you'd track with it."),
    ("Tell me about a product you love and how you would improve it.", "behavioral", "product",
     ("product manager",), ANY, "medium",
     "Pick a specific user segment, one real pain point, a focused solution, and how you'd measure it."),

    # --- HR function ---
    ("How would you reduce attrition in a 500-person BPO?", "technical", "hr",
     ("hr executive", "hr business partner"), ("Teleperformance", "Concentrix", "Genpact"), "medium",
     "Diagnose with exit data, then fix onboarding, manager quality, shift policies, and recognition."),
    ("Explain the key changes under India's new labour codes.", "technical", "hr",
     ("hr executive", "hr business partner"), ANY, "medium",
     "Wage definition (50% rule), gratuity for fixed-term staff, social security for gig workers, compliance simplification."),

    # --- Operations ---
    ("How would you reduce last-mile delivery cost in a metro city?", "technical", "operations",
     ("operations manager", "supply chain analyst"), ("Delhivery", "Amazon", "Flipkart"), "hard",
     "Route optimisation, dark stores, delivery density, slot-based delivery, and failed-delivery reduction."),
    ("How do you manage inventory for a festive season sale like Big Billion Days?", "technical", "operations",
     ("supply chain analyst", "operations manager"), ("Flipkart", "Amazon", "Myntra"), "hard",
     "Demand forecasting from past data, safety stock, vendor coordination, and warehouse capacity planning."),
]


def _build() -> list[dict]:
    out = []
    for i, (q, cat, ind, roles, companies, diff, tip) in enumerate(_RAW, start=1):
        out.append({
            "id": i,
            "question": q,
            "category": cat,
            "industry": ind,
            "roles": list(roles),
            "companies": list(companies),
            "difficulty": diff,
            "tip": tip,
        })
    return out


QUESTIONS: list[dict] = _build()


def companies() -> list[str]:
    return sorted({c for q in QUESTIONS for c in q["companies"]})


def roles() -> list[str]:
    return sorted({r for q in QUESTIONS for r in q["roles"]})


def search(
    category: str = "",
    industry: str = "",
    company: str = "",
    role: str = "",
    query: str = "",
) -> list[dict]:
    """Filter the bank. Industry-wide ("all") questions match any industry,
    and questions with no company/role list match any company/role."""
    result = []
    for q in QUESTIONS:
        if category and q["category"] != category:
            continue
        if industry and q["industry"] not in (industry, "all"):
            continue
        if company and q["companies"] and company.lower() not in (c.lower() for c in q["companies"]):
            continue
        if role and q["roles"] and role.lower() not in (r.lower() for r in q["roles"]):
            continue
        if query and query.lower() not in (q["question"] + " " + q["tip"]).lower():
            continue
        result.append(q)
    if company:
        # Questions actually reported at this company come before generic ones.
        result.sort(key=lambda q: not q["companies"])
    return result
