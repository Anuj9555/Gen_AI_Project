import uuid
from typing import List
from app.repositories.trip_repository import trip_repository
from app.repositories.user_repository import user_repository
from app.models.shared_trip_model import SharedTripModel
from app.schemas.trip_schema import ShareTripRequest
from app.exceptions.trip_exceptions import TripNotFoundException
from app.exceptions.base_exception import ValidationError
from app.security.permissions import check_trip_access


class SharingService:
    def share_trip(self, trip_id: str, owner_id: str, req: ShareTripRequest) -> SharedTripModel:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, owner_id, required_role="owner")

        target_user = user_repository.get_by_email(req.email)
        target_user_id = target_user.user_id if target_user else f"pending_{req.email}"

        shared = SharedTripModel(
            id=str(uuid.uuid4()),
            trip_id=trip_id,
            user_id=target_user_id,
            role=req.role,
            status="accepted" if target_user else "pending",
        )
        return trip_repository.add_collaborator(shared)

    def get_trip_collaborators(self, trip_id: str, user_id: str) -> List[SharedTripModel]:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="viewer")
        return trip_repository.get_collaborators(trip_id)


sharing_service = SharingService()
