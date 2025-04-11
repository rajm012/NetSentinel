# sniffer/protocols/tcp.py
from scapy.layers.inet import TCP

def parse(packet):
    if packet.haslayer(TCP):
        tcp_layer = packet[TCP]
        return {
            "protocol": "TCP",
            "src_port": tcp_layer.sport,
            "dst_port": tcp_layer.dport,
            "flags": str(tcp_layer.flags),
            "seq": tcp_layer.seq,
            "ack": tcp_layer.ack
        }
    return None
