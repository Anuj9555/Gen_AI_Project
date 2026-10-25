-- 007_create_rls_policies.sql
-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_trips ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trips: Users can access trips they own or that are shared with them
CREATE POLICY "Users can view accessible trips" ON public.trips
FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM public.shared_trips
        WHERE shared_trips.trip_id = trips.id AND shared_trips.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert own trips" ON public.trips
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update owned or editor trips" ON public.trips
FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM public.shared_trips
        WHERE shared_trips.trip_id = trips.id 
          AND shared_trips.user_id = auth.uid() 
          AND shared_trips.role IN ('owner', 'editor')
    )
);

CREATE POLICY "Users can delete own trips" ON public.trips
FOR DELETE USING (auth.uid() = user_id);

-- Itineraries: inherit trip access
CREATE POLICY "Users can view itineraries" ON public.itineraries
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.trips
        WHERE trips.id = itineraries.trip_id AND (
            trips.user_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.shared_trips
                WHERE shared_trips.trip_id = trips.id AND shared_trips.user_id = auth.uid()
            )
        )
    )
);

CREATE POLICY "Users can manage itineraries" ON public.itineraries
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.trips
        WHERE trips.id = itineraries.trip_id AND (
            trips.user_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.shared_trips
                WHERE shared_trips.trip_id = trips.id 
                  AND shared_trips.user_id = auth.uid()
                  AND shared_trips.role IN ('owner', 'editor')
            )
        )
    )
);

-- Activities: inherit itinerary access
CREATE POLICY "Users can manage activities" ON public.activities
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.itineraries
        JOIN public.trips ON trips.id = itineraries.trip_id
        WHERE itineraries.id = activities.itinerary_id AND (
            trips.user_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.shared_trips
                WHERE shared_trips.trip_id = trips.id 
                  AND shared_trips.user_id = auth.uid()
                  AND shared_trips.role IN ('owner', 'editor')
            )
        )
    )
);

-- Recommendations: inherit trip access
CREATE POLICY "Users can view recommendations" ON public.recommendations
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.trips
        WHERE trips.id = recommendations.trip_id AND (
            trips.user_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.shared_trips
                WHERE shared_trips.trip_id = trips.id AND shared_trips.user_id = auth.uid()
            )
        )
    )
);

-- Shared Trips access
CREATE POLICY "Users can view shared trips" ON public.shared_trips
FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.trips
        WHERE trips.id = shared_trips.trip_id AND trips.user_id = auth.uid()
    )
);
