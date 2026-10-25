from typing import Any
from app.schemas.itinerary_schema import (
    FullItineraryResponse,
    DayItinerarySchema,
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
    RegenerateDayRequest,
)
from app.schemas.response_schema import ApiResponse
from app.services.itinerary_service import itinerary_service


class ItineraryController:
    @staticmethod
    def get_itinerary(trip_id: str, user_id: str) -> ApiResponse[FullItineraryResponse]:
        itinerary = itinerary_service.get_trip_itinerary(trip_id, user_id)
        return ApiResponse.success_response(data=itinerary)

    @staticmethod
    async def regenerate_day(
        trip_id: str, day_number: int, user_id: str, req: RegenerateDayRequest
    ) -> ApiResponse[DayItinerarySchema]:
        updated_day = await itinerary_service.regenerate_day(trip_id, day_number, user_id, req)
        return ApiResponse.success_response(data=updated_day, message=f"Day {day_number} regenerated successfully")

    @staticmethod
    def add_activity(
        trip_id: str, itinerary_id: str, user_id: str, req: ActivityCreate
    ) -> ApiResponse[ActivityResponse]:
        act = itinerary_service.add_activity(trip_id, itinerary_id, user_id, req)
        return ApiResponse.success_response(data=act, message="Activity added")

    @staticmethod
    def update_activity(
        trip_id: str, activity_id: str, user_id: str, req: ActivityUpdate
    ) -> ApiResponse[ActivityResponse]:
        act = itinerary_service.update_activity(trip_id, activity_id, user_id, req)
        return ApiResponse.success_response(data=act, message="Activity updated")

    @staticmethod
    def delete_activity(trip_id: str, activity_id: str, user_id: str) -> ApiResponse[None]:
        itinerary_service.delete_activity(trip_id, activity_id, user_id)
        return ApiResponse.success_response(data=None, message="Activity deleted")


itinerary_controller = ItineraryController()
