from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import health, auth, documents, ingest, ai

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS setup for React frontend cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(documents.router, prefix=f"{settings.API_V1_STR}/documents", tags=["Documents"])
app.include_router(ingest.router, prefix=f"{settings.API_V1_STR}/ingest", tags=["Ingestion & Vector Search"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["Gemini RAG & AI Summaries"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to OmniMind AI Engine API",
        "docs": f"{settings.API_V1_STR}/docs",
        "status": "active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
