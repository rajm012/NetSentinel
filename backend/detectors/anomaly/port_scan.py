from scapy.all import TCP, IP, IPv6
from scapy.packet import Packet
from typing import Tuple, Optional, Dict, Set

class PortScanDetector:
    def __init__(self, scan_threshold: int = 20):
        """
        Initialize port scan detector.
        
        Args:
            scan_threshold: Number of unique ports to trigger detection
        """
        self.scan_threshold = scan_threshold
        self.scan_map: Dict[str, Set[int]] = {}

    def detect(self, packet: Packet) -> Tuple[bool, Optional[str]]:
        """
        Detect port scanning activity from network packets.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            Tuple of (detection_flag, source_ip) where:
            - detection_flag: True if scan detected
            - source_ip: IP address of scanner if detected, None otherwise
        """
        # Skip non-IP packets
        if not (packet.haslayer(IP) or packet.haslayer(IPv6)):
            return False, None

        # Get source IP (handles both IPv4 and IPv6)
        src_ip = None
        if packet.haslayer(IP):
            src_ip = packet[IP].src
        elif packet.haslayer(IPv6):
            src_ip = packet[IPv6].src

        # Get destination port if TCP packet
        dport = None
        if packet.haslayer(TCP):
            dport = packet[TCP].dport

        # Skip if we couldn't get a source IP or destination port
        if not src_ip or not dport:
            return False, None

        # Initialize scan tracking for this IP if needed
        if src_ip not in self.scan_map:
            self.scan_map[src_ip] = set()

        # Track this port for the source IP
        self.scan_map[src_ip].add(dport)

        # Check if threshold exceeded
        if len(self.scan_map[src_ip]) > self.scan_threshold:
            return True, src_ip

        return False, None

    def reset(self):
        """Reset the scan tracking"""
        self.scan_map = {}
        
        