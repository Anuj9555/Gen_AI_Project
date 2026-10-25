import uuid
from typing import List, Optional
from app.repositories.recommendation_repository import recommendation_repository
from app.repositories.trip_repository import trip_repository
from app.schemas.recommendation_schema import RecommendationResponse, RecommendationBase
from app.models.recommendation_model import RecommendationModel
from app.ai.recommendation_engine import recommendation_engine
from app.exceptions.trip_exceptions import TripNotFoundException
from app.security.permissions import check_trip_access


class RecommendationService:
    async def get_or_generate_recommendations(
        self, trip_id: str, user_id: str, category: Optional[str] = None
    ) -> List[RecommendationResponse]:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="viewer")

        existing = recommendation_repository.get_by_trip(trip_id, category)
        if existing:
            return [RecommendationResponse(**r.model_dump()) for r in existing]

        # Generate on the fly
        recs = await recommendation_engine.get_recommendations(trip.model_dump(), category)
        rec_models = [
            RecommendationModel(
                id=str(uuid.uuid4()),
                trip_id=trip_id,
                category=r.category,
                name=r.name,
                description=r.description,
                location=r.location,
                rating=r.rating,
                estimated_cost=r.estimated_cost,
                reason=r.reason,
                source=r.source,
            )
            for r in recs
        ]
        saved = recommendation_repository.save_many(rec_models)
        return [RecommendationResponse(**r.model_dump()) for r in saved]


recommendation_service = RecommendationService()
