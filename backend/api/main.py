# backend/api/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
import logging
import os

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("smartsniffer")

# Import routers
from backend.api.routes.sniffer import router as sniffer_router
from backend.api.routes.detectors import router as detectors_router
from backend.api.routes.processing import router as processing_router
from backend.api.routes.config import router as config_router
from backend.api.routes.alerts import router as alerts_router

# Create FastAPI app
app = FastAPI(
    title="SmartSniffer API",
    description="Modular and performant API for real-time and offline network threat detection",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - Completed in {process_time:.4f}s")
    return response

# Include routers
app.include_router(sniffer_router, prefix="/api/sniffer", tags=["Sniffer"])
app.include_router(detectors_router, prefix="/api/detect", tags=["Detection"])
app.include_router(processing_router, prefix="/api/processing", tags=["Processing"])
app.include_router(config_router, prefix="/api/config", tags=["Configuration"])
app.include_router(alerts_router, prefix="/api/alerts", tags=["Alerts"])

# Add error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    from fastapi.responses import JSONResponse
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)}
    )

# Root endpoint
@app.get("/api")
def root():
    """API root endpoint providing basic information"""
    return {
        "name": "SmartSniffer API",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "docs": "/api/docs",
            "redoc": "/api/redoc",
            "sniffer": "/api/sniffer",
            "detection": "/api/detect",
            "processing": "/api/processing",
            "configuration": "/api/config",
            "alerts": "/api/alerts"
        }
    }

# Health check endpoint
@app.get("/api/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "uptime": time.time() - app.state.startup_time if hasattr(app.state, "startup_time") else 0
    }

@app.on_event("startup")
def startup_event():
    """Runs on application startup"""
    app.state.startup_time = time.time()
    logger.info("SmartSniffer API started")
    
    # Make sure temporary directories exist
    os.makedirs("/tmp/smartsniffer/pcaps", exist_ok=True)
    os.makedirs("/tmp/smartsniffer/results", exist_ok=True)

@app.on_event("shutdown")
def shutdown_event():
    """Runs on application shutdown"""
    logger.info("SmartSniffer API shutting down")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api.main:app", host="0.0.0.0", port=8000, reload=True)
    
    