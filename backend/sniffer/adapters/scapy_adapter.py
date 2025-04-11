# sniffer/adapters/scapy_adapter.py
from scapy.all import sniff
import threading
import time

BPF_MAP = {
    "tcp": "tcp",
    "udp": "udp",
    "icmp": "icmp",
    "dns": "port 53",
    "http": "port 80",
    "https": "port 443",
    "tls": "port 443",
    "arp": "arp"
}

class ScapySniffer:
    def __init__(self, iface, filters, callback):
        self.iface = iface
        self.filters = filters
        self.callback = callback
        self.running = False
        self._stop_sniffer = threading.Event()
        
    def start(self):
        self.running = True
        self._stop_sniffer.clear()
        
        filter_expr = ""
        if self.filters:
            filter_expr = " or ".join([BPF_MAP.get(proto, proto) for proto in self.filters])
        
        # Use stop_filter to check the event periodically
        sniff(
            iface=self.iface, 
            prn=self.callback, 
            filter=filter_expr, 
            store=False,
            stop_filter=lambda _: self._stop_sniffer.is_set()
        )
        
        self.running = False
        return True
        
    def stop(self):
        self._stop_sniffer.set()
        # Wait for the sniffer to actually stop
        timeout = 3  # seconds
        start_time = time.time()
        while self.running and time.time() - start_time < timeout:
            time.sleep(0.1)
        return not self.running

