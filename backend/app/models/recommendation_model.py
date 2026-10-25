from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class RecommendationModel(BaseModel):
    id: str
    trip_id: str
    category: str
    name: str
    description: str
    location: str
    rating: float = 4.5
    estimated_cost: float = 0.0
    reason: str
    source: str = "AI Curator"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
