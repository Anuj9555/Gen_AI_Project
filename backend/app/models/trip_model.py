from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class TripModel(BaseModel):
    id: str
    user_id: str
    title: str
    destination: str
    start_date: str
    end_date: str
    budget: float
    currency: str = "USD"
    travel_style: str = "Balanced"
    group_size: int = 1
    pace: str = "Balanced"
    interests: List[str] = Field(default_factory=list)
    accommodation_preference: Optional[str] = None
    transportation_preference: Optional[str] = None
    food_preference: Optional[str] = None
    special_requirements: Optional[str] = None
    status: str = "planned"
    total_estimated_cost: float = 0.0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
