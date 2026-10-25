-- 008_create_indexes.sql
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON public.trips(start_date);
CREATE INDEX IF NOT EXISTS idx_itineraries_trip_id ON public.itineraries(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_itinerary_id ON public.activities(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_trip_id ON public.recommendations(trip_id);
CREATE INDEX IF NOT EXISTS idx_shared_trips_user_id ON public.shared_trips(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_trips_trip_id ON public.shared_trips(trip_id);
