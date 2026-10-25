-- 002_create_trips.sql
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(5) NOT NULL DEFAULT 'USD',
    group_size INTEGER NOT NULL DEFAULT 1,
    travel_style VARCHAR(50) NOT NULL DEFAULT 'Balanced',
    pace VARCHAR(30) NOT NULL DEFAULT 'Balanced',
    interests TEXT[] DEFAULT ARRAY[]::TEXT[],
    accommodation_preference VARCHAR(100),
    transportation_preference VARCHAR(100),
    food_preference VARCHAR(100),
    special_requirements TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'planned',
    total_estimated_cost NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_trips_updated_at
BEFORE UPDATE ON public.trips
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
