from scapy.all import sniff, wrpcap

packets = sniff(count=100)
wrpcap("sample.pcap", packets)
