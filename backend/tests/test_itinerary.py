import pytest
from app.services.trip_service import trip_service
from app.services.itinerary_service import itinerary_service
from app.schemas.trip_schema import TripCreateRequest
from app.schemas.itinerary_schema import (
    ActivityCreate,
    ActivityUpdate,
    RegenerateDayRequest,
)


@pytest.mark.asyncio
async def test_itinerary_generation_and_activity_manipulation():
    user_id = "test-itinerary-user"
    trip = trip_service.create_trip(
        user_id,
        TripCreateRequest(
            title="Parisian Art Escape",
            destination="Paris, France",
            start_date="2026-07-01",
            end_date="2026-07-03",
            budget=1500.0,
            travel_style="Cultural",
            pace="Balanced",
            interests=["Museums", "Food"],
        ),
    )

    # Generate Full Itinerary
    itinerary = await itinerary_service.generate_trip_itinerary(trip.id, user_id)
    assert len(itinerary.days) == 3
    assert itinerary.total_estimated_cost > 0
    assert len(itinerary.days[0].activities) > 0

    # Fetch stored itinerary
    stored = itinerary_service.get_trip_itinerary(trip.id, user_id)
    assert len(stored.days) == 3

    # Add custom activity to Day 1
    day_1_id = stored.days[0].id
    new_act = itinerary_service.add_activity(
        trip.id,
        day_1_id,
        user_id,
        ActivityCreate(
            time="04:30 PM",
            title="Wine Tasting by the Seine",
            description="Sample artisanal French wines paired with aged cheeses",
            activity_type="food",
            location="Pont Neuf, Paris",
            estimated_cost=40.0,
            duration_minutes=90,
        ),
    )
    assert new_act.id is not None
    assert new_act.title == "Wine Tasting by the Seine"

    # Update activity
    updated_act = itinerary_service.update_activity(
        trip.id,
        new_act.id,
        user_id,
        ActivityUpdate(estimated_cost=45.0, title="Premium Wine & Cheese Tasting"),
    )
    assert updated_act.estimated_cost == 45.0
    assert updated_act.title == "Premium Wine & Cheese Tasting"

    # Regenerate Day 2
    regen_res = await itinerary_service.regenerate_day(
        trip.id,
        2,
        user_id,
        RegenerateDayRequest(
            day_number=2,
            preferences_override="Focus heavily on hidden gardens and local bakeries",
        ),
    )
    assert regen_res.day_number == 2
    assert len(regen_res.activities) > 0

    # Delete custom activity
    del_res = itinerary_service.delete_activity(trip.id, new_act.id, user_id)
    assert del_res is True
