def fingerprint_device(mac_address):
    if mac_address.startswith("00:1A:79"):
        return "Cisco Device"
    elif mac_address.startswith("3C:5A:B4"):
        return "TP-Link"
    return "Unknown Device"
