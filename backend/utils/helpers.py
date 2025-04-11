# backend/utils/helpers.py
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any
import logging

logger = logging.getLogger("smartsniffer")

ANOMALY_LOG_FILE: str = "logs/anomalies.json"

def format_timestamp(ts=None) -> str:
    """Format timestamp (current time if None provided)"""
    return datetime.now().isoformat() if ts is None else datetime.fromtimestamp(ts).isoformat()

def log_alert(alert: Dict[str, Any]) -> bool:
    """
    Log security alerts with automatic file/directory creation
    
    Args:
        alert: Dictionary containing alert details
        
    Returns:
        bool: True if alert was logged successfully, False otherwise
    """    
    try:
        log_path = Path(ANOMALY_LOG_FILE)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        alerts = []
        
        # Load existing alerts if file exists and is valid
        if log_path.exists() and log_path.stat().st_size > 0:
            try:
                with open(log_path, 'r') as f:
                    alerts = json.load(f)
                    if not isinstance(alerts, list):
                        alerts = []
            except json.JSONDecodeError:
                alerts = []
                logger.warning("Alert log file was corrupted - resetting")
        
        # Add timestamp if not provided
        if 'timestamp' not in alert:
            alert['timestamp'] = format_timestamp()
            
        # Add the new alert
        alerts.append(alert)
        
        # Write back to file
        with open(log_path, 'w') as f:
            json.dump(alerts, f, indent=4)
            
        return True
        
    except Exception as e:
        logger.error(f"Failed to log alert: {str(e)}", exc_info=True)
        return False
    