from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class ItineraryModel(BaseModel):
    id: str
    trip_id: str
    day_number: int
    date: str
    summary: str
    food_recommendations: List[Dict[str, Any]] = Field(default_factory=list)
    transportation: List[Dict[str, Any]] = Field(default_factory=list)
    estimated_cost: float = 0.0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
