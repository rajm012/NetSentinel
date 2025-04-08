# sniffer/protocols/tls.py

def parse(packet):
    if "TLS" in packet.summary():
        print(f"[TLS] Detected potential TLS packet: {packet.summary()}")
