from datetime import datetime, timezone
from pydantic import BaseModel, Field


class SharedTripModel(BaseModel):
    id: str
    trip_id: str
    user_id: str
    role: str = "viewer"
    status: str = "accepted"
    joined_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
