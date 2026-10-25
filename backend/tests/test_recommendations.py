import pytest
from app.services.trip_service import trip_service
from app.services.recommendation_service import recommendation_service
from app.schemas.trip_schema import TripCreateRequest


@pytest.mark.asyncio
async def test_recommendations_fetching_and_filtering():
    user_id = "rec-test-user"
    trip = trip_service.create_trip(
        user_id,
        TripCreateRequest(
            title="London Calling",
            destination="London, UK",
            start_date="2026-09-01",
            end_date="2026-09-04",
            budget=2000.0,
            travel_style="Balanced",
        ),
    )

    # Fetch all recommendations
    recs = await recommendation_service.get_or_generate_recommendations(trip.id, user_id)
    assert len(recs) > 0
    categories = {r.category for r in recs}
    assert "Attractions" in categories
    assert "Restaurants" in categories

    # Filter category
    attractions = await recommendation_service.get_or_generate_recommendations(
        trip.id, user_id, category="Attractions"
    )
    assert len(attractions) > 0
    for a in attractions:
        assert a.category.lower() == "attractions"
