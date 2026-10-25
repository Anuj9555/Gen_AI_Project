from typing import Optional, List
from pydantic import BaseModel


class RecommendationBase(BaseModel):
    category: str  # Attractions, Restaurants, Hotels, Transportation, Experiences
    name: str
    description: str
    location: str
    rating: float = 4.5
    estimated_cost: float = 0.0
    reason: str
    source: str = "AI Curator"


class RecommendationCreate(RecommendationBase):
    trip_id: str


class RecommendationResponse(RecommendationBase):
    id: str
    trip_id: str
    created_at: Optional[str] = None


class RecommendationQuery(BaseModel):
    trip_id: str
    category: Optional[str] = None
