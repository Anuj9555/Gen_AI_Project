from fastapi import APIRouter, Depends
from app.schemas.itinerary_schema import (
    FullItineraryResponse,
    DayItinerarySchema,
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
    RegenerateDayRequest,
)
from app.schemas.response_schema import ApiResponse
from app.api.v1.controllers.itinerary_controller import itinerary_controller
from app.api.dependencies import get_current_user_id

router = APIRouter(prefix="/itineraries", tags=["Itineraries"])


@router.get("/{trip_id}", response_model=ApiResponse[FullItineraryResponse])
def get_itinerary(trip_id: str, user_id: str = Depends(get_current_user_id)):
    return itinerary_controller.get_itinerary(trip_id, user_id)


@router.post("/{trip_id}/days/{day_number}/regenerate", response_model=ApiResponse[DayItinerarySchema])
async def regenerate_day(
    trip_id: str,
    day_number: int,
    req: RegenerateDayRequest,
    user_id: str = Depends(get_current_user_id),
):
    return await itinerary_controller.regenerate_day(trip_id, day_number, user_id, req)


@router.post("/{trip_id}/days/{itinerary_id}/activities", response_model=ApiResponse[ActivityResponse])
def add_activity(
    trip_id: str,
    itinerary_id: str,
    req: ActivityCreate,
    user_id: str = Depends(get_current_user_id),
):
    return itinerary_controller.add_activity(trip_id, itinerary_id, user_id, req)


@router.put("/{trip_id}/activities/{activity_id}", response_model=ApiResponse[ActivityResponse])
def update_activity(
    trip_id: str,
    activity_id: str,
    req: ActivityUpdate,
    user_id: str = Depends(get_current_user_id),
):
    return itinerary_controller.update_activity(trip_id, activity_id, user_id, req)


@router.delete("/{trip_id}/activities/{activity_id}", response_model=ApiResponse[None])
def delete_activity(
    trip_id: str,
    activity_id: str,
    user_id: str = Depends(get_current_user_id),
):
    return itinerary_controller.delete_activity(trip_id, activity_id, user_id)
