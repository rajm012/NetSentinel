from scapy.layers.tls.all import TLS, TLSClientHello
import hashlib

def ja3_fingerprint(packet):
    if not packet.haslayer(TLSClientHello):
        return None

    try:
        hello = packet[TLSClientHello]
        ciphers = "-".join(map(str, hello.ciphers))
        extensions = "-".join(str(e.ext_type) for e in hello.ext)
        ja3_str = f"{hello.version},{ciphers},{extensions},0,0"
        return hashlib.md5(ja3_str.encode()).hexdigest()
    except:
        return None
