# api/routes/alerts.py
from flask import Blueprint, jsonify
import json
from fastapi import APIRouter, Body
from backend.utils.helpers import log_alert, format_timestamp
from pydantic import BaseModel


alerts_bp = Blueprint("alerts", __name__)
ALERT_FILE = "logs/anomalies.json"

@alerts_bp.route("/", methods=["GET"])
def get_alerts():
    try:
        with open(ALERT_FILE, 'r') as f:
            alerts = json.load(f)
        return jsonify(alerts)
    except:
        return jsonify([])

router = APIRouter()

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
