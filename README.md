# WanderAI - Personalized Travel Itinerary Planner

A production-ready, full-stack AI-powered travel planning platform that generates personalized day-by-day travel itineraries based on destination, dates, budget, interests, travel style, group size, accommodation preferences, transportation preferences, and desired trip pace.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [Environment Setup](#environment-setup)
7. [Supabase Setup & Database Migrations](#supabase-setup)
8. [Local Development](#local-development)
9. [Frontend Deployment](#frontend-deployment)
10. [Backend Deployment](#backend-deployment)
11. [API Documentation](#api-documentation)
12. [Troubleshooting](#troubleshooting)

---

## 1. Project Overview
WanderAI eliminates hours of manual trip planning by translating user travel styles, budgets, group preferences, and dates into cohesive, geographically optimized daily schedules. It features full authentication, persistent itineraries, budget tracking visualizations, interactive Leaflet maps, and instant day-level regeneration.

---

## 2. Features
- **Authentication**: Email/password registration, login, session persistence, and protected routes backed by Supabase Auth and JWT.
- **Dashboard**: Track upcoming journeys, past archives, total spending, and active destinations with quick trip creation.
- **Trip Builder**: Multi-factor planner supporting 8 travel styles (*Budget*, *Luxury*, *Adventure*, *Cultural*, etc.), 3 schedule paces (*Relaxed*, *Balanced*, *Packed*), multi-select interests, lodging, and dietary preferences.
- **AI Itinerary Engine**: Day-by-day generation with geographic clustering, duration estimates, morning/afternoon/evening flows, and lunch/dinner recommendations.
- **Day Regeneration**: Swap out any single day's plan on demand with custom focus instructions (e.g., "focus on gardens and bakeries").
- **Activity Customization**: Edit activity times, descriptions, costs, or add custom user stops.
- **Interactive Leaflet Cartography**: View route polylines and clickable marker popups for every planned stop.
- **Budget Tracking**: Interactive Recharts breakdown comparing trip budget against estimated spending across activities, dining, stays, and transit.
- **Group Sharing**: Invite companions with Viewer or Editor access roles.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom travel color palette
- **Routing**: React Router 6
- **State Management**: Zustand & React Context
- **Form Handling & Validation**: React Hook Form + Zod
- **Visualizations**: Recharts
- **Mapping**: Leaflet + React-Leaflet + OpenStreetMap
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT authorization interceptors

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Architecture**: Controller-Service-Repository pattern
- **Validation**: Pydantic v2
- **Server**: Uvicorn
- **AI Core**: Multi-provider client (OpenAI, Anthropic, Gemini, or intelligent fallback engine)
- **Database**: PostgreSQL (via Supabase with Row Level Security)

---

## 4. Architecture
See detailed architecture docs in [`docs/architecture/system-architecture.md`](docs/architecture/system-architecture.md).

```
[ Frontend: React + TypeScript + Vite ]
                   │
                   ▼ (HTTPS REST /api/v1)
[ Backend: FastAPI Controller-Service-Repository ]
        │                   │
        ▼                   ▼
[ Supabase PostgreSQL ]    [ AI Engine (OpenAI/Claude/Gemini/Domain) ]
```

---

## 5. Folder Structure
```
personalized-travel-planner/
├── frontend/                     # React 18 TypeScript application
│   ├── public/                   # Static assets & web manifest
│   ├── src/
│   │   ├── components/           # Common, layout, trip, itinerary, auth, map
│   │   ├── pages/                # Landing, Login, Dashboard, Builder, Details
│   │   ├── services/             # Axios API services
│   │   ├── store/                # Zustand stores
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # TypeScript interface definitions
│   │   └── utils/                # Date, currency, and validation formatters
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # FastAPI Python backend
│   ├── app/
│   │   ├── api/v1/               # Routes, controllers, dependencies
│   │   ├── services/             # Core business & itinerary orchestration
│   │   ├── repositories/         # Supabase & cache access layers
│   │   ├── models/ & schemas/    # Pydantic validation schemas
│   │   ├── ai/                   # AI client, prompt templates, and parser
│   │   └── middleware/           # Exception handling & request logging
│   ├── tests/                    # Pytest test suite
│   ├── requirements.txt
│   └── Dockerfile
├── supabase/                     # Database migrations, RLS, and seed data
│   ├── migrations/               # SQL files 001 to 008
│   ├── functions/                # Deno edge functions
│   └── seed/                     # Demo seed data
├── docs/                         # Architecture, API, and Deployment guides
├── .github/workflows/            # Frontend & Backend CI automation
└── docker-compose.yml            # Multi-container orchestration
```

---

## 6. Environment Setup

### Backend `.env`
Create `backend/.env`:
```env
APP_ENV=development
DEBUG=true
PORT=8000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=super-secret-jwt-key
AI_PROVIDER=mock # or 'openai', 'anthropic', 'gemini'
AI_API_KEY=your-ai-api-key
AI_MODEL=gpt-4o
```

### Frontend `.env`
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 7. Supabase Setup & Database Migrations
1. Create a Supabase project at [https://supabase.com](https://supabase.com).
2. Execute the migration scripts in [`supabase/migrations/`](supabase/migrations/) in numerical sequence:
   - `001_create_profiles.sql`
   - `002_create_trips.sql`
   - `003_create_itineraries.sql`
   - `004_create_activities.sql`
   - `005_create_recommendations.sql`
   - `006_create_shared_trips.sql`
   - `007_create_rls_policies.sql`
   - `008_create_indexes.sql`
3. Optional demo data: run `supabase/seed/seed.sql`.

---

## 8. Local Development

### Running with Docker Compose
```bash
docker-compose up --build
```
Access client at `http://localhost:3000` and API at `http://localhost:8000/docs`.

### Running Manually

#### Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 9. Frontend Deployment
Deploy the `frontend` folder directly to Vercel or Netlify.
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Set `VITE_API_BASE_URL` to your production backend URL.

---

## 10. Backend Deployment
Deploy the `backend` folder via Docker to Render, Railway, Fly.io, or AWS ECS.
- Ensure environment variables for `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `CORS_ORIGINS` are set.

---

## 11. API Documentation
Complete documentation with request and response payloads is located at [`docs/api/api-documentation.md`](docs/api/api-documentation.md).
When the backend is running locally, visit [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive Swagger UI.

---

## 12. Troubleshooting
- **CORS Errors**: Verify that your frontend origin (e.g. `http://localhost:3000`) is included in `CORS_ORIGINS` in `backend/.env`.
- **Map Not Rendering**: Verify network access to `tile.openstreetmap.org` and ensure container height is styled.
- **AI Generation Timeouts**: If using external LLM providers (OpenAI/Anthropic), increase `AI_TIMEOUT_SECONDS` in `backend/.env` or switch `AI_PROVIDER=mock` for instant local testing.
