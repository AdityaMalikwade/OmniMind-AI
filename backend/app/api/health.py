from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health", summary="Health Check API")
async def health_check():
    """
    Returns API status, version, and environment readiness.
    """
    return {
        "status": "online",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": "development" if settings.DEBUG else "production"
    }
