from typing import List, Optional, Dict
from app.config.database import get_supabase_client
from app.models.recommendation_model import RecommendationModel


class RecommendationRepository:
    def __init__(self):
        self._recommendations: Dict[str, RecommendationModel] = {}

    def save(self, rec: RecommendationModel) -> RecommendationModel:
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("recommendations").upsert(rec.model_dump()).execute()
            except Exception:
                pass
        self._recommendations[rec.id] = rec
        return rec

    def save_many(self, recs: List[RecommendationModel]) -> List[RecommendationModel]:
        return [self.save(r) for r in recs]

    def get_by_trip(self, trip_id: str, category: Optional[str] = None) -> List[RecommendationModel]:
        supabase = get_supabase_client()
        if supabase:
            try:
                query = supabase.table("recommendations").select("*").eq("trip_id", trip_id)
                if category:
                    query = query.eq("category", category)
                res = query.execute()
                if res.data:
                    return [RecommendationModel(**r) for r in res.data]
            except Exception:
                pass
        results = [r for r in self._recommendations.values() if r.trip_id == trip_id]
        if category:
            results = [r for r in results if r.category.lower() == category.lower()]
        return results

    def delete_by_trip(self, trip_id: str):
        to_del = [rid for rid, r in self._recommendations.items() if r.trip_id == trip_id]
        for rid in to_del:
            del self._recommendations[rid]
        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("recommendations").delete().eq("trip_id", trip_id).execute()
            except Exception:
                pass


recommendation_repository = RecommendationRepository()
