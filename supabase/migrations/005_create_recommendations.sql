-- 005_create_recommendations.sql
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    reason TEXT NOT NULL,
    source VARCHAR(50) DEFAULT 'AI Curator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
