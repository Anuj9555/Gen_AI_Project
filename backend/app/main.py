from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import get_settings
from app.config.logging_config import setup_logging
from app.middleware.request_logger import RequestLoggerMiddleware
from app.middleware.error_handler import global_exception_handler
from app.api.v1.router import api_v1_router
from app.exceptions.base_exception import AppException

setup_logging()
settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-grade AI-powered travel itinerary planning backend with Supabase integration.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Middlewares
app.add_middleware(RequestLoggerMiddleware)

# Global Exception Handlers
app.add_exception_handler(AppException, global_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Include API v1 Router
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": "1.0.0",
        "docs": "/docs",
        "api_v1": settings.API_V1_PREFIX,
    }
