# utils/helpers.py
import datetime
import json
import os
from pathlib import Path

def format_timestamp(ts=None):
    """Format timestamp (current time if None provided)"""
    return datetime.datetime.now().isoformat() if ts is None else datetime.datetime.fromtimestamp(ts).isoformat()

def log_alert(alert):
    """Log security alerts with automatic file/directory creation and dummy data"""
    from config.settings import ANOMALY_LOG_FILE
    
    try:
        # Convert to Path object and ensure directory exists
        log_path = Path(ANOMALY_LOG_FILE)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Initialize with dummy data if file doesn't exist or is empty/corrupt
        if not log_path.exists() or log_path.stat().st_size == 0:
            dummy_data = [
                {
                    "type": "SAMPLE_ALERT",
                    "timestamp": format_timestamp(),
                    "message": "This is a sample alert entry",
                    "severity": "low"
                },
                {
                    "type": "TEST_ENTRY",
                    "timestamp": format_timestamp(),
                    "message": "System initialized",
                    "severity": "info"
                }
            ]
            with open(log_path, 'w') as f:
                json.dump(dummy_data, f, indent=4)
            return  # Skip adding the new alert to dummy data
        
        # Normal operation - read, update, write
        with open(log_path, 'r+') as f:
            try:
                data = json.load(f)
                data.append(alert)
                f.seek(0)
                json.dump(data, f, indent=4)
            except json.JSONDecodeError:
                # If file is corrupted, overwrite with just the new alert
                json.dump([alert], f, indent=4)
                
    except Exception as e:
        print(f"[ALERT LOGGING ERROR] {str(e)}")