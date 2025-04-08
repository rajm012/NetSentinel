# sniffer/offline_analyzer.py

from scapy.all import rdpcap
from .protocols import tcp, dns, http, tls

class OfflineAnalyzer:
    def __init__(self, filepath):
        self.filepath = filepath

    def analyze(self):
        print(f"[📁] Analyzing file: {self.filepath}")
        packets = rdpcap(self.filepath)
        for pkt in packets:
            tcp.parse(pkt)
            dns.parse(pkt)
            http.parse(pkt)
            tls.parse(pkt)
