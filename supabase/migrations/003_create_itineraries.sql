-- 003_create_itineraries.sql
CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE NOT NULL,
    summary TEXT NOT NULL,
    food_recommendations JSONB DEFAULT '[]'::jsonb,
    transportation JSONB DEFAULT '[]'::jsonb,
    estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_trip_day UNIQUE (trip_id, day_number)
);

CREATE TRIGGER trg_itineraries_updated_at
BEFORE UPDATE ON public.itineraries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
