def detect_metasploit(packet):
    return b"metasploit" in bytes(packet).lower()
