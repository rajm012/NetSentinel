# sniffer/core.py
from .adapters.scapy_adapter import ScapySniffer
from .protocols import tcp, dns, http, tls
import threading
import json, time
import queue

class Sniffer:
    def __init__(self, iface="wlan0", filters=None):
        self.iface = iface
        self.filters = filters or []
        self.packet_handler = self._handle_packet
        self.results_queue = queue.Queue()
        self.running = False
        self.thread = None
        self.packet_count = 0
        self.results = []
        
        
    # Add timestamp to packet data in the _handle_packet method
    def _handle_packet(self, packet):
        packet_data = {}
    
        # Parse protocols
        tcp_result = tcp.parse(packet)
        dns_result = dns.parse(packet)
        http_result = http.parse(packet)
        tls_result = tls.parse(packet)
    
        # Combine results
        if tcp_result:
            packet_data.update(tcp_result)
        if dns_result:
            packet_data.update(dns_result)
        if http_result:
            packet_data.update(http_result)
        if tls_result:
            packet_data.update(tls_result)
        
        if packet_data:
            packet_data["packet_number"] = self.packet_count
            packet_data["timestamp"] = time.time()  # Add timestamp
            self.results_queue.put(packet_data)
            self.results.append(packet_data)
            self.packet_count += 1

    # Add this to the Sniffer class in sniffer/core.py
    def get_results(self, limit=100, clear=False, since_timestamp=None):
        """Return the most recent results up to limit"""
        # If timestamp is provided, filter results by timestamp
        if since_timestamp is not None:
            filtered_results = [r for r in self.results if r.get("timestamp", 0) > since_timestamp]
            results = filtered_results[:limit]
        else:
            # Original implementation
            results = []
            try:
                while len(results) < limit and not self.results_queue.empty():
                    results.append(self.results_queue.get_nowait())
            except queue.Empty:
                pass
            
        if clear:
            self.results = self.results[len(results):]
            
        return results
            
    def start(self):
        """Start sniffing in a separate thread"""
        if self.running:
            return False
            
        self.running = True
        self.packet_count = 0
        self.results = []
        
        # Clear queue
        while not self.results_queue.empty():
            self.results_queue.get_nowait()
            
        sniffer = ScapySniffer(self.iface, self.filters, self.packet_handler)
        self.thread = threading.Thread(target=sniffer.start)
        self.thread.daemon = True
        self.thread.start()
        return True
        
    def stop(self):
        """Stop the sniffer thread"""
        if not self.running:
            return False
            
        self.running = False
        # Note: Scapy's sniff doesn't have a clean way to stop
        # We'll need to implement a stopping mechanism in ScapySniffer
        return True
        
    def get_stats(self):
        """Return statistics about the sniffing session"""
        return {
            "packet_count": self.packet_count,
            "running": self.running,
            "interface": self.iface,
            "filters": self.filters
        }

