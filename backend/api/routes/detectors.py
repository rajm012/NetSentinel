from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from scapy.all import rdpcap
import tempfile
import os

router = APIRouter()

@router.post("/anomalies")
async def detect_anomalies(
    file: UploadFile = File(...),
    syn_threshold: int = Form(100),
    port_threshold: int = Form(20),
    dns_min_subdomains: int = Form(5),
    dns_min_length: int = Form(50)
):
    """
    Detect various network anomalies in a PCAP file.
    
    Args:
        file: PCAP file to analyze
        syn_threshold: SYN packets threshold for SYN flood detection
        port_threshold: Unique ports threshold for port scan detection
        dns_min_subdomains: Minimum subdomains for DNS tunneling detection
        dns_min_length: Minimum query length for DNS tunneling detection
    """
    
    from backend.detectors.anomaly.syn_flood import SynFloodDetector
    from backend.detectors.anomaly.port_scan import PortScanDetector
    from backend.detectors.anomaly.dns_tunneling import DNSTunnelingDetector
    from backend.detectors.anomaly.arp_spoof import ARPSpoofDetector
    
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            packets = rdpcap(tmp.name)
        os.unlink(tmp.name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PCAP file: {str(e)}")

    # Initialize detectors
    syn_detector = SynFloodDetector(threshold=syn_threshold)
    port_scan_detector = PortScanDetector(scan_threshold=port_threshold)
    dns_detector = DNSTunnelingDetector(min_subdomains=dns_min_subdomains, min_length=dns_min_length)
    arp_detector = ARPSpoofDetector()

    for pkt in packets:
        syn_detector.detect(pkt)
        port_scan_detector.detect(pkt)
        dns_detector.detect(pkt)
        arp_detector.detect(pkt)

    return {
        "syn_flood": {
            "detected_ips": list(syn_detector.syn_counter.keys()),
            "counts": syn_detector.syn_counter,
            "threshold_exceeded": [ip for ip, count in syn_detector.syn_counter.items() if count > syn_threshold]
        },
        "port_scan": {
            "scanner_ips": list(port_scan_detector.scan_map.keys()),
            "ports_scanned": {ip: len(ports) for ip, ports in port_scan_detector.scan_map.items()},
            "threshold_exceeded": [ip for ip, ports in port_scan_detector.scan_map.items() if len(ports) > port_threshold]
        },
        "dns_tunneling": {
            "suspicious_queries": dns_detector.get_suspicious_queries(),
            "total_detected": len(dns_detector.get_suspicious_queries())
        },
        "arp_spoofing": {
            "ip_mac_mappings": arp_detector.get_mapping_table(),
            "potential_spoofs": [ip for ip, mac in arp_detector.get_mapping_table().items() if len(mac) > 1]
        }
    }

@router.post("/behavior")
async def detect_behavior(
    file: UploadFile = File(...),
    conn_limit: int = Form(100),
    window: int = Form(10),
    bw_threshold: float = Form(1e6),
    timing_threshold: float = Form(0.001)
):
    """
    Detect behavioral anomalies in network traffic.
    
    Args:
        file: PCAP file to analyze
        conn_limit: Connection rate limit threshold
        window: Time window for connection rate monitoring (seconds)
        bw_threshold: Bandwidth threshold in bytes
        timing_threshold: Minimum packet interval threshold (seconds)
    """
    
    from backend.detectors.behavioral.timing import TimingAnomalyDetector
    from backend.detectors.behavioral.connection_rate import ConnectionRateMonitor
    from backend.detectors.behavioral.bandwidth import BandwidthMonitor
    
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            packets = rdpcap(tmp.name)
        os.unlink(tmp.name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PCAP file: {str(e)}")

    # Initialize monitors
    timing_detector = TimingAnomalyDetector(min_interval=timing_threshold)
    conn_monitor = ConnectionRateMonitor(window=window, limit=conn_limit)
    bw_monitor = BandwidthMonitor(threshold=bw_threshold)

    for pkt in packets:
        timing_detector.detect(pkt)
        conn_monitor.monitor(pkt)
        bw_monitor.monitor(pkt)

    return {
        "timing_anomalies": {
            "total_detected": timing_detector.get_anomaly_count(),
            "threshold": timing_threshold
        },
        "connection_rate": {
            "current_rate": conn_monitor.get_alert_count(),
            "limit": conn_limit,
            "window": window,
            "threshold_exceeded": conn_monitor.get_alert_count() > 0
        },
        "bandwidth": {
            "bytes_consumed": bw_monitor.get_bandwidth_usage(),
            "threshold": bw_threshold,
            "threshold_exceeded": bw_monitor.is_threshold_exceeded()
        }
    }

@router.post("/fingerprints")
async def detect_fingerprints(file: UploadFile = File(...)):
    """
    Extract fingerprints from network traffic.
    
    Args:
        file: PCAP file to analyze
    """

    from backend.detectors.fingerprinting.tls import TLSFingerprinter
    from backend.detectors.fingerprinting.http import HTTPFingerprinter
    from backend.detectors.fingerprinting.device import DeviceFingerprinter
    
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            packets = rdpcap(tmp.name)
        os.unlink(tmp.name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PCAP file: {str(e)}")

    # Initialize fingerprinters
    tls_fingerprinter = TLSFingerprinter()
    http_fingerprinter = HTTPFingerprinter()
    device_fingerprinter = DeviceFingerprinter()

    for pkt in packets:
        tls_fingerprinter.get_ja3(pkt)
        http_fingerprinter.get_user_agent(pkt)
        
        if hasattr(pkt, "src"):  # if MAC is available
            mac = getattr(pkt, "src", None)
            if mac:
                device_fingerprinter.fingerprint(mac)

    return {
        "tls_fingerprints": {
            "ja3_hashes": list(tls_fingerprinter.get_all_ja3()),
            "total_unique": len(tls_fingerprinter.get_all_ja3())
        },
        "http_fingerprints": {
            "user_agents": list(http_fingerprinter.get_all_user_agents()),
            "total_unique": len(http_fingerprinter.get_all_user_agents())
        },
        "device_fingerprints": {
            "device_types": list(device_fingerprinter.get_all_device_types()),
            "total_unique": len(device_fingerprinter.get_all_device_types())
        }
    }

@router.post("/threats")
async def detect_known_threats(file: UploadFile = File(...)):
    """
    Detect known threats in network traffic.
    
    Args:
        file: PCAP file to analyze
    """
    
    from backend.detectors.threats.tor import TorDetector
    from backend.detectors.threats.metasploit import MetasploitDetector
    from backend.detectors.threats.cobalt_strike import CobaltStrikeDetector
    
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            packets = rdpcap(tmp.name)
        os.unlink(tmp.name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PCAP file: {str(e)}")

    # Initialize threat detectors
    tor_detector = TorDetector()
    metasploit_detector = MetasploitDetector()
    cobalt_detector = CobaltStrikeDetector()

    for pkt in packets:
        tor_detector.detect(pkt)
        metasploit_detector.detect(pkt)
        cobalt_detector.detect(pkt)

    return {
        "tor_traffic": {
            "detected": tor_detector.get_tor_packet_count() > 0,
            "packet_count": tor_detector.get_tor_packet_count()
        },
        "metasploit": {
            "detected": metasploit_detector.get_metasploit_packet_count() > 0,
            "packet_count": metasploit_detector.get_metasploit_packet_count()
        },
        "cobalt_strike": {
            "detected": cobalt_detector.get_cobalt_packet_count() > 0,
            "packet_count": cobalt_detector.get_cobalt_packet_count()
        }
    }
