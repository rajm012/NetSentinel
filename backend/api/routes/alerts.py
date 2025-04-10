# api/routes/alerts.py
from flask import Blueprint, jsonify
import json
from fastapi import APIRouter, Body
from backend.utils.helpers import log_alert, format_timestamp
from pydantic import BaseModel
from fastapi.responses import JSONResponse

# alerts_bp = Blueprint("alerts", __name__)
router = APIRouter()

@router.get("/")
def get_alerts():
    from backend.config.settings import ANOMALY_LOG_FILE
    try:
        with open(ANOMALY_LOG_FILE, 'r') as f:
            alerts = json.load(f)
        return jsonify(alerts)
    except:
        return JSONResponse(content=[])

class ManualAlert(BaseModel):
    type: str
    message: str
    severity: str

@router.post("/manual")
def log_manual_alert(alert: ManualAlert):
    alert_dict = alert.dict()
    alert_dict["timestamp"] = alert_dict.get("timestamp") or format_timestamp()
    log_alert(alert_dict)
    return {"status": "logged"}
