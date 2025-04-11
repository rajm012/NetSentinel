import time
from typing import List

class ConnectionRateMonitor:
    def __init__(self, window: int = 10, limit: int = 100):
        """
        Initialize connection rate monitor.
        
        Args:
            window: Time window in seconds to monitor
            limit: Maximum allowed connections in the time window
        """
        self.window = window
        self.limit = limit
        self.conn_times: List[float] = []
        self.alert_count: int = 0

    def monitor(self, packet) -> bool:
        """
        Monitor connection rate.
        
        Args:
            packet: Scapy packet to analyze
            
        Returns:
            True if connection rate exceeds threshold, False otherwise
        """
        now = time.time()
        self.conn_times.append(now)
        
        # Remove old entries outside our window
        self.conn_times = [t for t in self.conn_times if now - t < self.window]

        if len(self.conn_times) > self.limit:
            self.alert_count += 1
            return True
            
        return False

    def get_alert_count(self) -> int:
        """Get total number of rate limit alerts"""
        return self.alert_count

    def reset(self):
        """Reset monitor state"""
        self.conn_times = []
        self.alert_count = 0
        