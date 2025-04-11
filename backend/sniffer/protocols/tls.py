
# sniffer/protocols/tls.py
from scapy.layers.tls.all import TLS

def parse(packet):
    if "TLS" in packet.summary():
        return {
            "protocol": "TLS",
            "summary": packet.summary(),
            "detected": True
        }
    return None

