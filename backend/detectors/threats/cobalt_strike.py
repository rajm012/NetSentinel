def detect_cobalt_strike(packet):
    return b"cobalt" in bytes(packet).lower()
