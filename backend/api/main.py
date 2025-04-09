from fastapi import FastAPI
from api.routes.sniffer import router as sniffer_router
from api.routes.detectors import router as detectors_router
from api.routes.processing import router as processing_router
from api.routes.config import router as config_router
from api.routes.alerts import router as alerts_router

app = FastAPI(
    title="Smart Network Sniffer API",
    description="Modular and performant API for real-time and offline threat detection",
    version="1.0.0"
)

# Register routes with prefixes
app.include_router(sniffer_router, prefix="/api/sniffer", tags=["Sniffer"])
app.include_router(detectors_router, prefix="/api/detect", tags=["Detection"])
app.include_router(processing_router, prefix="/api/processing", tags=["Processing"])
app.include_router(config_router, prefix="/api/config", tags=["Configuration"])
app.include_router(alerts_router, prefix="/api/alerts", tags=["Alerts"])

# Run with: uvicorn api.main:app --reload
