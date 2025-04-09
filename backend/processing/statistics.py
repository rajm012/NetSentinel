from collections import defaultdict

class TrafficStats:
    def __init__(self):
        self.stats = defaultdict(int)

    def update(self, packet):
        if packet.haslayer("IP"):
            proto = packet['IP'].proto
            size = len(packet)
            self.stats["total_packets"] += 1
            self.stats["total_bytes"] += size
            self.stats[f"proto_{proto}_count"] += 1

    def summary(self):
        return dict(self.stats)

