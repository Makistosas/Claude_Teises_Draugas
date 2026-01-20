"""
============================================================
SASKAITA.LT - Main FastAPI Application
============================================================
Automatinis sąskaitų faktūrų generatorius Lietuvos rinkai
============================================================
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import engine, Base, get_db
from app.api import auth, users, companies, clients, invoices, payments, subscriptions

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting Saskaita.lt API...")

    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logger.info("✅ Database tables created")

    yield

    # Shutdown
    logger.info("👋 Shutting down Saskaita.lt API...")


# Create FastAPI app
app = FastAPI(
    title="Saskaita.lt API",
    description="Automatinis sąskaitų faktūrų generatorius Lietuvos rinkai",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Sveikatos patikrinimas"""
    return {
        "status": "healthy",
        "service": "saskaita.lt",
        "version": "1.0.0"
    }


@app.get("/api/health/detailed", tags=["Health"])
async def detailed_health_check(db=Depends(get_db)):
    """Detalus sveikatos patikrinimas"""
    from app.database import check_db_connection
    from app.services.redis_service import check_redis_connection

    db_status = await check_db_connection()
    redis_status = await check_redis_connection()

    return {
        "status": "healthy" if db_status and redis_status else "unhealthy",
        "database": "ok" if db_status else "error",
        "redis": "ok" if redis_status else "error",
        "version": "1.0.0"
    }


# ============================================================
# INCLUDE ROUTERS
# ============================================================

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(clients.router, prefix="/api/clients", tags=["Clients"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["Invoices"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["Subscriptions"])


# ============================================================
# ERROR HANDLERS
# ============================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Vidinė serverio klaida"}
    )


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/api", tags=["Root"])
async def root():
    """API šakninis endpoint"""
    return {
        "message": "Sveiki atvykę į Saskaita.lt API!",
        "documentation": "/api/docs",
        "health": "/api/health"
    }
