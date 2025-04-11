import time
from typing import Optional

class TimingAnomalyDetector:
    def __init__(self, min_interval: float = 0.001):
        """
        Initialize timing anomaly detector.
        
        Args:
            min_interval: Minimum time between packets to consider normal (in seconds)
        """
        self.min_interval = min_interval
        self.last_time: Optional[float] = None
        self.anomaly_count: int = 0

    def detect(self, packet) -> bool:
        """
        Detect timing anomalies in packet flow.
        
        Args:
            packet: Scapy packet to analyze (not used directly, but maintains interface)
            
        Returns:
            True if timing anomaly detected, False otherwise
        """
        now = time.time()

        if self.last_time is None:
            self.last_time = now
            return False

        interval = now - self.last_time
        self.last_time = now

        if interval < self.min_interval:
            self.anomaly_count += 1
            return True

        return False

    def get_anomaly_count(self) -> int:
        """Get total number of detected timing anomalies"""
        return self.anomaly_count

    def reset(self):
        """Reset detector state"""
        self.last_time = None
        self.anomaly_count = 0
        
        