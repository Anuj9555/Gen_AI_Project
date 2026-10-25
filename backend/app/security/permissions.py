from app.models.trip_model import TripModel
from app.repositories.trip_repository import trip_repository
from app.exceptions.base_exception import AuthorizationError


def check_trip_access(trip: TripModel, user_id: str, required_role: str = "viewer") -> bool:
    """
    Checks if a user is the owner or has the required role (viewer or editor).
    """
    if trip.user_id == user_id:
        return True

    collaborators = trip_repository.get_collaborators(trip.id)
    for c in collaborators:
        if c.user_id == user_id:
            if required_role == "viewer":
                return True
            if required_role == "editor" and c.role in ["editor", "owner"]:
                return True
            if required_role == "owner" and c.role == "owner":
                return True

    raise AuthorizationError("You do not have sufficient permissions for this trip")
