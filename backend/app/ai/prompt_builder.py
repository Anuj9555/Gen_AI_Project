import os
from typing import Dict, Any

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "prompt_templates")


def load_template(filename: str) -> str:
    path = os.path.join(TEMPLATES_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


class PromptBuilder:
    @staticmethod
    def build_itinerary_prompt(trip_data: Dict[str, Any], num_days: int) -> str:
        template = load_template("itinerary_prompt.txt")
        return template.format(
            destination=trip_data.get("destination", "Unknown Destination"),
            title=trip_data.get("title", "My Trip"),
            start_date=trip_data.get("start_date", ""),
            end_date=trip_data.get("end_date", ""),
            num_days=num_days,
            budget=trip_data.get("budget", 1500),
            currency=trip_data.get("currency", "USD"),
            travel_style=trip_data.get("travel_style", "Balanced"),
            group_size=trip_data.get("group_size", 1),
            pace=trip_data.get("pace", "Balanced"),
            interests=", ".join(trip_data.get("interests", [])) or "Culture, Food, Sightseeing",
            accommodation_preference=trip_data.get("accommodation_preference", "Boutique Hotel"),
            transportation_preference=trip_data.get("transportation_preference", "Public Transit"),
            food_preference=trip_data.get("food_preference", "Local specialties"),
            special_requirements=trip_data.get("special_requirements") or "None",
        )

    @staticmethod
    def build_regenerate_day_prompt(
        trip_data: Dict[str, Any],
        day_number: int,
        date: str,
        preferences_override: str = ""
    ) -> str:
        template = load_template("regenerate_day_prompt.txt")
        budget = float(trip_data.get("budget", 1000))
        daily_budget = round(budget / max(1, 3), 2)
        return template.format(
            day_number=day_number,
            destination=trip_data.get("destination", "Destination"),
            date=date,
            travel_style=trip_data.get("travel_style", "Balanced"),
            pace=trip_data.get("pace", "Balanced"),
            interests=", ".join(trip_data.get("interests", [])) or "General",
            daily_budget=daily_budget,
            currency=trip_data.get("currency", "USD"),
            preferences_override=preferences_override or "Exciting alternative activities and fresh hidden gems",
        )

    @staticmethod
    def build_recommendation_prompt(trip_data: Dict[str, Any], category: str = "All") -> str:
        template = load_template("recommendation_prompt.txt")
        return template.format(
            destination=trip_data.get("destination", "Destination"),
            travel_style=trip_data.get("travel_style", "Balanced"),
            interests=", ".join(trip_data.get("interests", [])) or "Sightseeing, Food",
            category=category,
            budget=trip_data.get("budget", 1000),
            currency=trip_data.get("currency", "USD"),
        )
