from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class ActivityModel(BaseModel):
    id: str
    itinerary_id: str
    time: str = "09:00 AM"
    title: str
    description: str
    activity_type: str = "sightseeing"
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    estimated_cost: float = 0.0
    duration_minutes: int = 90
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
