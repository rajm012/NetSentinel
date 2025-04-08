from scapy.all import TCP, IP  # Import TCP and IP layers from Scapy

def detect_syn_flood(packet, threshold=100):
    if not packet.haslayer(TCP) or not packet[TCP].flags == 'S':
        return False, None

    src_ip = packet[IP].src

    if not hasattr(detect_syn_flood, "syn_counter"):
        detect_syn_flood.syn_counter = {}

    detect_syn_flood.syn_counter[src_ip] = detect_syn_flood.syn_counter.get(src_ip, 0) + 1

    if detect_syn_flood.syn_counter[src_ip] > threshold:
        return True, src_ip

    return False, None
