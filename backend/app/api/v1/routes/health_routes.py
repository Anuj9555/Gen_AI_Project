from fastapi import APIRouter
from app.config.settings import get_settings
from app.config.database import get_supabase_client

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    settings = get_settings()
    supabase = get_supabase_client()
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "ai_provider": settings.AI_PROVIDER,
        "database_connected": supabase is not None,
        "version": "1.0.0",
    }
