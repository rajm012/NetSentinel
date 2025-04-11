from typing import Optional

class MetasploitDetector:
    def __init__(self):
        """Initialize Metasploit detector"""
        self.metasploit_packets: int = 0

    def detect(self, packet) -> bool:
        """
        Detect Metasploit traffic.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            True if Metasploit traffic detected, False otherwise
        """
        if b"metasploit" in bytes(packet).lower():
            self.metasploit_packets += 1
            return True
        return False

    def get_metasploit_packet_count(self) -> int:
        """Get count of Metasploit packets detected"""
        return self.metasploit_packets

    def reset(self):
        """Reset detector state"""
        self.metasploit_packets = 0
        