"""Shared text helpers for the deterministic engines."""
from __future__ import annotations

import re

STOPWORDS = set("""
a about above after again against all also am an and any are as at be because been before being
below between both but by can could did do does doing down during each etc few for from further
had has have having he her here hers him his how i if in into is it its itself just like may me
more most must my no nor not now of off on once only or other our ours out over own per please
same she should so some such than that the their them then there these they this those through
to too under until up us very was we were what when where which while who whom why will with
within without would you your yours able across along already among around based best candidate
candidates company day days ensure etc excellent experience good great help ideal including job
join looking new opportunity plus preferred required requirements responsibilities role skills
strong team teams work working years year using use well within us india indian looking knowledge
understanding ability good minimum least must key provide support various related relevant
""".split())

TOKEN = re.compile(r"[a-zA-Z][a-zA-Z0-9+#./-]*[a-zA-Z0-9+#]|[a-zA-Z]")


def tokens(text: str) -> list[str]:
    return [t.lower().strip(".") for t in TOKEN.findall(text)]


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def str_list(value: object, limit: int = 8) -> list[str]:
    """Coerce a model-provided field into a short list of non-empty strings."""
    if isinstance(value, str):
        value = [value]
    if not isinstance(value, list):
        return []
    return [str(v).strip() for v in value if str(v).strip()][:limit]
