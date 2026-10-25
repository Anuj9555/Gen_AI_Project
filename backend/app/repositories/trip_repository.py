from typing import List, Optional, Dict
from datetime import datetime, timezone
from app.config.database import get_supabase_client
from app.models.trip_model import TripModel
from app.models.shared_trip_model import SharedTripModel


class TripRepository:
    def __init__(self):
        self._trips: Dict[str, TripModel] = {}
        self._shared: Dict[str, List[SharedTripModel]] = {}  # trip_id -> list of shared records

    def create(self, trip: TripModel) -> TripModel:
        supabase = get_supabase_client()
        if supabase:
            try:
                row = trip.model_dump()
                supabase.table("trips").insert(row).execute()
            except Exception:
                pass
        self._trips[trip.id] = trip
        return trip

    def get_by_id(self, trip_id: str) -> Optional[TripModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("trips").select("*").eq("id", trip_id).execute()
                if res.data and len(res.data) > 0:
                    return TripModel(**res.data[0])
            except Exception:
                pass
        return self._trips.get(trip_id)

    def get_by_user_id(self, user_id: str) -> List[TripModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("trips").select("*").eq("user_id", user_id).order("start_date", desc=True).execute()
                if res.data:
                    return [TripModel(**r) for r in res.data]
            except Exception:
                pass
        # Return owned trips plus shared trips
        user_trips = [t for t in self._trips.values() if t.user_id == user_id]
        # Check if user has shared trips
        for tid, shares in self._shared.items():
            for s in shares:
                if s.user_id == user_id and tid in self._trips and self._trips[tid] not in user_trips:
                    user_trips.append(self._trips[tid])
        return sorted(user_trips, key=lambda x: x.start_date, reverse=True)

    def update(self, trip: TripModel) -> TripModel:
        trip.updated_at = datetime.now(timezone.utc).isoformat()
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("trips").update(trip.model_dump()).eq("id", trip.id).execute()
            except Exception:
                pass
        self._trips[trip.id] = trip
        return trip

    def delete(self, trip_id: str) -> bool:
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("trips").delete().eq("id", trip_id).execute()
            except Exception:
                pass
        if trip_id in self._trips:
            del self._trips[trip_id]
            if trip_id in self._shared:
                del self._shared[trip_id]
            return True
        return False

    def add_collaborator(self, shared: SharedTripModel) -> SharedTripModel:
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("shared_trips").insert(shared.model_dump()).execute()
            except Exception:
                pass
        if shared.trip_id not in self._shared:
            self._shared[shared.trip_id] = []
        self._shared[shared.trip_id].append(shared)
        return shared

    def get_collaborators(self, trip_id: str) -> List[SharedTripModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("shared_trips").select("*").eq("trip_id", trip_id).execute()
                if res.data:
                    return [SharedTripModel(**r) for r in res.data]
            except Exception:
                pass
        return self._shared.get(trip_id, [])


trip_repository = TripRepository()
