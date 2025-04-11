from scapy.layers.tls.all import TLS, TLSClientHello
import hashlib
from typing import Optional, Set

class TLSFingerprinter:
    def __init__(self):
        """Initialize TLS fingerprinter"""
        self.ja3_hashes: Set[str] = set()

    def get_ja3(self, packet) -> Optional[str]:
        """
        Extract JA3 fingerprint from packet.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            JA3 hash string if found, None otherwise
        """
        if not packet.haslayer(TLSClientHello):
            return None

        try:
            hello = packet[TLSClientHello]
            ciphers = "-".join(map(str, hello.ciphers))
            extensions = "-".join(str(e.ext_type) for e in hello.ext)
            ja3_str = f"{hello.version},{ciphers},{extensions},0,0"
            ja3_hash = hashlib.md5(ja3_str.encode()).hexdigest()
            self.ja3_hashes.add(ja3_hash)
            return ja3_hash
        except Exception:
            return None

    def get_all_ja3(self) -> Set[str]:
        """Get all unique JA3 hashes detected"""
        return self.ja3_hashes

    def reset(self):
        """Reset collected hashes"""
        self.ja3_hashes = set()
        