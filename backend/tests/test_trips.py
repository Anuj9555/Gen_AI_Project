import pytest
from app.services.trip_service import trip_service
from app.schemas.trip_schema import TripCreateRequest, TripUpdateRequest
from app.exceptions.base_exception import ValidationError
from app.exceptions.trip_exceptions import TripNotFoundException


def test_trip_crud_lifecycle():
    user_id = "test-user-123"

    # Create Trip
    req = TripCreateRequest(
        title="Tokyo Cherry Blossom Expedition",
        destination="Tokyo, Japan",
        start_date="2026-04-01",
        end_date="2026-04-05",
        budget=2400.0,
        currency="USD",
        group_size=2,
        travel_style="Balanced",
        pace="Balanced",
        interests=["Culture", "Food", "Photography"],
    )
    trip = trip_service.create_trip(user_id, req)
    assert trip.id is not None
    assert trip.destination == "Tokyo, Japan"
    assert trip.budget == 2400.0

    # Get Single Trip
    fetched = trip_service.get_trip_by_id(trip.id, user_id)
    assert fetched.id == trip.id

    # List Trips
    trips = trip_service.get_user_trips(user_id)
    assert len(trips) >= 1
    assert any(t.id == trip.id for t in trips)

    # Update Trip
    upd = trip_service.update_trip(
        trip.id,
        user_id,
        TripUpdateRequest(title="Updated Tokyo Dream Trip", budget=2800.0),
    )
    assert upd.title == "Updated Tokyo Dream Trip"
    assert upd.budget == 2800.0

    # Delete Trip
    deleted = trip_service.delete_trip(trip.id, user_id)
    assert deleted is True

    # Confirm Not Found
    with pytest.raises(TripNotFoundException):
        trip_service.get_trip_by_id(trip.id, user_id)


def test_invalid_dates_validation():
    user_id = "test-user-dates"
    req = TripCreateRequest(
        title="Invalid dates",
        destination="Rome",
        start_date="2026-06-10",
        end_date="2026-06-05",  # End before start
        budget=1000.0,
    )
    with pytest.raises(ValidationError):
        trip_service.create_trip(user_id, req)
