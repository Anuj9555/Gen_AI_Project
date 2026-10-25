from typing import Dict, Any, List, Optional
from app.ai.client import ai_client
from app.ai.prompt_builder import PromptBuilder
from app.ai.response_parser import ResponseParser
from app.schemas.recommendation_schema import RecommendationBase


class RecommendationEngine:
    async def get_recommendations(
        self, trip_data: Dict[str, Any], category: Optional[str] = None
    ) -> List[RecommendationBase]:
        destination = trip_data.get("destination", "Paris")
        style = trip_data.get("travel_style", "Balanced")

        # Preset high quality catalog for top categories
        catalog: List[RecommendationBase] = [
            RecommendationBase(
                category="Attractions",
                name=f"{destination} Grand Historic Landmark",
                description=f"The iconic centerpiece of {destination}, renowned worldwide for its timeless architecture and historical significance.",
                location=f"Central Plaza, {destination}",
                rating=4.9,
                estimated_cost=25.0,
                reason="Absolute must-visit highlight for first-time and returning visitors.",
                source="AI Curator",
            ),
            RecommendationBase(
                category="Attractions",
                name=f"Old Quarter Heritage Walk",
                description="Picturesque cobblestone lanes flanked by historic facades, vintage street lamps, and centuries of preserved culture.",
                location=f"Old Town, {destination}",
                rating=4.8,
                estimated_cost=0.0,
                reason="Rich cultural immersion with zero admission fee.",
                source="AI Curator",
            ),
            RecommendationBase(
                category="Restaurants",
                name=f"Le Petit {destination} Bistro",
                description="Cozy, beloved neighbourhood bistro serving seasonal farm-fresh dishes and authentic local desserts.",
                location=f"Bistro Street, {destination}",
                rating=4.7,
                estimated_cost=35.0,
                reason="Rated #1 local culinary gem by travelers for warm atmosphere and honest pricing.",
                source="AI Curator",
            ),
            RecommendationBase(
                category="Restaurants",
                name="Panorama Sky Lounge & Dining",
                description="Elevated dining offering sweeping skyline views, artisanal cocktails, and fusion entrees.",
                location=f"Tower Promenade, {destination}",
                rating=4.8,
                estimated_cost=75.0,
                reason="Ideal for romantic evenings and special sunset dinners.",
                source="AI Curator",
            ),
            RecommendationBase(
                category="Hotels",
                name=f"The {destination} Boutique Haven",
                description="Sophisticated design hotel featuring bespoke interiors, spa amenities, and prime walkable location.",
                location=f"Arts District, {destination}",
                rating=4.9,
                estimated_cost=180.0,
                reason="Perfect balance of luxury comfort and walking proximity to top sites.",
                source="AI Curator",
            ),
            RecommendationBase(
                category="Hotels",
                name=f"{destination} Eco Lodge & Suites",
                description="Sustainable contemporary property emphasizing tranquility, lush green terraces, and organic breakfast.",
                location=f"Greenway District, {destination}",
                rating=4.6,
                estimated_cost=120.0,
                reason="Highly praised for peace, sustainability, and friendly concierge.",
                source="AI Curator",
            ),
            RecommendationBase(
                category="Transportation",
                name=f"{destination} City Transit Travel Pass",
                description="All-inclusive multi-day pass offering unlimited rides on metro lines, buses, trams, and river ferries.",
                location="All Transit Stations",
                rating=4.7,
                estimated_cost=28.0,
                reason="The most cost-effective and stress-free way to traverse the city.",
                source="AI Curator",
            ),
            RecommendationBase(
                category="Experiences",
                name="Chef-Led Local Market & Cooking Masterclass",
                description="Tour vibrant morning market stalls with a professional chef, followed by an intimate hands-on culinary workshop.",
                location=f"Culinary Atelier, {destination}",
                rating=5.0,
                estimated_cost=85.0,
                reason="Unforgettable cultural connection through authentic flavors and techniques.",
                source="AI Curator",
            ),
        ]

        if category and category.lower() != "all":
            filtered = [r for r in catalog if r.category.lower() == category.lower()]
            return filtered
        return catalog


recommendation_engine = RecommendationEngine()
