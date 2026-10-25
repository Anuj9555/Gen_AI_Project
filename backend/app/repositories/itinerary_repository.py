from typing import List, Optional, Dict
from datetime import datetime
from app.config.database import get_supabase_client
from app.models.itinerary_model import ItineraryModel
from app.models.activity_model import ActivityModel


class ItineraryRepository:
    def __init__(self):
        # In-memory stores
        self._itineraries: Dict[str, ItineraryModel] = {}  # id -> ItineraryModel
        self._activities: Dict[str, ActivityModel] = {}    # id -> ActivityModel

    def save_itinerary(self, itinerary: ItineraryModel) -> ItineraryModel:
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("itineraries").upsert(itinerary.model_dump()).execute()
            except Exception:
                pass
        self._itineraries[itinerary.id] = itinerary
        return itinerary

    def get_itineraries_by_trip(self, trip_id: str) -> List[ItineraryModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("itineraries").select("*").eq("trip_id", trip_id).order("day_number").execute()
                if res.data:
                    return [ItineraryModel(**r) for r in res.data]
            except Exception:
                pass
        items = [i for i in self._itineraries.values() if i.trip_id == trip_id]
        return sorted(items, key=lambda x: x.day_number)

    def get_itinerary_by_id(self, itinerary_id: str) -> Optional[ItineraryModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("itineraries").select("*").eq("id", itinerary_id).execute()
                if res.data and len(res.data) > 0:
                    return ItineraryModel(**res.data[0])
            except Exception:
                pass
        return self._itineraries.get(itinerary_id)

    def delete_itineraries_by_trip(self, trip_id: str):
        days = self.get_itineraries_by_trip(trip_id)
        for day in days:
            self.delete_activities_by_itinerary(day.id)
            if day.id in self._itineraries:
                del self._itineraries[day.id]
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("itineraries").delete().eq("trip_id", trip_id).execute()
            except Exception:
                pass

    def save_activity(self, activity: ActivityModel) -> ActivityModel:
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("activities").upsert(activity.model_dump()).execute()
            except Exception:
                pass
        self._activities[activity.id] = activity
        return activity

    def get_activities_by_itinerary(self, itinerary_id: str) -> List[ActivityModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("activities").select("*").eq("itinerary_id", itinerary_id).order("start_time").execute()
                if res.data:
                    return [ActivityModel(**r) for r in res.data]
            except Exception:
                pass
        items = [a for a in self._activities.values() if a.itinerary_id == itinerary_id]
        return sorted(items, key=lambda x: x.time)

    def get_activity_by_id(self, activity_id: str) -> Optional[ActivityModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("activities").select("*").eq("id", activity_id).execute()
                if res.data and len(res.data) > 0:
                    return ActivityModel(**res.data[0])
            except Exception:
                pass
        return self._activities.get(activity_id)

    def delete_activity(self, activity_id: str) -> bool:
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("activities").delete().eq("id", activity_id).execute()
            except Exception:
                pass
        if activity_id in self._activities:
            del self._activities[activity_id]
            return True
        return False

    def delete_activities_by_itinerary(self, itinerary_id: str):
        acts = [a for a in self._activities.values() if a.itinerary_id == itinerary_id]
        for a in acts:
            del self._activities[a.id]
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("activities").delete().eq("itinerary_id", itinerary_id).execute()
            except Exception:
                pass


itinerary_repository = ItineraryRepository()
