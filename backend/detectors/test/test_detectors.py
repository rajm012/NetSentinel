from scapy.all import rdpcap
from detectors.anomaly import port_scan, arp_spoof, dns_tunneling, syn_flood
from detectors.behavioral import bandwidth, connection_rate, timing
from detectors.fingerprinting import tls, http, device
from detectors.threats import cobalt_strike, metasploit, tor

packets = rdpcap("sample.pcap")

for pkt in packets:
    if pkt.haslayer("IP"):
        # Anomaly
        print("[+] Port Scan:", port_scan.detect_port_scan(pkt))
        print("[+] ARP Spoof:", arp_spoof.detect_arp_spoof(pkt))
        print("[+] DNS Tunnel:", dns_tunneling.detect_dns_tunneling(pkt))
        print("[+] SYN Flood:", syn_flood.detect_syn_flood(pkt))

        # Behavioral
        print("[+] Bandwidth:", bandwidth.monitor_bandwidth(pkt))
        print("[+] Conn Rate:", connection_rate.monitor_conn_rate(pkt))
        print("[+] Timing:", timing.detect_timing_anomaly(pkt))

        # Fingerprinting
        print("[+] JA3:", tls.ja3_fingerprint(pkt))
        print("[+] HTTP UA:", http.analyze_http_headers(pkt))
        print("[+] Device:", device.fingerprint_device(pkt.src))

        # Threats
        print("[+] Cobalt Strike:", cobalt_strike.detect_cobalt_strike(pkt))
        print("[+] Metasploit:", metasploit.detect_metasploit(pkt))
        print("[+] TOR:", tor.detect_tor_traffic(pkt))

# [+] SYN Flood: (False, None)
# [+] Bandwidth: False
# [+] Conn Rate: False
# [+] Timing: True
# [+] JA3: None
# [+] HTTP UA: None
# [+] Device: Unknown Device
# [+] Cobalt Strike: False
# [+] Metasploit: False
# [+] TOR: False
# (zenv) PS E:\4th Semester\Packet Sniffer\backend> python test_detectors.py
# [+] Port Scan: (False, None)
# [+] ARP Spoof: (False, None)
# [+] DNS Tunnel: (False, None)
# [+] SYN Flood: (False, None)
# [+] Bandwidth: False
# [+] Conn Rate: False
# [+] Timing: True
# [+] JA3: None
# [+] HTTP UA: None
# [+] Device: Unknown Device
# [+] Cobalt Strike: False
# [+] Metasploit: False
# [+] TOR: False