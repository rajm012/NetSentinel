from typing import Optional, Set

class DeviceFingerprinter:
    def __init__(self):
        """Initialize device fingerprinter"""
        self.device_types: Set[str] = set()

    def fingerprint(self, mac_address: str) -> Optional[str]:
        """
        Fingerprint device based on MAC address.
        
        Args:
            mac_address: MAC address to analyze
            
        Returns:
            Device type if recognized, None otherwise
        """
        if not mac_address:
            return None

        device_type = "Unknown Device"
        if mac_address.startswith("00:1A:79"):
            device_type = "Cisco Device"
        elif mac_address.startswith("3C:5A:B4"):
            device_type = "TP-Link"
            
        self.device_types.add(device_type)
        return device_type

    def get_all_device_types(self) -> Set[str]:
        """Get all unique device types detected"""
        return self.device_types

    def reset(self):
        """Reset collected device types"""
        self.device_types = set()
        