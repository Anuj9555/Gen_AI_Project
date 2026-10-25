import logging
from typing import Optional, Any

logger = logging.getLogger("wanderai.database")

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = Any

from app.config.settings import get_settings

_supabase_client: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """
    Returns the Supabase client if configured, otherwise None (fallback to in-memory repo).
    """
    global _supabase_client
    settings = get_settings()

    if _supabase_client is not None:
        return _supabase_client

    if create_client and settings.SUPABASE_URL and (settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY):
        try:
            key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
            _supabase_client = create_client(settings.SUPABASE_URL, key)
            logger.info("Connected to remote Supabase instance successfully")
            return _supabase_client
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase client: {e}. Fallback repository will be used.")
            return None

    logger.info("Supabase credentials not set or incomplete. Using embedded persistent repository.")
    return None
