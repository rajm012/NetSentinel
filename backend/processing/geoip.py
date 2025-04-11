# ✅ Updated backend/processing/geoip.py (No print, return logs instead)
import geoip2.database
import ipaddress
from pathlib import Path
import os

_geoip_reader = None

def load_geoip_reader(db_path="E:\\4th Semester\\Packet Sniffer\\backend\\resources\\GeoLite2-City.mmdb"):
    global _geoip_reader
    try:
        path = db_path or str(Path(__file__).parent.parent / "resources" / "GeoLite2-City.mmdb")
        if os.path.exists(path):
            _geoip_reader = geoip2.database.Reader(path)
            return {"success": True, "message": f"Loaded GeoIP DB from: {path}"}
        else:
            return {"success": False, "message": f"GeoIP DB not found at: {path}"}
    except Exception as e:
        return {"success": False, "message": f"Error loading GeoIP DB: {e}"}


def is_public_ip(ip):
    try:
        ip_obj = ipaddress.ip_address(ip)
        return not (ip_obj.is_private or ip_obj.is_multicast or ip_obj.is_reserved or ip_obj.is_loopback)
    except ValueError:
        return False


def get_db_path():
    try:
        base_dir = Path(__file__).parent.parent
        db_path = base_dir / "resources" / "GeoLite2-City.mmdb"
        return str(db_path.resolve())
    except Exception as e:
        return None


def lookup(ip):
    if not _geoip_reader:
        return {"success": False, "message": "GeoIP reader not initialized."}

    if not is_public_ip(ip):
        return {"success": False, "message": "Provided IP is not public."}

    try:
        response = _geoip_reader.city(ip)
        location = {
            "ip": ip,
            "city": response.city.name,
            "country": response.country.name,
            "continent": response.continent.name,
            "latitude": response.location.latitude,
            "longitude": response.location.longitude,
            "timezone": response.location.time_zone
        }
        return {"success": True, "location": location}
    except Exception as e:
        return {"success": False, "message": str(e)}

