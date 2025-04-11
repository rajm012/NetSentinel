from typing import Optional, Set

class HTTPFingerprinter:
    def __init__(self):
        """Initialize HTTP fingerprinter"""
        self.user_agents: Set[str] = set()

    def get_user_agent(self, packet) -> Optional[str]:
        """
        Extract User-Agent from HTTP headers.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            User-Agent string if found, None otherwise
        """
        try:
            packet_bytes = bytes(packet)
            if b"User-Agent" in packet_bytes:
                ua_line = str(packet_bytes).split("User-Agent:")[1].split("\\r\\n")[0]
                ua = ua_line.strip()
                self.user_agents.add(ua)
                return ua
            return None
        except Exception:
            return None

    def get_all_user_agents(self) -> Set[str]:
        """Get all unique User-Agents detected"""
        return self.user_agents

    def reset(self):
        """Reset collected User-Agents"""
        self.user_agents = set()
        