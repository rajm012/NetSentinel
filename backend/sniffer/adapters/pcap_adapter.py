# sniffer/adapters/pcap_adapter.py
from scapy.all import rdpcap

def read_pcap(path):
    """Read a PCAP file and return the packets"""
    packets = rdpcap(path)
    return {
        "packet_count": len(packets),
        "file_path": path
    }

