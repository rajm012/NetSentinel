from scapy.all import rdpcap
from processing.flow_analyzer import FlowAnalyzer
from processing.statistics import TrafficStats
from processing.geoip import lookup
from processing.normalizer import FeatureNormalizer

# Load packets
packets = rdpcap("sample.pcap")

# Initialize analyzers
flow = FlowAnalyzer()
stats = TrafficStats()

# Process packets
for pkt in packets:
    flow.process_packet(pkt)
    stats.update(pkt)

# Print traffic summary
print("\n[📊] Traffic Summary:")
print(stats.summary())

# Print active flows
print("\n[🔁] Active Flows:")
for key, times in flow.get_active_flows().items():
    print(f"{key} ➜ Packets: {len(times)}")

# GeoIP test (first IP + known public IP)
print("\n[🌍] GeoIP Lookups:")
first_ip = packets[0]['IP'].src if 'IP' in packets[0] else None
if first_ip:
    print(f"First IP in capture ({first_ip}):")
    print(lookup(first_ip))

# Test with a known public IP (Google DNS)
print("\nTest with public IP (8.8.8.8):")
print(lookup("8.8.8.8"))

# Normalizer example (unchanged)
features = [[10, 5, 1000], [2, 1, 200], [7, 3, 500]]
norm = FeatureNormalizer()
normalized = norm.fit_transform(features)
print("\n[⚙️] Normalized Features:")
print(normalized)


# ----------------------------------------------------------------------------------

# (zenv) PS E:\4th Semester\Packet Sniffer\backend> python test_processing.py
# [✅] GeoIP database loaded successfully from: E:\4th Semester\Packet Sniffer\backend\resources\GeoLite2-City.mmdb

# [📊] Traffic Summary:
# {'total_packets': 91, 'total_bytes': 40541, 'proto_6_count': 76, 'proto_2_count': 4, 'proto_17_count': 11}

# [🔁] Active Flows:
# ('172.18.32.234', '140.82.114.22', 22022, 443, 'TCP') ➜ Packets: 11
# ('140.82.114.22', '172.18.32.234', 443, 22022, 'TCP') ➜ Packets: 15
# ('172.18.32.144', '224.0.0.22', 0, 0, 'OTHER') ➜ Packets: 4
# ('172.18.32.144', '224.0.0.252', 65031, 5355, 'UDP') ➜ Packets: 2
# ('172.18.32.234', '140.82.112.22', 21939, 443, 'TCP') ➜ Packets: 13
# ('140.82.112.22', '172.18.32.234', 443, 21939, 'TCP') ➜ Packets: 14
# ('172.18.32.234', '10.7.0.1', 55994, 53, 'UDP') ➜ Packets: 1
# ('10.7.0.1', '172.18.32.234', 53, 55994, 'UDP') ➜ Packets: 1
# ('172.18.32.234', '20.189.173.16', 22023, 443, 'TCP') ➜ Packets: 7
# ('20.189.173.16', '172.18.32.234', 443, 22023, 'TCP') ➜ Packets: 10
# ('172.18.32.234', '142.250.76.46', 57498, 443, 'UDP') ➜ Packets: 3
# ('172.18.32.234', '140.82.114.22', 22024, 443, 'TCP') ➜ Packets: 3
# ('140.82.114.22', '172.18.32.234', 443, 22024, 'TCP') ➜ Packets: 3
# ('142.250.76.46', '172.18.32.234', 443, 57498, 'UDP') ➜ Packets: 4

# [🌍] GeoIP Lookups:
# First IP in capture (172.18.32.234):
# [⏭️] Skipping private/special IP: 172.18.32.234
# None

# Test with public IP (8.8.8.8):
# [🌍] Found GeoIP data for 8.8.8.8: Unknown, United States
# {'city': 'Unknown', 'country': 'United States', 'lat': 37.751, 'lon': -97.822}

# [⚙️] Normalized Features:
# [[1.    1.    1.   ]
#  [0.    0.    0.   ]
#  [0.625 0.5   0.375]]
# (zenv) PS E:\4th Semester\Packet Sniffer\backend> 

# -------------------------------------------------------------------------
