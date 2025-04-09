# config/thresholds.py

THRESHOLDS = {
    "PORT_SCAN": 100,        # More than 100 connections in short time
    "ARP_SPOOF": 5,          # Suspicious ARP replies
    "DNS_TUNNELING": 10,     # Long domains
    "BANDWIDTH": 1000000,    # Bytes per second
}
