# api/routes/packets.py
from flask import Blueprint, jsonify

packets_bp = Blueprint("packets", __name__)

@packets_bp.route("/", methods=["GET"])
def get_packet_summary():
    # Dummy data
    return jsonify({
        "total_packets": 4523,
        "http": 1200,
        "dns": 430,
        "tls": 923,
        "tcp": 1970
    })
