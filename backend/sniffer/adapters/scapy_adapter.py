# sniffer/adapters/scapy_adapter.py

from scapy.all import sniff


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

    def start(self):
        filter_expr = " or ".join([BPF_MAP.get(proto, proto) for proto in self.filters])
        sniff(iface=self.iface, prn=self.callback, filter=filter_expr, store=False)

