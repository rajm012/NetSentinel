# sniffer/core.py

from .adapters.scapy_adapter import ScapySniffer
from .protocols import tcp, dns, http, tls

class Sniffer:
    def __init__(self, iface="wlan0", filters=None):
        self.iface = iface
        self.filters = filters or []
        self.packet_handler = self._handle_packet

    def _handle_packet(self, packet):
        tcp.parse(packet)
        dns.parse(packet)
        http.parse(packet)
        tls.parse(packet)

    def start(self):
        print(f"[🔍] Starting live sniffing on interface: {self.iface}")
        sniffer = ScapySniffer(self.iface, self.filters, self.packet_handler)
        sniffer.start()
