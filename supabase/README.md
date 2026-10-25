# Supabase Database & Functions Setup

This directory contains the database migration schema, edge functions, and seed data for WanderAI.

## Migrations Overview
- `001_create_profiles.sql`: User profiles and travel preferences linked to `auth.users`.
- `002_create_trips.sql`: Primary trip metadata, dates, budgets, and travel style.
- `003_create_itineraries.sql`: Day-by-day itinerary records with food and transportation JSON.
- `004_create_activities.sql`: Granular activities per day with latitude/longitude and costs.
- `005_create_recommendations.sql`: Curated attractions, dining, and stay recommendations.
- `006_create_shared_trips.sql`: Group travel permissions (owner, editor, viewer).
- `007_create_rls_policies.sql`: Complete PostgreSQL Row Level Security policies.
- `008_create_indexes.sql`: Performance indexes on foreign keys and filter columns.

## Applying Migrations to Supabase Project
Run using the Supabase CLI:
```bash
supabase db push
```
Or execute the SQL files in order in your Supabase SQL Editor.
