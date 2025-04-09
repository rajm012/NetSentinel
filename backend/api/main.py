from fastapi import FastAPI
from backend.api.routes.sniffer import router as sniffer_router
from backend.api.routes.detectors import router as detectors_router
from backend.api.routes.processing import router as processing_router
from backend.api.routes.config import router as config_router
from backend.api.routes.alerts import router as alerts_router

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

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or use ["*"] during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api.main:app", host="0.0.0.0", port=8000, reload=True)

# (zenv) PS E:\4th Semester\Packet Sniffer> uvicorn backend.api.main:app --reload
