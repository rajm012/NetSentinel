def analyze_http_headers(packet):
    if b"User-Agent" in bytes(packet):
        ua_line = str(bytes(packet)).split("User-Agent:")[1].split("\\r\\n")[0]
        return ua_line.strip()
    return None
