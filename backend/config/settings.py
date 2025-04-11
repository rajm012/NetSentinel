"""
Application configuration settings with validation.
"""

from pathlib import Path
from pydantic import field_validator
from pydantic_settings import BaseSettings

class AppSettings(BaseSettings):
    LOG_FILE: str = "logs/sniffer.log"
    DEFAULT_INTERFACE: str = "Wi-Fi"
    PCAP_SAVE_PATH: str = "captures/"
    ANOMALY_LOG_FILE: str = "logs/anomalies.json"
    RULE_PATH: str = "backend/config/detection_rules/"
    
    @field_validator('*')
    @classmethod
    def ensure_path_exists(cls, v: str) -> str:
        if any(v.endswith(ext) for ext in ('_PATH', '_FILE')):
            path = Path(v)
            if not path.parent.exists():
                path.parent.mkdir(parents=True, exist_ok=True)
        return v

# Initialize settings
settings = AppSettings()
