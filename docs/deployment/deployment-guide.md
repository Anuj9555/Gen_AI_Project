# Deployment Guide

This guide covers deploying WanderAI across modern cloud providers and Docker.

## 1. Docker Compose (Full Stack Local / Server)
Run both backend and frontend simultaneously with:

```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## 2. Frontend Deployment (Vercel / Netlify)
1. Set the root directory to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: URL of your deployed FastAPI backend (e.g. `https://api.yourdomain.com/api/v1`).
   - `VITE_SUPABASE_URL`: Your Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key.

## 3. Backend Deployment (Render / Railway / Fly.io / VPS)
1. Point build to `backend/Dockerfile` or configure Python 3.11+.
2. Start command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
3. Set Environment Variables:
   - `APP_ENV=production`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`
   - `AI_PROVIDER`: `openai`, `anthropic`, `gemini`, or `mock`
   - `AI_API_KEY`: Your API key for the chosen provider
   - `CORS_ORIGINS`: JSON array of allowed origins (e.g. `["https://yourfrontend.vercel.app"]`)
