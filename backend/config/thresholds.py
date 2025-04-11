"""
Threshold configuration for various detection mechanisms.
"""

from typing import Dict, Any
from pydantic import BaseModel, field_validator

class ThresholdSettings(BaseModel):
    PORT_SCAN: int = 100        # More than 100 connections in short time
    ARP_SPOOF: int = 5          # Suspicious ARP replies
    DNS_TUNNELING: int = 10     # Long domains
    BANDWIDTH: int = 1000000    # Bytes per second

    @field_validator('*')
    @classmethod
    def validate_thresholds(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Threshold cannot be negative")
        return v

# Initialize with default values
THRESHOLDS = ThresholdSettings().model_dump()

def update_threshold(key: str, value: int) -> Dict[str, Any]:
    """Update a threshold value with validation."""
    if key not in THRESHOLDS:
        raise KeyError(f"Invalid threshold key: {key}")
    
    # Validate the new value
    try:
        ThresholdSettings(**{**THRESHOLDS, key: value})
    except ValueError as e:
        raise ValueError(f"Invalid value for {key}: {str(e)}")
    
    THRESHOLDS[key] = value
    return {"status": "success", "updated": {key: value}}
