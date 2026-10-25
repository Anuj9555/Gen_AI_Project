from typing import List, Dict, Any


def calculate_itinerary_total(days: List[Dict[str, Any]]) -> float:
    total = 0.0
    for day in days:
        activities = day.get("activities", [])
        for act in activities:
            total += float(act.get("estimated_cost", 0.0) or 0.0)
        food = day.get("food_recommendations", [])
        for f in food:
            total += float(f.get("estimated_cost", 0.0) or 0.0)
        trans = day.get("transportation", [])
        for t in trans:
            total += float(t.get("estimated_cost", 0.0) or 0.0)
    return round(total, 2)


def calculate_budget_breakdown(budget: float, travel_style: str = "Balanced") -> Dict[str, float]:
    """
    Returns estimated budget distribution based on style.
    """
    style_weights = {
        "Budget": {"activities": 0.25, "food": 0.35, "accommodation": 0.25, "transportation": 0.15},
        "Balanced": {"activities": 0.30, "food": 0.30, "accommodation": 0.25, "transportation": 0.15},
        "Luxury": {"activities": 0.30, "food": 0.25, "accommodation": 0.35, "transportation": 0.10},
        "Adventure": {"activities": 0.45, "food": 0.25, "accommodation": 0.15, "transportation": 0.15},
        "Relaxed": {"activities": 0.20, "food": 0.35, "accommodation": 0.35, "transportation": 0.10},
        "Cultural": {"activities": 0.40, "food": 0.30, "accommodation": 0.20, "transportation": 0.10},
        "Romantic": {"activities": 0.25, "food": 0.35, "accommodation": 0.30, "transportation": 0.10},
        "Family": {"activities": 0.35, "food": 0.30, "accommodation": 0.25, "transportation": 0.10},
    }
    weights = style_weights.get(travel_style, style_weights["Balanced"])
    return {k: round(budget * v, 2) for k, v in weights.items()}
