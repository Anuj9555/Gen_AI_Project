from typing import List, Optional
from pydantic import BaseModel, Field


class ActivityBase(BaseModel):
    time: str = "09:00 AM"
    title: str
    description: str
    activity_type: str = "sightseeing"  # sightseeing, food, transport, leisure, culture, nature
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    duration_minutes: int = 90
    estimated_cost: float = 0.0


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    time: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    activity_type: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    duration_minutes: Optional[int] = None
    estimated_cost: Optional[float] = None


class ActivityResponse(ActivityBase):
    id: str
    itinerary_id: str
    created_at: Optional[str] = None


class FoodRecommendation(BaseModel):
    name: str
    cuisine: str
    meal_type: str = "Lunch"  # Breakfast, Lunch, Dinner, Snack
    description: str
    price_level: str = "$$"
    estimated_cost: float = 25.0
    location: str


class TransportOption(BaseModel):
    mode: str
    description: str
    estimated_cost: float = 10.0


class DayItinerarySchema(BaseModel):
    id: Optional[str] = None
    trip_id: Optional[str] = None
    day_number: int
    date: str
    summary: str
    activities: List[ActivityBase] = Field(default_factory=list)
    food_recommendations: List[FoodRecommendation] = Field(default_factory=list)
    transportation: List[TransportOption] = Field(default_factory=list)
    estimated_daily_cost: float = 0.0


class FullItineraryResponse(BaseModel):
    trip_id: str
    destination: str
    trip_summary: str
    days: List[DayItinerarySchema]
    total_estimated_cost: float
    travel_tips: List[str] = Field(default_factory=list)
    important_notes: List[str] = Field(default_factory=list)


class RegenerateDayRequest(BaseModel):
    day_number: int
    preferences_override: Optional[str] = None
    keep_dates: bool = True


class RegenerateActivityRequest(BaseModel):
    activity_id: str
    preferences: Optional[str] = None
