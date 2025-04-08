# sniffer/protocols/dns.py

from scapy.layers.dns import DNS

def parse(packet):
    if packet.haslayer(DNS):
        dns_layer = packet[DNS]
        print(f"[DNS] Query: {dns_layer.qd.qname.decode('utf-8', 'ignore')}")
