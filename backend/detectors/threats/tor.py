from scapy.all import TCP

def detect_tor_traffic(packet):
    if packet.haslayer(TCP) and packet[TCP].dport == 9001:
        return True
    return False
