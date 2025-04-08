from scapy.layers.l2 import ARP

def detect_arp_spoof(packet):
    if not packet.haslayer(ARP):
        return False, None
    if packet[ARP].op != 2:
        return False, None  # Not a reply

    ip = packet[ARP].psrc
    mac = packet[ARP].hwsrc

    if not hasattr(detect_arp_spoof, "ip_mac_table"):
        detect_arp_spoof.ip_mac_table = {}

    if ip in detect_arp_spoof.ip_mac_table:
        if detect_arp_spoof.ip_mac_table[ip] != mac:
            return True, ip  # IP mapped to multiple MACs
    else:
        detect_arp_spoof.ip_mac_table[ip] = mac

    return False, None
