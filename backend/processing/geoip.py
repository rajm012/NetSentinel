import geoip2.database
import ipaddress
from pathlib import Path
import os

def is_public_ip(ip):
    """Check if an IP is public (not private, multicast, or reserved)."""
    try:
        ip_obj = ipaddress.ip_address(ip)
        return (
            not ip_obj.is_private
            and not ip_obj.is_multicast
            and not ip_obj.is_reserved
            and not ip_obj.is_loopback
        )
    except ValueError:
        return False

def get_db_path():
    """Get the absolute path to the GeoIP database."""
    try:
        base_dir = Path(__file__).parent.parent
        db_path = base_dir / "resources" / "GeoLite2-City.mmdb"
        return str(db_path.resolve())
    except Exception as e:
        print(f"[❌] Path resolution error: {e}")
        return None

# Initialize GeoIP reader
reader = None
db_path = get_db_path()

if db_path and os.path.exists(db_path):
    try:
        reader = geoip2.database.Reader(db_path)
        print(f"[✅] GeoIP database loaded successfully from: {db_path}")
    except Exception as e:
        print(f"[❌] Failed to load GeoIP database: {e}")
else:
    print(f"[❌] GeoIP database not found at: {db_path or 'specified path'}")

def lookup(ip):
    """Perform GeoIP lookup on a given IP (skips private/special IPs)."""
    if not reader:
        print("[⚠️] GeoIP reader not initialized!")
        return None

    if not is_public_ip(ip):
        print(f"[⏭️] Skipping private/special IP: {ip}")
        return None

    try:
        resp = reader.city(ip)
        result = {
            "city": resp.city.name or "Unknown",
            "country": resp.country.name or "Unknown",
            "lat": resp.location.latitude,
            "lon": resp.location.longitude,
        }
        print(f"[🌍] Found GeoIP data for {ip}: {result['city']}, {result['country']}")
        return result
    except geoip2.errors.AddressNotFoundError:
        print(f"[⚠️] IP not found in GeoIP DB: {ip}")
        return None
    except Exception as e:
        print(f"[❌] GeoIP lookup failed for {ip}: {str(e)}")
        return None