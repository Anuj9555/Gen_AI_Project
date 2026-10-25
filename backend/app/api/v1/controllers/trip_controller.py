from typing import List, Any
from app.schemas.trip_schema import (
    TripCreateRequest,
    TripUpdateRequest,
    TripResponse,
    ShareTripRequest,
)
from app.schemas.itinerary_schema import FullItineraryResponse
from app.schemas.response_schema import ApiResponse
from app.services.trip_service import trip_service
from app.services.itinerary_service import itinerary_service
from app.services.sharing_service import sharing_service


class TripController:
    @staticmethod
    def create_trip(user_id: str, req: TripCreateRequest) -> ApiResponse[TripResponse]:
        data = trip_service.create_trip(user_id, req)
        return ApiResponse.success_response(data=data, message="Trip created successfully")

    @staticmethod
    def get_trips(user_id: str) -> ApiResponse[List[TripResponse]]:
        trips = trip_service.get_user_trips(user_id)
        return ApiResponse.success_response(data=trips)

    @staticmethod
    def get_trip(trip_id: str, user_id: str) -> ApiResponse[TripResponse]:
        trip = trip_service.get_trip_by_id(trip_id, user_id)
        return ApiResponse.success_response(data=trip)

    @staticmethod
    def update_trip(trip_id: str, user_id: str, req: TripUpdateRequest) -> ApiResponse[TripResponse]:
        trip = trip_service.update_trip(trip_id, user_id, req)
        return ApiResponse.success_response(data=trip, message="Trip updated successfully")

    @staticmethod
    def delete_trip(trip_id: str, user_id: str) -> ApiResponse[None]:
        trip_service.delete_trip(trip_id, user_id)
        return ApiResponse.success_response(data=None, message="Trip deleted successfully")

    @staticmethod
    async def generate_itinerary(trip_id: str, user_id: str) -> ApiResponse[FullItineraryResponse]:
        itinerary = await itinerary_service.generate_trip_itinerary(trip_id, user_id)
        return ApiResponse.success_response(data=itinerary, message="Itinerary generated successfully")

    @staticmethod
    def share_trip(trip_id: str, user_id: str, req: ShareTripRequest) -> ApiResponse[Any]:
        collab = sharing_service.share_trip(trip_id, user_id, req)
        return ApiResponse.success_response(data=collab.model_dump(), message="Collaborator invited successfully")


trip_controller = TripController()
