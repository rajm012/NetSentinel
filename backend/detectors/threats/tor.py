from scapy.all import TCP
from typing import Optional

class TorDetector:
    def __init__(self):
        """Initialize Tor traffic detector"""
        self.tor_packets: int = 0

    def detect(self, packet) -> bool:
        """
        Detect Tor traffic.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            True if Tor traffic detected, False otherwise
        """
        if packet.haslayer(TCP) and packet[TCP].dport == 9001:
            self.tor_packets += 1
            return True
        return False

    def get_tor_packet_count(self) -> int:
        """Get count of Tor packets detected"""
        return self.tor_packets

    def reset(self):
        """Reset detector state"""
        self.tor_packets = 0
        