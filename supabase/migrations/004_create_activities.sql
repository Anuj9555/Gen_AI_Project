-- 004_create_activities.sql
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
    time VARCHAR(20) NOT NULL DEFAULT '09:00 AM',
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    activity_type VARCHAR(50) NOT NULL DEFAULT 'sightseeing',
    location TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    duration_minutes INTEGER NOT NULL DEFAULT 90,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
