# sniffer/protocols/tcp.py

from scapy.layers.inet import TCP

def parse(packet):
    if packet.haslayer(TCP):
        tcp_layer = packet[TCP]
        print(f"[TCP] Src Port: {tcp_layer.sport}, Dst Port: {tcp_layer.dport}")
