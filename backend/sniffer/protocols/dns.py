# sniffer/protocols/dns.py
from scapy.layers.dns import DNS

def parse(packet):
    if packet.haslayer(DNS):
        dns_layer = packet[DNS]
        try:
            query = dns_layer.qd.qname.decode('utf-8', 'ignore') if dns_layer.qd else None
            return {
                "protocol": "DNS",
                "query": query,
                "id": dns_layer.id,
                "qr": dns_layer.qr,
                "opcode": dns_layer.opcode,
                "aa": dns_layer.aa,
                "tc": dns_layer.tc,
                "rd": dns_layer.rd,
                "ra": dns_layer.ra,
                "z": dns_layer.z,
                "rcode": dns_layer.rcode
            }
        except AttributeError:
            return {
                "protocol": "DNS",
                "error": "Failed to parse DNS packet"
            }
    return None

