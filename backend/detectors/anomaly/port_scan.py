from scapy.all import TCP, IP


def detect_port_scan(packet, scan_threshold=20):
    src_ip = packet[IP].src
    dport = packet[TCP].dport if TCP in packet else None

    if not hasattr(detect_port_scan, "scan_map"):
        detect_port_scan.scan_map = {}

    if src_ip not in detect_port_scan.scan_map:
        detect_port_scan.scan_map[src_ip] = set()

    detect_port_scan.scan_map[src_ip].add(dport)

    if len(detect_port_scan.scan_map[src_ip]) > scan_threshold:
        return True, src_ip

    return False, None
