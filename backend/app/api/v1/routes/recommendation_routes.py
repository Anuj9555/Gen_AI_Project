from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.schemas.recommendation_schema import RecommendationResponse
from app.schemas.response_schema import ApiResponse
from app.api.v1.controllers.recommendation_controller import recommendation_controller
from app.api.dependencies import get_current_user_id

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/{trip_id}", response_model=ApiResponse[List[RecommendationResponse]])
async def get_recommendations(
    trip_id: str,
    category: Optional[str] = Query(None, description="Category filter (Attractions, Restaurants, Hotels, etc.)"),
    user_id: str = Depends(get_current_user_id),
):
    return await recommendation_controller.get_recommendations(trip_id, user_id, category)
