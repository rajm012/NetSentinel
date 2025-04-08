from scapy.layers.dns import DNS, DNSQR

def detect_dns_tunneling(packet):
    if not packet.haslayer(DNS) or packet[DNS].qr != 0:
        return False, None

    query = packet[DNSQR].qname.decode()
    if len(query.split(".")) > 5 and len(query) > 50:
        return True, query

    return False, None
