from scapy.all import TCP, IP
from typing import Tuple, Optional

class SynFloodDetector:
    def __init__(self, threshold: int = 100):
        """
        Initialize SYN Flood detector with a threshold.
        
        Args:
            threshold: Number of SYN packets from a single IP to trigger detection
        """
        self.threshold = threshold
        self.syn_counter = {}

    def detect(self, packet) -> Tuple[bool, Optional[str]]:
        """
        Detect SYN flood attack from a packet.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            Tuple of (is_attack, source_ip) where:
            - is_attack: True if SYN flood detected
            - source_ip: Attacker IP if detected, None otherwise
        """
        if not packet.haslayer(TCP) or packet[TCP].flags != 'S':
            return False, None

        if not packet.haslayer(IP):
            return False, None

        src_ip = packet[IP].src
        self.syn_counter[src_ip] = self.syn_counter.get(src_ip, 0) + 1

        if self.syn_counter[src_ip] > self.threshold:
            return True, src_ip
        return False, None

    def reset(self):
        """Reset the SYN counter"""
        self.syn_counter = {}
        
        