-- seed.sql: Demo Seed Data for WanderAI

-- Insert demo trip
INSERT INTO public.trips (
    id,
    user_id,
    title,
    destination,
    start_date,
    end_date,
    budget,
    currency,
    group_size,
    travel_style,
    pace,
    interests,
    accommodation_preference,
    transportation_preference,
    food_preference,
    status,
    total_estimated_cost
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '00000000-0000-0000-0000-000000000001',
    'Kyoto Autumn Splendor',
    'Kyoto, Japan',
    '2026-10-10',
    '2026-10-13',
    2200.00,
    'USD',
    2,
    'Cultural',
    'Balanced',
    ARRAY['Culture', 'Temples', 'Food', 'Photography'],
    'Traditional Ryokan',
    'Public Transit / Walking',
    'Kaiseki & Matcha',
    'itinerary_ready',
    1450.00
) ON CONFLICT (id) DO NOTHING;

-- Insert demo itinerary day
INSERT INTO public.itineraries (
    id,
    trip_id,
    day_number,
    date,
    summary,
    food_recommendations,
    transportation,
    estimated_cost
) VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    1,
    '2026-10-10',
    'Day 1: Arrival & Eastern Kyoto Heritage',
    '[{"name": "Gion Karyo", "cuisine": "Kaiseki", "meal_type": "Dinner", "description": "Multi-course seasonal Kyoto dining", "price_level": "$$$", "estimated_cost": 85.0, "location": "Gion, Kyoto"}]'::jsonb,
    '[{"mode": "Keihan Electric Railway", "description": "Fast scenic transport between stations", "estimated_cost": 10.0}]'::jsonb,
    220.00
) ON CONFLICT (id) DO NOTHING;

-- Insert demo activity
INSERT INTO public.activities (
    id,
    itinerary_id,
    time,
    title,
    description,
    activity_type,
    location,
    latitude,
    longitude,
    estimated_cost,
    duration_minutes
) VALUES (
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    '09:30 AM',
    'Fushimi Inari Taisha Shrine Torii Path',
    'Walk through thousands of vermilion torii gates winding through sacred forest trails.',
    'culture',
    'Fushimi Inari, Kyoto',
    34.9671,
    135.7727,
    0.00,
    120
) ON CONFLICT (id) DO NOTHING;
