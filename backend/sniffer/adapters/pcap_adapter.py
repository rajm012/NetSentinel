# sniffer/adapters/pcap_adapter.py

from scapy.all import rdpcap

def read_pcap(path):
    return rdpcap(path)
