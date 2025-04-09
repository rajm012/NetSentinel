from fastapi import APIRouter, UploadFile, File, Form
from scapy.all import rdpcap
import tempfile

from backend.detectors.anomaly.syn_flood import SynFloodDetector
from backend.detectors.anomaly.port_scan import detect_port_scan
from backend.detectors.anomaly.dns_tunneling import detect_dns_tunneling
from backend.detectors.anomaly.arp_spoof import detect_arp_spoof

from backend.detectors.behavioral.timing import detect_timing_anomaly
from backend.detectors.behavioral.connection_rate import monitor_conn_rate
from backend.detectors.behavioral.bandwidth import monitor_bandwidth

from backend.detectors.fingerprinting.tls import ja3_fingerprint
from backend.detectors.fingerprinting.http import analyze_http_headers
from backend.detectors.fingerprinting.device import fingerprint_device

from backend.detectors.threats.tor import detect_tor_traffic
from backend.detectors.threats.metasploit import detect_metasploit
from backend.detectors.threats.cobalt_strike import detect_cobalt_strike

router = APIRouter()

# ------------------------ Upload and Detect -----------------------------

@router.post("/detect/anomalies")
async def detect_anomalies(file: UploadFile = File(...), syn_threshold: int = Form(100), port_threshold: int = Form(20)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        packets = rdpcap(tmp.name)

    syn_detector = SynFloodDetector(threshold=syn_threshold)
    results = {
        "syn_flood": set(),
        "port_scan": set(),
        "dns_tunneling": [],
        "arp_spoofing": set()
    }

    for pkt in packets:
        flood, ip1 = syn_detector.detect(pkt)
        scan, ip2 = detect_port_scan(pkt, scan_threshold=port_threshold)
        dns, q = detect_dns_tunneling(pkt)
        arp, ip3 = detect_arp_spoof(pkt)

        if flood: results["syn_flood"].add(ip1)
        if scan: results["port_scan"].add(ip2)
        if dns: results["dns_tunneling"].append(q)
        if arp: results["arp_spoofing"].add(ip3)

    return {
        "syn_flood_ips": list(results["syn_flood"]),
        "port_scan_ips": list(results["port_scan"]),
        "dns_tunnel_queries": results["dns_tunneling"],
        "arp_spoofing_ips": list(results["arp_spoofing"])
    }

@router.post("/detect/behavior")
async def detect_behavior(file: UploadFile = File(...), conn_limit: int = Form(100), window: int = Form(10), bw_threshold: float = Form(1e6)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        packets = rdpcap(tmp.name)

    timing_anomalies = 0
    conn_anomalies = 0
    bw_triggered = False

    for pkt in packets:
        if detect_timing_anomaly(pkt):
            timing_anomalies += 1
        if monitor_conn_rate(pkt, window=window, limit=conn_limit):
            conn_anomalies += 1
        if not bw_triggered:
            bw_triggered = monitor_bandwidth(pkt, threshold=bw_threshold)

    return {
        "timing_anomalies_detected": timing_anomalies,
        "connection_rate_alerts": conn_anomalies,
        "bandwidth_threshold_exceeded": bw_triggered
    }

@router.post("/detect/fingerprints")
async def detect_fingerprints(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        packets = rdpcap(tmp.name)

    results = {
        "ja3_hashes": set(),
        "user_agents": set(),
        "device_types": set()
    }

    for pkt in packets:
        ja3 = ja3_fingerprint(pkt)
        if ja3:
            results["ja3_hashes"].add(ja3)

        ua = analyze_http_headers(pkt)
        if ua:
            results["user_agents"].add(ua)

        if hasattr(pkt, "src"):  # if MAC is available
            mac = getattr(pkt, "src", None)
            if mac:
                results["device_types"].add(fingerprint_device(mac))

    return {
        "ja3_hashes": list(results["ja3_hashes"]),
        "user_agents": list(results["user_agents"]),
        "device_types": list(results["device_types"]),
    }

@router.post("/detect/threats")
async def detect_known_threats(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        packets = rdpcap(tmp.name)

    metasploit = 0
    cobalt = 0
    tor_detected = 0

    for pkt in packets:
        if detect_metasploit(pkt): metasploit += 1
        if detect_cobalt_strike(pkt): cobalt += 1
        if detect_tor_traffic(pkt): tor_detected += 1

    return {
        "metasploit_detected": metasploit,
        "cobalt_strike_detected": cobalt,
        "tor_traffic_detected": tor_detected
    }
