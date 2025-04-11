
### 1. Setup in Postman
1. Base URL as `http://localhost:8000`

### 2. Endpoint Testing Guide

#### A. Anomaly Detection (`/api/detect/anomalies`)
- Method: POST
- URL: `/api/detect/anomalies`
- Headers:- `Content-Type: multipart/form-data`
- Body (form-data):
  - Key: `file` (type File), select a PCAP file
  - Key: `syn_threshold` (type Text), value: `100`
  - Key: `port_threshold` (type Text), value: `20`
  - Key: `dns_min_subdomains` (type Text), value: `5`
  - Key: `dns_min_length` (type Text), value: `50`

**Sample Response (200 OK):**
```json
{
    "syn_flood": {
        "detected_ips": ["192.168.1.1", "10.0.0.2"],
        "counts": {"192.168.1.1": 120, "10.0.0.2": 80},
        "threshold_exceeded": ["192.168.1.1"]
    },
    "port_scan": {
        "scanner_ips": ["192.168.1.5"],
        "ports_scanned": {"192.168.1.5": 25},
        "threshold_exceeded": ["192.168.1.5"]
    },
    "dns_tunneling": {
        "suspicious_queries": ["long.subdomain.chain.example.com"],
        "total_detected": 1
    },
    "arp_spoofing": {
        "ip_mac_mappings": {"192.168.1.1": "00:1a:79:xx:xx:xx"},
        "potential_spoofs": []
    }
}
```

#### B. Behavior Detection (`/api/detect/behavior`)
- Method: POST
- URL: `/api/detect/behavior`
- Headers:- `Content-Type: multipart/form-data`
- Body (form-data):
  - Key: `file` (type File), select a PCAP file
  - Key: `conn_limit` (type Text), value: `100`
  - Key: `window` (type Text), value: `10`
  - Key: `bw_threshold` (type Text), value: `1000000`
  - Key: `timing_threshold` (type Text), value: `0.001`

**Sample Response (200 OK):**
```json
{
    "timing_anomalies": {
        "total_detected": 15,
        "threshold": 0.001
    },
    "connection_rate": {
        "current_rate": 5,
        "limit": 100,
        "window": 10,
        "threshold_exceeded": false
    },
    "bandwidth": {
        "bytes_consumed": 524288,
        "threshold": 1000000,
        "threshold_exceeded": false
    }
}
```

#### C. Fingerprinting (`/api/detect/fingerprints`)
- Method: POST
- URL: `/api/detect/fingerprints`
- Headers:- `Content-Type: multipart/form-data`
- Body (form-data):- Key: `file` (type File), select a PCAP file

**Sample Response (200 OK):**
```json
{
    "tls_fingerprints": {
        "ja3_hashes": ["a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"],
        "total_unique": 1
    },
    "http_fingerprints": {
        "user_agents": ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)"],
        "total_unique": 1
    },
    "device_fingerprints": {
        "device_types": ["Cisco Device"],
        "total_unique": 1
    }
}
```

#### D. Threat Detection (`/api/detect/threats`)
- Method: POST
- URL: `/api/detect/threats`
- Headers:- `Content-Type: multipart/form-data`
- Body (form-data):- Key: `file` (type File), select a PCAP file

**Sample Response (200 OK):**
```json
{
    "tor_traffic": {
        "detected": true,
        "packet_count": 3
    },
    "metasploit": {
        "detected": false,
        "packet_count": 0
    },
    "cobalt_strike": {
        "detected": true,
        "packet_count": 2
    }
}
```

### Sample PCAP Files for Testing

You can find sample PCAP files with various attack patterns at:
- [Wireshark Sample Captures](https://wiki.wireshark.org/SampleCaptures)
- [Malware-Traffic-Analysis.net](https://www.malware-traffic-analysis.net/training-exercises.html)
- [NetResec Samples](https://www.netresec.com/?page=PcapFiles)
