# api/routes/system.py
from flask import Blueprint, jsonify
import platform
import socket

system_bp = Blueprint("system", __name__)

@system_bp.route("/info", methods=["GET"])
def get_system_info():
    return jsonify({
        "hostname": socket.gethostname(),
        "platform": platform.system(),
        "interface": "Wi-Fi"
    })
