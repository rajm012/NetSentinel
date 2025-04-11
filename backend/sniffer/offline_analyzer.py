# sniffer/offline_analyzer.py
from scapy.all import rdpcap
from .protocols import tcp, dns, http, tls

class OfflineAnalyzer:
    def __init__(self, filepath):
        self.filepath = filepath
        self.results = []
        self.packet_count = 0
        
    def analyze(self):
        """Analyze a PCAP file and return the results"""
        packets = rdpcap(self.filepath)
        results = []
        
        for pkt in packets:
            packet_data = {}
            
            # Parse protocols
            tcp_result = tcp.parse(pkt)
            dns_result = dns.parse(pkt)
            http_result = http.parse(pkt)
            tls_result = tls.parse(pkt)
            
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
                results.append(packet_data)
                self.packet_count += 1
                
        self.results = results
        return self.get_summary()
        
    def get_summary(self):
        """Get summary statistics from the analysis"""
        protocol_counts = {
            "TCP": 0,
            "UDP": 0,
            "DNS": 0,
            "HTTP": 0,
            "TLS": 0
        }
        
        for result in self.results:
            if "protocol" in result:
                protocol = result["protocol"]
                if protocol in protocol_counts:
                    protocol_counts[protocol] += 1
        
        return {
            "filepath": self.filepath,
            "total_packets": self.packet_count,
            "protocol_distribution": protocol_counts,
            "has_results": len(self.results) > 0
        }
        
    def get_results(self, limit=100, offset=0):
        """Get a portion of the results"""
        end = offset + limit
        return self.results[offset:end]
    
    