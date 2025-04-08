# sniffer/protocols/http.py

from scapy.packet import Raw

def parse(packet):
    if packet.haslayer(Raw):
        payload = bytes(packet[Raw]).decode("utf-8", errors="ignore")
        if "HTTP" in payload:
            print(f"[HTTP] Payload: {payload[:100]}")
