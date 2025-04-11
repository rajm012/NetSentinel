class BandwidthMonitor:
    def __init__(self, threshold: float = 1e6):
        """
        Initialize bandwidth monitor.
        
        Args:
            threshold: Bytes threshold to trigger alert
        """
        self.threshold = threshold
        self.byte_count: int = 0
        self.threshold_exceeded: bool = False

    def monitor(self, packet) -> bool:
        """
        Monitor bandwidth usage.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            True if bandwidth threshold exceeded, False otherwise
        """
        if not self.threshold_exceeded:
            self.byte_count += len(packet)
            if self.byte_count > self.threshold:
                self.threshold_exceeded = True
                return True
        return False

    def get_bandwidth_usage(self) -> int:
        """Get current bandwidth usage in bytes"""
        return self.byte_count

    def is_threshold_exceeded(self) -> bool:
        """Check if bandwidth threshold was exceeded"""
        return self.threshold_exceeded

    def reset(self):
        """Reset monitor state"""
        self.byte_count = 0
        self.threshold_exceeded = False
        