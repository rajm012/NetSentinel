# test_sniffer_live.py

from sniffer.core import Sniffer

if __name__ == "__main__":
    # Initialize with a common interface, e.g., "Wi-Fi" on Windows or "wlan0"/"eth0" on Linux
    iface = "Wi-Fi"  # change as per your OS, use `scapy.all.get_if_list()` to list interfaces
    filters = ["tcp", "udp", "dns", "icmp"]

    sniffer = Sniffer(iface=iface, filters=filters)
    sniffer.start()





# (zenv) PS E:\4th Semester\Packet Sniffer\backend> python test_sniffer_live.py
# [🔍] Starting live sniffing on interface: Wi-Fi
# [DNS] Query: mobile.events.data.microsoft.com.
# [DNS] Query: mobile.events.data.microsoft.com.
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21970
# [DNS] Query: _companion-link._tcp.local.
# [DNS] Query: _companion-link._tcp.local.
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21894
# [TCP] Src Port: 21894, Dst Port: 443
# [TCP] Src Port: 21894, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21894
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 21970, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21970
# [TCP] Src Port: 443, Dst Port: 21970
# [HTTP] Payload: M-SEARCH * HTTP/1.1
# HOST: 239.255.255.250:1900
# MAN: "ssdp:discover"
# MX: 5
# ST: upnp:rootdevice

# [HTTP] Payload: M-SEARCH * HTTP/1.1
# HOST: 239.255.255.250:1900
# MAN: "ssdp:discover"
# MX: 1
# ST: urn:dial-multiscre
# [TCP] Src Port: 443, Dst Port: 21905
# [TCP] Src Port: 443, Dst Port: 21905
# [TCP] Src Port: 443, Dst Port: 21905
# [TCP] Src Port: 21905, Dst Port: 443
# [TCP] Src Port: 21905, Dst Port: 443
# [TCP] Src Port: 21905, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21905
# [HTTP] Payload: M-SEARCH * HTTP/1.1
# HOST: 239.255.255.250:1900
# MAN: "ssdp:discover"
# MX: 1
# ST: urn:dial-multiscre
# [TCP] Src Port: 21893, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21893
# [DNS] Query: _companion-link._tcp.local.
# [DNS] Query: _companion-link._tcp.local.
# [TCP] Src Port: 21892, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21892
# [HTTP] Payload: M-SEARCH * HTTP/1.1
# HOST: 239.255.255.250:1900
# MAN: "ssdp:discover"
# MX: 1
# ST: urn:dial-multiscre
# [TCP] Src Port: 443, Dst Port: 21916
# [TCP] Src Port: 443, Dst Port: 21916
# [TCP] Src Port: 443, Dst Port: 21916
# [TCP] Src Port: 443, Dst Port: 21916
# [TCP] Src Port: 21916, Dst Port: 443
# [TCP] Src Port: 21916, Dst Port: 443
# [TCP] Src Port: 21916, Dst Port: 443
# [TCP] Src Port: 21916, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21916
# [TCP] Src Port: 443, Dst Port: 21916
# [TCP] Src Port: 443, Dst Port: 21924
# [TCP] Src Port: 443, Dst Port: 21924
# [TCP] Src Port: 443, Dst Port: 21924
# [TCP] Src Port: 443, Dst Port: 21924
# [TCP] Src Port: 21924, Dst Port: 443
# [TCP] Src Port: 21924, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21924
# [DNS] Query: _googlecast._tcp.local.
# [DNS] Query: _googlecast._tcp.local.
# [DNS] Query: _googlecast._tcp.local.
# [DNS] Query: _googlecast._tcp.local.
# [HTTP] Payload: M-SEARCH * HTTP/1.1
# HOST: 239.255.255.250:1900
# MAN: "ssdp:discover"
# MX: 1
# ST: urn:dial-multiscre
# [DNS] Query: _googlecast._tcp.local.
# [DNS] Query: _googlecast._tcp.local.
# [DNS] Query: _googlecast._tcp.local.
# [DNS] Query: _googlecast._tcp.local.
# WARNING: Socket <scapy.arch.libpcap.L2pcapListenSocket object at 0x00000156DAF01BD0> failed with 'list index out of range'. It was closed.
