from scapy.all import *
import random
from scapy.layers.inet import TCP, IP, UDP, ICMP
from scapy.layers.l2 import Ether, ARP
from scapy.layers.dns import DNS, DNSQR

packets = []

# === SYN Flood ===
for _ in range(150):
    pkt = Ether() / IP(src="10.0.0.5", dst="10.0.0.10") / TCP(sport=random.randint(1024, 65535), dport=80, flags="S")
    packets.append(pkt)

# === Port Scan ===
for port in range(1, 50):
    pkt = Ether() / IP(src="10.0.0.6", dst="10.0.0.10") / TCP(sport=random.randint(1024, 65535), dport=port, flags="S")
    packets.append(pkt)

# === DNS Tunneling ===
dns_domains = [
    "a.b.c.d.e.f.g.h.i.j.example.com",
    "averylongquerystring.com"
]
for domain in dns_domains:
    pkt = Ether() / IP(dst="8.8.8.8") / UDP(sport=random.randint(1024, 65535), dport=53) / DNS(rd=1, qd=DNSQR(qname=domain))
    packets.append(pkt)

# === ARP Spoofing ===
arp1 = Ether(src="aa:bb:cc:dd:ee:ff", dst="ff:ff:ff:ff:ff:ff") / ARP(op=2, pdst="10.0.0.100", psrc="10.0.0.1")
arp2 = Ether(src="11:22:33:44:55:66", dst="ff:ff:ff:ff:ff:ff") / ARP(op=2, pdst="10.0.0.100", psrc="10.0.0.1")
packets += [arp1, arp2]

# === High Frequency Timing Anomalies ===
for _ in range(20):
    pkt = Ether() / IP(src="10.0.0.7", dst="10.0.0.8") / TCP(sport=12345, dport=80) / Raw(load="burst")
    packets.append(pkt)

# === High Connection Rate ===
for _ in range(120):
    pkt = Ether() / IP(src="10.0.0.20", dst="10.0.0.21") / TCP(sport=random.randint(1024, 65535), dport=80, flags="S")
    packets.append(pkt)

# === High Bandwidth ===
payload = "A" * 65000
pkt = Ether() / IP(src="10.0.0.22", dst="10.0.0.23") / TCP(sport=random.randint(1024, 65535), dport=80) / Raw(load=payload)
packets.append(pkt)

# === HTTP Fingerprinting ===
http_payload = (
    b"GET / HTTP/1.1\r\n"
    b"Host: test.com\r\n"
    b"User-Agent: CustomAgent/1.0\r\n\r\n"
)
pkt = Ether() / IP(dst="10.0.0.9") / TCP(sport=random.randint(1024, 65535), dport=80, flags="PA") / Raw(load=http_payload)
packets.append(pkt)

# === Device Fingerprints (MAC-based) ===
fp1 = Ether(src="00:11:22:33:44:55") / IP(dst="10.0.0.9") / ICMP()
fp2 = Ether(src="00:aa:bb:cc:dd:ee") / IP(dst="10.0.0.9") / ICMP()
packets += [fp1, fp2]


fp3 = Ether(src="11:22:33:44:55:66") / IP(dst="10.0.0.9") / ICMP()
fp4 = Ether(src="22:33:44:55:66:77") / IP(dst="10.0.0.9") / ICMP()
packets += [fp3, fp4]

# === Save to PCAP ===
wrpcap("test_combined.pcap", packets)
print("[✔] test_combined.pcap created with all required anomalies.")
