import uuid
from typing import List, Optional, Dict, Any
from app.repositories.itinerary_repository import itinerary_repository
from app.repositories.trip_repository import trip_repository
from app.repositories.recommendation_repository import recommendation_repository
from app.models.itinerary_model import ItineraryModel
from app.models.activity_model import ActivityModel
from app.models.recommendation_model import RecommendationModel
from app.schemas.itinerary_schema import (
    FullItineraryResponse,
    DayItinerarySchema,
    ActivityBase,
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
    RegenerateDayRequest,
    FoodRecommendation,
    TransportOption,
)
from app.exceptions.trip_exceptions import TripNotFoundException, ItineraryNotFoundException, ActivityNotFoundException
from app.ai.itinerary_generator import itinerary_generator
from app.ai.recommendation_engine import recommendation_engine
from app.security.permissions import check_trip_access


class ItineraryService:
    async def generate_trip_itinerary(self, trip_id: str, user_id: str) -> FullItineraryResponse:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="editor")

        # Call AI itinerary generator
        ai_result: FullItineraryResponse = await itinerary_generator.generate(trip.model_dump())

        # Clean existing days and activities for this trip
        itinerary_repository.delete_itineraries_by_trip(trip_id)

        # Persist generated days and activities
        for day in ai_result.days:
            itinerary_id = str(uuid.uuid4())
            day_model = ItineraryModel(
                id=itinerary_id,
                trip_id=trip_id,
                day_number=day.day_number,
                date=day.date,
                summary=day.summary,
                food_recommendations=[f.model_dump() for f in day.food_recommendations],
                transportation=[t.model_dump() for t in day.transportation],
                estimated_cost=day.estimated_daily_cost,
            )
            itinerary_repository.save_itinerary(day_model)
            day.id = itinerary_id
            day.trip_id = trip_id

            for act in day.activities:
                act_model = ActivityModel(
                    id=str(uuid.uuid4()),
                    itinerary_id=itinerary_id,
                    time=act.time,
                    title=act.title,
                    description=act.description,
                    activity_type=act.activity_type,
                    location=act.location,
                    latitude=act.latitude,
                    longitude=act.longitude,
                    estimated_cost=act.estimated_cost,
                    duration_minutes=act.duration_minutes,
                )
                itinerary_repository.save_activity(act_model)

        # Generate and cache recommendations
        recs = await recommendation_engine.get_recommendations(trip.model_dump())
        recommendation_repository.delete_by_trip(trip_id)
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
        recommendation_repository.save_many(rec_models)

        # Update trip estimated cost and status
        trip.total_estimated_cost = ai_result.total_estimated_cost
        trip.status = "itinerary_ready"
        trip_repository.update(trip)

        return ai_result

    def get_trip_itinerary(self, trip_id: str, user_id: str) -> FullItineraryResponse:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="viewer")

        days = itinerary_repository.get_itineraries_by_trip(trip_id)
        days_schemas: List[DayItinerarySchema] = []
        total_cost = 0.0

        for day in days:
            acts = itinerary_repository.get_activities_by_itinerary(day.id)
            act_schemas = [
                ActivityBase(
                    time=a.time,
                    title=a.title,
                    description=a.description,
                    activity_type=a.activity_type,
                    location=a.location,
                    latitude=a.latitude,
                    longitude=a.longitude,
                    duration_minutes=a.duration_minutes,
                    estimated_cost=a.estimated_cost,
                )
                for a in acts
            ]
            food_schemas = [FoodRecommendation(**f) for f in day.food_recommendations]
            trans_schemas = [TransportOption(**t) for t in day.transportation]

            daily_cost = (
                sum(a.estimated_cost for a in act_schemas)
                + sum(f.estimated_cost for f in food_schemas)
                + sum(t.estimated_cost for t in trans_schemas)
            )
            total_cost += daily_cost

            days_schemas.append(
                DayItinerarySchema(
                    id=day.id,
                    trip_id=trip_id,
                    day_number=day.day_number,
                    date=day.date,
                    summary=day.summary,
                    activities=act_schemas,
                    food_recommendations=food_schemas,
                    transportation=trans_schemas,
                    estimated_daily_cost=round(daily_cost, 2),
                )
            )

        return FullItineraryResponse(
            trip_id=trip_id,
            destination=trip.destination,
            trip_summary=f"Personalized travel itinerary for {trip.destination}",
            days=days_schemas,
            total_estimated_cost=round(total_cost, 2),
            travel_tips=[
                f"Enjoy exploring {trip.destination} at your preferred {trip.pace.lower()} pace.",
                "Review daily activities in advance to confirm local opening times.",
            ],
            important_notes=[
                "Activities and timings can be customized anytime.",
            ],
        )

    async def regenerate_day(
        self, trip_id: str, day_number: int, user_id: str, req: RegenerateDayRequest
    ) -> DayItinerarySchema:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="editor")

        existing_days = itinerary_repository.get_itineraries_by_trip(trip_id)
        target_day = next((d for d in existing_days if d.day_number == day_number), None)
        if not target_day:
            raise ItineraryNotFoundException(f"Day {day_number}")

        # Regenerate single day with AI
        fresh_day = await itinerary_generator.regenerate_single_day(
            trip_data=trip.model_dump(),
            day_number=day_number,
            date=target_day.date,
            preferences_override=req.preferences_override or "",
        )

        # Delete previous activities of this day
        itinerary_repository.delete_activities_by_itinerary(target_day.id)

        # Update day metadata
        target_day.summary = fresh_day.summary
        target_day.food_recommendations = [f.model_dump() for f in fresh_day.food_recommendations]
        target_day.transportation = [t.model_dump() for t in fresh_day.transportation]
        target_day.estimated_cost = fresh_day.estimated_daily_cost
        itinerary_repository.save_itinerary(target_day)

        # Save new activities
        for act in fresh_day.activities:
            act_model = ActivityModel(
                id=str(uuid.uuid4()),
                itinerary_id=target_day.id,
                time=act.time,
                title=act.title,
                description=act.description,
                activity_type=act.activity_type,
                location=act.location,
                latitude=act.latitude,
                longitude=act.longitude,
                estimated_cost=act.estimated_cost,
                duration_minutes=act.duration_minutes,
            )
            itinerary_repository.save_activity(act_model)

        fresh_day.id = target_day.id
        fresh_day.trip_id = trip_id
        return fresh_day

    def add_activity(
        self, trip_id: str, itinerary_id: str, user_id: str, req: ActivityCreate
    ) -> ActivityResponse:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="editor")

        day = itinerary_repository.get_itinerary_by_id(itinerary_id)
        if not day or day.trip_id != trip_id:
            raise ItineraryNotFoundException(itinerary_id)

        act_model = ActivityModel(
            id=str(uuid.uuid4()),
            itinerary_id=itinerary_id,
            time=req.time,
            title=req.title,
            description=req.description,
            activity_type=req.activity_type,
            location=req.location,
            latitude=req.latitude,
            longitude=req.longitude,
            duration_minutes=req.duration_minutes,
            estimated_cost=req.estimated_cost,
        )
        saved = itinerary_repository.save_activity(act_model)
        return ActivityResponse(**saved.model_dump())

    def update_activity(
        self, trip_id: str, activity_id: str, user_id: str, req: ActivityUpdate
    ) -> ActivityResponse:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="editor")

        act = itinerary_repository.get_activity_by_id(activity_id)
        if not act:
            raise ActivityNotFoundException(activity_id)

        if req.time is not None:
            act.time = req.time
        if req.title is not None:
            act.title = req.title
        if req.description is not None:
            act.description = req.description
        if req.activity_type is not None:
            act.activity_type = req.activity_type
        if req.location is not None:
            act.location = req.location
        if req.latitude is not None:
            act.latitude = req.latitude
        if req.longitude is not None:
            act.longitude = req.longitude
        if req.duration_minutes is not None:
            act.duration_minutes = req.duration_minutes
        if req.estimated_cost is not None:
            act.estimated_cost = req.estimated_cost

        saved = itinerary_repository.save_activity(act)
        return ActivityResponse(**saved.model_dump())

    def delete_activity(self, trip_id: str, activity_id: str, user_id: str) -> bool:
        trip = trip_repository.get_by_id(trip_id)
        if not trip:
            raise TripNotFoundException(trip_id)
        check_trip_access(trip, user_id, required_role="editor")
        return itinerary_repository.delete_activity(activity_id)


itinerary_service = ItineraryService()
