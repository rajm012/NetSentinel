# sniffer/protocols/http.py
from scapy.packet import Raw
import re

def parse(packet):
    if packet.haslayer(Raw):
        payload = bytes(packet[Raw]).decode("utf-8", errors="ignore")
        if "HTTP" in payload:
            # Extract HTTP method, path, and status code if possible
            method_match = re.search(r"(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH) (.*?) HTTP", payload)
            status_match = re.search(r"HTTP/\d\.\d (\d{3})", payload)
            
            result = {
                "protocol": "HTTP",
                "payload_preview": payload[:100],
                "raw_size": len(payload)
            }
            
            if method_match:
                result["method"] = method_match.group(1)
                result["path"] = method_match.group(2)
            
            if status_match:
                result["status_code"] = int(status_match.group(1))
                
            return result
    return None

