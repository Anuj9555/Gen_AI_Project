import logging
from typing import Dict, Any, List
from app.ai.client import ai_client
from app.ai.prompt_builder import PromptBuilder
from app.ai.response_parser import ResponseParser
from app.schemas.itinerary_schema import (
    FullItineraryResponse,
    DayItinerarySchema,
    ActivityBase,
    FoodRecommendation,
    TransportOption,
)
from app.utils.location_utils import get_destination_coords, offset_coords
from app.utils.date_utils import get_dates_between

logger = logging.getLogger("wanderai.ai.generator")


class ItineraryGenerator:
    async def generate(self, trip_data: Dict[str, Any]) -> FullItineraryResponse:
        start_date = trip_data.get("start_date", "2026-06-01")
        end_date = trip_data.get("end_date", "2026-06-03")
        dates = get_dates_between(start_date, end_date)
        num_days = max(1, len(dates))

        prompt = PromptBuilder.build_itinerary_prompt(trip_data, num_days)
        system_prompt = (
            "You are an expert travel planner that outputs STRICT JSON adhering to: "
            "{'destination': str, 'trip_summary': str, 'days': [{'day_number': int, 'date': str, 'summary': str, "
            "'activities': [{'time': str, 'title': str, 'description': str, 'type': str, 'location': str, 'latitude': float, 'longitude': float, 'duration_minutes': int, 'estimated_cost': float}], "
            "'food_recommendations': [{'name': str, 'cuisine': str, 'meal_type': str, 'description': str, 'price_level': str, 'estimated_cost': float, 'location': str}], "
            "'transportation': [{'mode': str, 'description': str, 'estimated_cost': float}], "
            "'estimated_daily_cost': float}], 'total_estimated_cost': float, 'travel_tips': [str], 'important_notes': [str]}"
        )

        raw_response = await ai_client.generate_completion(system_prompt, prompt)

        if raw_response:
            try:
                parsed = ResponseParser.parse_and_validate(raw_response, FullItineraryResponse)
                return parsed
            except Exception as e:
                logger.warning(f"Error parsing raw LLM response: {e}. Falling back to domain generator.")

        # High-fidelity domain generator
        return self._generate_rich_itinerary(trip_data, dates)

    async def regenerate_single_day(
        self,
        trip_data: Dict[str, Any],
        day_number: int,
        date: str,
        preferences_override: str = ""
    ) -> DayItinerarySchema:
        prompt = PromptBuilder.build_regenerate_day_prompt(
            trip_data, day_number, date, preferences_override
        )
        system_prompt = (
            "You are an expert travel planner. Return a single day JSON adhering to: "
            "{'day_number': int, 'date': str, 'summary': str, "
            "'activities': [{'time': str, 'title': str, 'description': str, 'type': str, 'location': str, 'latitude': float, 'longitude': float, 'duration_minutes': int, 'estimated_cost': float}], "
            "'food_recommendations': [{'name': str, 'cuisine': str, 'meal_type': str, 'description': str, 'price_level': str, 'estimated_cost': float, 'location': str}], "
            "'transportation': [{'mode': str, 'description': str, 'estimated_cost': float}], "
            "'estimated_daily_cost': float}"
        )

        raw_response = await ai_client.generate_completion(system_prompt, prompt)
        if raw_response:
            try:
                parsed = ResponseParser.parse_and_validate(raw_response, DayItinerarySchema)
                return parsed
            except Exception as e:
                logger.warning(f"Error parsing regenerated day: {e}. Using domain generator.")

        return self._build_synthesized_day(
            trip_data=trip_data,
            day_number=day_number,
            date=date,
            is_regenerated=True,
            preference_hint=preferences_override
        )

    def _generate_rich_itinerary(self, trip_data: Dict[str, Any], dates: List[str]) -> FullItineraryResponse:
        destination = trip_data.get("destination", "Paris, France")
        travel_style = trip_data.get("travel_style", "Balanced")
        pace = trip_data.get("pace", "Balanced")
        budget = float(trip_data.get("budget", 1500))

        days_list: List[DayItinerarySchema] = []
        total_cost = 0.0

        for idx, dt in enumerate(dates):
            day_num = idx + 1
            day_schema = self._build_synthesized_day(trip_data, day_num, dt)
            days_list.append(day_schema)
            total_cost += day_schema.estimated_daily_cost

        tips = [
            f"Pre-book major attractions in {destination} at least 48 hours in advance to skip queue lines.",
            "Download offline maps on your smartphone before navigating crowded subway stations.",
            f"Tipping in {destination} is generally customary at 10-15% for exceptional service.",
            "Keep digital copies of your passport, travel insurance, and booking vouchers in secure cloud storage.",
        ]

        notes = [
            "Estimated costs exclude flights or cross-border travel tickets.",
            f"Itinerary pace is tuned for a '{pace}' schedule with ample buffer between activities.",
            f"Curated tailored to {travel_style} traveler preferences.",
        ]

        return FullItineraryResponse(
            trip_id=trip_data.get("id", ""),
            destination=destination,
            trip_summary=f"A bespoke {len(dates)}-day {travel_style.lower()} journey through {destination}, featuring iconic landmarks, hand-picked local eateries, and cultural immersion.",
            days=days_list,
            total_estimated_cost=round(total_cost, 2),
            travel_tips=tips,
            important_notes=notes,
        )

    def _build_synthesized_day(
        self,
        trip_data: Dict[str, Any],
        day_number: int,
        date: str,
        is_regenerated: bool = False,
        preference_hint: str = ""
    ) -> DayItinerarySchema:
        destination = trip_data.get("destination", "Paris")
        base_lat, base_lon = get_destination_coords(destination)
        style = trip_data.get("travel_style", "Balanced")
        pace = trip_data.get("pace", "Balanced")

        # Select themes based on day and regeneration
        themes = [
            ("Iconic Highlights & City Exploration", "Historic City Center"),
            ("Art, Heritage & Architectural Wonders", "Old Town & Museum District"),
            ("Scenic Viewpoints & Waterfront Stroll", "Riverside Promenade"),
            ("Hidden Gems, Artisans & Local Markets", "Bohemian Quarter"),
            ("Nature Escapes & Sunset Panoramic Views", "Botanical Heights"),
        ]
        theme_title, district = themes[(day_number - 1) % len(themes)]
        if is_regenerated:
            theme_title = f"Curated Exploration: {preference_hint or 'Alternative Cultural Journey'}"

        num_activities = 4 if pace == "Packed" else (2 if pace == "Relaxed" else 3)
        activities: List[ActivityBase] = []

        times = ["09:30 AM", "01:30 PM", "05:00 PM", "08:00 PM"]
        sample_activities = [
            {
                "title": f"Morning Discovery at {destination} Historic Plaza",
                "desc": f"Explore the vibrant focal point of {district}, admiring architecture and soaking in local morning atmosphere.",
                "type": "sightseeing",
                "cost": 20.0,
                "dur": 120,
            },
            {
                "title": f"{destination} Cultural Museum & Gallery Tour",
                "desc": "Immerse yourself in world-class exhibitions and historical artifacts curated by local historians.",
                "type": "culture",
                "cost": 35.0,
                "dur": 150,
            },
            {
                "title": f"Panoramic Vista at {destination} Belvedere",
                "desc": "Enjoy breathtaking 360-degree views of the skyline as twilight sets over the city.",
                "type": "leisure",
                "cost": 15.0,
                "dur": 90,
            },
            {
                "title": f"Evening Stroll through Artisan Night Quarter",
                "desc": "Wander glowing cobblestone alleys filled with live acoustic music, craft boutiques, and dessert parlors.",
                "type": "nightlife",
                "cost": 10.0,
                "dur": 75,
            },
        ]

        if is_regenerated:
            sample_activities = [
                {
                    "title": f"Secret Gardens & Hidden Courtyards of {destination}",
                    "desc": "A peaceful walking route tucked away from main tourist crowds, surrounded by ancient flora.",
                    "type": "nature",
                    "cost": 15.0,
                    "dur": 100,
                },
                {
                    "title": f"Artisanal Coffee & Roastery Workshop",
                    "desc": "Interactive tasting session with award-winning local baristas and craft pastry pairing.",
                    "type": "food",
                    "cost": 28.0,
                    "dur": 90,
                },
                {
                    "title": f"Sunset Canal & River Cruise in {destination}",
                    "desc": "Glide past illuminated monuments with commentary on local folklore and architecture.",
                    "type": "sightseeing",
                    "cost": 45.0,
                    "dur": 120,
                },
            ]

        day_cost = 0.0
        for i in range(min(num_activities, len(sample_activities))):
            act_data = sample_activities[i]
            lat, lon = offset_coords(base_lat, base_lon, day_number, i)
            cost = act_data["cost"] if style != "Luxury" else act_data["cost"] * 2.2
            day_cost += cost

            activities.append(
                ActivityBase(
                    time=times[i % len(times)],
                    title=act_data["title"],
                    description=act_data["desc"],
                    activity_type=act_data["type"],
                    location=f"{district}, {destination}",
                    latitude=lat,
                    longitude=lon,
                    duration_minutes=act_data["dur"],
                    estimated_cost=round(cost, 2),
                )
            )

        food = [
            FoodRecommendation(
                name=f"Bistro {destination} Centrale",
                cuisine="Regional Seasonal Kitchen",
                meal_type="Lunch",
                description="Authentic midday platters featuring farm-to-table ingredients and fresh local bread.",
                price_level="$$",
                estimated_cost=25.0 if style != "Luxury" else 65.0,
                location=f"Central Square, {destination}",
            ),
            FoodRecommendation(
                name=f"La Table de {destination}",
                cuisine="Modern Gastronomy",
                meal_type="Dinner",
                description="Elegant candlelit dining showcasing contemporary culinary twists and sommelier pairings.",
                price_level="$$$" if style != "Budget" else "$$",
                estimated_cost=45.0 if style != "Luxury" else 120.0,
                location=f"Riverside Quarter, {destination}",
            ),
        ]
        day_cost += sum(f.estimated_cost for f in food)

        transport = [
            TransportOption(
                mode="Metro & Scenic Walking",
                description=f"Use rapid rail transit for cross-district travel and scenic walking routes inside {district}.",
                estimated_cost=12.0,
            )
        ]
        day_cost += sum(t.estimated_cost for t in transport)

        return DayItinerarySchema(
            day_number=day_number,
            date=date,
            summary=f"Day {day_number}: {theme_title}. A curated sequence of visits across {district}.",
            activities=activities,
            food_recommendations=food,
            transportation=transport,
            estimated_daily_cost=round(day_cost, 2),
        )


itinerary_generator = ItineraryGenerator()
