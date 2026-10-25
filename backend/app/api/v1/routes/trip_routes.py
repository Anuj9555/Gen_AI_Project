from typing import List, Any
from fastapi import APIRouter, Depends
from app.schemas.trip_schema import (
    TripCreateRequest,
    TripUpdateRequest,
    TripResponse,
    ShareTripRequest,
)
from app.schemas.itinerary_schema import FullItineraryResponse
from app.schemas.response_schema import ApiResponse
from app.api.v1.controllers.trip_controller import trip_controller
from app.api.dependencies import get_current_user_id

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("", response_model=ApiResponse[TripResponse])
def create_trip(req: TripCreateRequest, user_id: str = Depends(get_current_user_id)):
    return trip_controller.create_trip(user_id, req)


@router.get("", response_model=ApiResponse[List[TripResponse]])
def get_trips(user_id: str = Depends(get_current_user_id)):
    return trip_controller.get_trips(user_id)


@router.get("/{trip_id}", response_model=ApiResponse[TripResponse])
def get_trip_details(trip_id: str, user_id: str = Depends(get_current_user_id)):
    return trip_controller.get_trip(trip_id, user_id)


@router.put("/{trip_id}", response_model=ApiResponse[TripResponse])
def update_trip(trip_id: str, req: TripUpdateRequest, user_id: str = Depends(get_current_user_id)):
    return trip_controller.update_trip(trip_id, user_id, req)


@router.delete("/{trip_id}", response_model=ApiResponse[None])
def delete_trip(trip_id: str, user_id: str = Depends(get_current_user_id)):
    return trip_controller.delete_trip(trip_id, user_id)


@router.post("/{trip_id}/generate", response_model=ApiResponse[FullItineraryResponse])
async def generate_itinerary(trip_id: str, user_id: str = Depends(get_current_user_id)):
    return await trip_controller.generate_itinerary(trip_id, user_id)


@router.post("/{trip_id}/share", response_model=ApiResponse[Any])
def share_trip(trip_id: str, req: ShareTripRequest, user_id: str = Depends(get_current_user_id)):
    return trip_controller.share_trip(trip_id, user_id, req)
