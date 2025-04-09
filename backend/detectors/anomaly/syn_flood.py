# syn_flood.py
from scapy.all import TCP, IP

class SynFloodDetector:
    def __init__(self, threshold=100):
        self.threshold = threshold
        self.syn_counter = {}

    def detect(self, packet):
        if not packet.haslayer(TCP) or packet[TCP].flags != 'S':
            return False, None

        src_ip = packet[IP].src
        self.syn_counter[src_ip] = self.syn_counter.get(src_ip, 0) + 1

        if self.syn_counter[src_ip] > self.threshold:
            return True, src_ip
        return False, None
