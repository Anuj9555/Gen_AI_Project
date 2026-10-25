import uuid
from typing import List, Optional, Dict, Any
from app.repositories.trip_repository import trip_repository
from app.models.trip_model import TripModel
from app.schemas.trip_schema import TripCreateRequest, TripUpdateRequest, TripResponse
from app.security.validation import validate_date_range, sanitize_input
from app.exceptions.trip_exceptions import TripNotFoundException
from app.security.permissions import check_trip_access


class TripService:
    def create_trip(self, user_id: str, req: TripCreateRequest) -> TripResponse:
        validate_date_range(req.start_date, req.end_date)

        trip = TripModel(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title=sanitize_input(req.title),
            destination=sanitize_input(req.destination),
            start_date=req.start_date,
            end_date=req.end_date,
            budget=req.budget,
            currency=req.currency,
            group_size=req.group_size,
            travel_style=req.travel_style,
            pace=req.pace,
            interests=req.interests,
            accommodation_preference=req.accommodation_preference,
            transportation_preference=req.transportation_preference,
            food_preference=req.food_preference,
            special_requirements=sanitize_input(req.special_requirements or ""),
            status="planned",
            total_estimated_cost=0.0,
        )

        saved = trip_repository.create(trip)
        return self._to_response(saved)

    def get_user_trips(self, user_id: str) -> List[TripResponse]:
        trips = trip_repository.get_by_user_id(user_id)
        return [self._to_response(t) for t in trips]

    def get_trip_by_id(self, trip_id: str, user_id: str) -> TripResponse:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="viewer")
        return self._to_response(trip)

    def update_trip(self, trip_id: str, user_id: str, req: TripUpdateRequest) -> TripResponse:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="editor")

        if req.start_date and req.end_date:
            validate_date_range(req.start_date, req.end_date)
            trip.start_date = req.start_date
            trip.end_date = req.end_date
        elif req.start_date:
            validate_date_range(req.start_date, trip.end_date)
            trip.start_date = req.start_date
        elif req.end_date:
            validate_date_range(trip.start_date, req.end_date)
            trip.end_date = req.end_date

        if req.title is not None:
            trip.title = sanitize_input(req.title)
        if req.destination is not None:
            trip.destination = sanitize_input(req.destination)
        if req.budget is not None:
            trip.budget = req.budget
        if req.currency is not None:
            trip.currency = req.currency
        if req.group_size is not None:
            trip.group_size = req.group_size
        if req.travel_style is not None:
            trip.travel_style = req.travel_style
        if req.pace is not None:
            trip.pace = req.pace
        if req.interests is not None:
            trip.interests = req.interests
        if req.accommodation_preference is not None:
            trip.accommodation_preference = req.accommodation_preference
        if req.transportation_preference is not None:
            trip.transportation_preference = req.transportation_preference
        if req.food_preference is not None:
            trip.food_preference = req.food_preference
        if req.special_requirements is not None:
            trip.special_requirements = sanitize_input(req.special_requirements)
        if req.status is not None:
            trip.status = req.status

        updated = trip_repository.update(trip)
        return self._to_response(updated)

    def delete_trip(self, trip_id: str, user_id: str) -> bool:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="owner")
        return trip_repository.delete(trip_id)

    def _to_response(self, trip: TripModel) -> TripResponse:
        return TripResponse(
            id=trip.id,
            user_id=trip.user_id,
            title=trip.title,
            destination=trip.destination,
            start_date=trip.start_date,
            end_date=trip.end_date,
            budget=trip.budget,
            currency=trip.currency,
            group_size=trip.group_size,
            travel_style=trip.travel_style,
            pace=trip.pace,
            interests=trip.interests,
            accommodation_preference=trip.accommodation_preference,
            transportation_preference=trip.transportation_preference,
            food_preference=trip.food_preference,
            special_requirements=trip.special_requirements,
            status=trip.status,
            total_estimated_cost=trip.total_estimated_cost,
            created_at=trip.created_at,
            updated_at=trip.updated_at,
        )


trip_service = TripService()
