# api/routes/alerts.py
from flask import Blueprint, jsonify
import json

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
