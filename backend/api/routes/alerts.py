# backend/api/routes/alerts.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import json
from datetime import datetime
from pathlib import Path
from pydantic import BaseModel

router = APIRouter()

ANOMALY_LOG_FILE: str = "logs/anomalies.json"

class Alert(BaseModel):
    type: str
    message: str
    severity: str
    timestamp: str = None

class AlertResponse(BaseModel):
    alerts: List[Dict[str, Any]]
    count: int
    last_updated: str


@router.get("/", response_model=AlertResponse)
async def get_alerts(limit: int = 100, severity: str = None):
    """
    Retrieve all alerts with optional filtering
    
    Parameters:
    - limit: Maximum number of alerts to return (default: 100)
    - severity: Filter by severity level (info, low, medium, high, critical)
    """
    from backend.utils.helpers import format_timestamp
    try:
        log_path = Path(ANOMALY_LOG_FILE)
        
        if not log_path.exists():
            return AlertResponse(alerts=[], count=0, last_updated=format_timestamp())
            
        with open(log_path, 'r') as f:
            alerts = json.load(f)
            
            # Apply filters if provided
            if severity:
                alerts = [alert for alert in alerts if alert.get('severity', '').lower() == severity.lower()]
                
            # Sort by timestamp (newest first)
            alerts.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            
            # Apply limit
            alerts = alerts[:limit]
            
            last_updated = max(alert.get('timestamp') for alert in alerts) if alerts else format_timestamp()
            
            return AlertResponse(
                alerts=alerts,
                count=len(alerts),
                last_updated=last_updated
            )
            
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding alert log file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving alerts: {str(e)}")


@router.post("/", response_model=Dict[str, str])
async def log_manual_alert(alert: Alert):
    """Log a manual security alert"""
    from backend.utils.helpers import format_timestamp, log_alert
    try:
        alert_dict = alert.dict()
        if not alert_dict.get('timestamp'):
            alert_dict['timestamp'] = format_timestamp()
            
        # Use the helper function to log the alert
        log_alert(alert_dict)
        
        return {"status": "success", "message": "Alert logged successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logging alert: {str(e)}")


@router.delete("/", response_model=Dict[str, str])
async def clear_alerts():
    """Clear all alerts from the log"""
    try:
        log_path = Path(ANOMALY_LOG_FILE)
        if log_path.exists():
            log_path.unlink()
        return {"status": "success", "message": "Alerts cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing alerts: {str(e)}")
    