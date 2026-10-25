from typing import List, Optional
from pydantic import BaseModel, Field


class TripCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    destination: str = Field(..., min_length=2, max_length=150)
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD
    budget: float = Field(..., gt=0)
    currency: str = Field(default="USD", max_length=5)
    group_size: int = Field(default=1, ge=1, le=50)
    travel_style: str = Field(default="Balanced")
    pace: str = Field(default="Balanced")
    interests: List[str] = Field(default_factory=list)
    accommodation_preference: Optional[str] = "Hotel"
    transportation_preference: Optional[str] = "Public Transit / Walking"
    food_preference: Optional[str] = "Local Cuisine / Variety"
    special_requirements: Optional[str] = None


class TripUpdateRequest(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: Optional[float] = None
    currency: Optional[str] = None
    group_size: Optional[int] = None
    travel_style: Optional[str] = None
    pace: Optional[str] = None
    interests: Optional[List[str]] = None
    accommodation_preference: Optional[str] = None
    transportation_preference: Optional[str] = None
    food_preference: Optional[str] = None
    special_requirements: Optional[str] = None
    status: Optional[str] = None


class TripResponse(BaseModel):
    id: str
    user_id: str
    title: str
    destination: str
    start_date: str
    end_date: str
    budget: float
    currency: str
    group_size: int
    travel_style: str
    pace: str
    interests: List[str]
    accommodation_preference: Optional[str] = None
    transportation_preference: Optional[str] = None
    food_preference: Optional[str] = None
    special_requirements: Optional[str] = None
    status: str = "planned"
    total_estimated_cost: Optional[float] = 0.0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class ShareTripRequest(BaseModel):
    email: str
    role: str = Field(default="viewer", pattern="^(viewer|editor|owner)$")
