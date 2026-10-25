from app.exceptions.base_exception import NotFoundError, AppException


class TripNotFoundException(NotFoundError):
    def __init__(self, trip_id: str):
        super().__init__(message=f"Trip with ID {trip_id} was not found", code="TRIP_NOT_FOUND")


class ItineraryNotFoundException(NotFoundError):
    def __init__(self, identifier: str):
        super().__init__(message=f"Itinerary for {identifier} was not found", code="ITINERARY_NOT_FOUND")


class ActivityNotFoundException(NotFoundError):
    def __init__(self, activity_id: str):
        super().__init__(message=f"Activity with ID {activity_id} was not found", code="ACTIVITY_NOT_FOUND")


class TripAccessDeniedException(AppException):
    def __init__(self, message: str = "Access denied to this trip"):
        super().__init__(message=message, code="TRIP_ACCESS_DENIED", status_code=403)
