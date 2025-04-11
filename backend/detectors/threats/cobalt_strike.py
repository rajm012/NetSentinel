from typing import Optional

class CobaltStrikeDetector:
    def __init__(self):
        """Initialize Cobalt Strike detector"""
        self.cobalt_packets: int = 0

    def detect(self, packet) -> bool:
        """
        Detect Cobalt Strike traffic.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            True if Cobalt Strike traffic detected, False otherwise
        """
        if b"cobalt" in bytes(packet).lower():
            self.cobalt_packets += 1
            return True
        return False

    def get_cobalt_packet_count(self) -> int:
        """Get count of Cobalt Strike packets detected"""
        return self.cobalt_packets

    def reset(self):
        """Reset detector state"""
        self.cobalt_packets = 0
        