from scapy.layers.l2 import ARP
from typing import Tuple, Optional, Dict

class ARPSpoofDetector:
    def __init__(self):
        """Initialize ARP spoofing detector"""
        self.ip_mac_table: Dict[str, str] = {}

    def detect(self, packet) -> Tuple[bool, Optional[str]]:
        """
        Detect ARP spoofing activity.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            Tuple of (is_spoofing, ip) where:
            - is_spoofing: True if spoofing detected
            - ip: IP address involved in spoofing if detected, None otherwise
        """
        if not packet.haslayer(ARP):
            return False, None
            
        if packet[ARP].op != 2:  # Not a reply
            return False, None

        ip = packet[ARP].psrc
        mac = packet[ARP].hwsrc

        if ip in self.ip_mac_table:
            if self.ip_mac_table[ip] != mac:
                return True, ip  # IP mapped to multiple MACs
        else:
            self.ip_mac_table[ip] = mac

        return False, None

    def get_mapping_table(self) -> Dict[str, str]:
        """Get current IP to MAC mapping"""
        return self.ip_mac_table

    def reset(self):
        """Reset IP to MAC mapping"""
        self.ip_mac_table = {}
        