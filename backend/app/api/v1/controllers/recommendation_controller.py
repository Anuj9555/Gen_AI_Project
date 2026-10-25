from typing import List, Optional
from app.schemas.recommendation_schema import RecommendationResponse, RecommendationQuery
from app.schemas.response_schema import ApiResponse
from app.services.recommendation_service import recommendation_service


class RecommendationController:
    @staticmethod
    async def get_recommendations(
        trip_id: str, user_id: str, category: Optional[str] = None
    ) -> ApiResponse[List[RecommendationResponse]]:
        recs = await recommendation_service.get_or_generate_recommendations(trip_id, user_id, category)
        return ApiResponse.success_response(data=recs)


recommendation_controller = RecommendationController()
