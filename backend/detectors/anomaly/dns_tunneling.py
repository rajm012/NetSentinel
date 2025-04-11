from scapy.layers.dns import DNS, DNSQR
from typing import Tuple, Optional, List

class DNSTunnelingDetector:
    def __init__(self, min_subdomains: int = 5, min_length: int = 50):
        """
        Initialize DNS tunneling detector.
        
        Args:
            min_subdomains: Minimum subdomains to consider suspicious
            min_length: Minimum query length to consider suspicious
        """
        self.min_subdomains = min_subdomains
        self.min_length = min_length
        self.suspicious_queries: List[str] = []

    def detect(self, packet) -> Tuple[bool, Optional[str]]:
        """
        Detect DNS tunneling activity.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            Tuple of (is_tunneling, query) where:
            - is_tunneling: True if tunneling detected
            - query: Suspicious query if detected, None otherwise
        """
        if not packet.haslayer(DNS) or packet[DNS].qr != 0:
            return False, None
            
        try:
            query = packet[DNSQR].qname.decode()
            if (len(query.split(".")) > self.min_subdomains and len(query) > self.min_length):
                self.suspicious_queries.append(query)
                return True, query
            return False, None
        except:
            return False, None

    def get_suspicious_queries(self) -> List[str]:
        """Get all detected suspicious queries"""
        return self.suspicious_queries

    def reset(self):
        """Reset detected queries"""
        self.suspicious_queries = []
        