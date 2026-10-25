from fastapi import APIRouter
from app.api.v1.routes.auth_routes import router as auth_router
from app.api.v1.routes.user_routes import router as user_router
from app.api.v1.routes.trip_routes import router as trip_router
from app.api.v1.routes.itinerary_routes import router as itinerary_router
from app.api.v1.routes.recommendation_routes import router as recommendation_router
from app.api.v1.routes.health_routes import router as health_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(user_router)
api_v1_router.include_router(trip_router)
api_v1_router.include_router(itinerary_router)
api_v1_router.include_router(recommendation_router)
api_v1_router.include_router(health_router)
