from fastapi import APIRouter, HTTPException, status, Body, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import yaml
import os
from pathlib import Path
import netifaces
import smtplib
import httpx
from datetime import datetime
from email.mime.text import MIMEText
from backend.config import thresholds

router = APIRouter(
    prefix="",
    tags=["Configuration"],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Resource not found"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"description": "Validation error"},
    }
)

# Models
class ThresholdUpdate(BaseModel):
    key: str
    value: int

class RuleFileResponse(BaseModel):
    name: str
    type: str
    content: Dict[str, Any]

class RuleUpdateRequest(BaseModel):
    config: Dict[str, Any]

class LoggingSettings(BaseModel):
    level: str
    file: str
    max_size: int
    backup_count: int
    console_output: bool

class EmailAlertConfig(BaseModel):
    enabled: bool
    smtp_server: str
    smtp_port: int
    use_tls: bool
    username: str
    password: str
    from_address: str
    to_addresses: List[str]

class WebhookConfig(BaseModel):
    enabled: bool
    url: str
    headers: Dict[str, str]

class AlertSettings(BaseModel):
    email: EmailAlertConfig
    webhook: WebhookConfig
    severity_threshold: str

class CaptureSettings(BaseModel):
    interface: str
    promiscuous: bool
    buffer_size: int
    snapshot_length: int
    timeout: int

class NetworkInterface(BaseModel):
    name: str
    ipv4: Optional[str]
    active: bool

# Existing Routes
@router.get("/thresholds", response_model=Dict[str, int])
def get_thresholds():
    """Get all detection thresholds"""
    return thresholds.THRESHOLDS

@router.post("/thresholds/update", response_model=Dict[str, Any])
def update_threshold(update: ThresholdUpdate):
    """Update a specific threshold value"""
    try:
        result = thresholds.update_threshold(update.key, update.value)
        return result
    except KeyError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )

@router.get("/rules", response_model=List[str])
def list_available_rules():
    """List all available rule files"""
    from backend.config.settings import settings as app_settings
    try:
        rule_path = Path(app_settings.RULE_PATH)
        
        # Debugging output
        print(f"Looking for rules in: {rule_path.absolute()}")
        
        if not rule_path.exists():
            # Try relative path if absolute doesn't work
            rule_path = Path("backend") / app_settings.RULE_PATH
            print(f"Trying alternative path: {rule_path.absolute()}")
            
            if not rule_path.exists():
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Rule directory not found at: {app_settings.RULE_PATH}"
                )
        
        rule_files = []
        for file in rule_path.iterdir():
            if file.suffix.lower() in ('.yaml', '.yml', '.json'):
                rule_files.append(file.stem)
        
        if not rule_files:
            print(f"No rule files found in: {rule_path}")
            return []
        
        return sorted(list(set(rule_files)))
    
    except Exception as e:
        print(f"Error listing rules: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error accessing rule directory: {str(e)}"
        )

@router.get("/rules/{rule_name}", response_model=RuleFileResponse)
def get_rule(rule_name: str):
    """Get a specific rule configuration"""
    from backend.config.settings import settings as app_settings
    rule_path = Path(app_settings.RULE_PATH)
    possible_files = [
        rule_path / f"{rule_name}.yaml",
        rule_path / f"{rule_name}.yml",
        rule_path / f"{rule_name}.json"
    ]
    
    for file_path in possible_files:
        if file_path.exists():
            try:
                with open(file_path) as f:
                    if file_path.suffix == '.json':
                        content = json.load(f)
                    else:
                        content = yaml.safe_load(f)
                    
                    return {
                        "name": rule_name,
                        "type": file_path.suffix[1:],
                        "content": content
                    }
            except (json.JSONDecodeError, yaml.YAMLError) as e:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Error parsing rule file: {str(e)}"
                )
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"No rule found with name '{rule_name}'"
    )

@router.get("/settings", response_model=Dict[str, Any])
def get_application_settings():
    """Get current application settings"""
    from backend.config.settings import settings as app_settings
    
    # Convert the settings to a more complete format matching frontend expectations
    settings_dict = app_settings.dict()
    
    # Add sections that might not be in the original settings
    if "logging" not in settings_dict:
        settings_dict["logging"] = {
            "level": "INFO",
            "file": "logs/sniffer.log",
            "max_size": 10,
            "backup_count": 5,
            "console_output": True
        }
    
    if "alerts" not in settings_dict:
        settings_dict["alerts"] = {
            "email": {
                "enabled": False,
                "smtp_server": "smtp.example.com",
                "smtp_port": 587,
                "use_tls": True,
                "username": "",
                "password": "",
                "from_address": "alerts@example.com",
                "to_addresses": ["admin@example.com"]
            },
            "webhook": {
                "enabled": False,
                "url": "https://hooks.example.com/webhook",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": ""
                }
            },
            "severity_threshold": "MEDIUM"
        }
    
    if "capture" not in settings_dict:
        settings_dict["capture"] = {
            "interface": "eth0",
            "promiscuous": True,
            "buffer_size": 65536,
            "snapshot_length": 1518,
            "timeout": 1000
        }
    
    return settings_dict

# New Routes to Support Frontend API
@router.post("/rules/{rule_name}/update", response_model=Dict[str, str])
def update_rule_config(rule_name: str, config: Dict[str, Any] = Body(...)):
    """Update the configuration for a specific rule"""
    from backend.config.settings import settings as app_settings
    rule_path = Path(app_settings.RULE_PATH)
    
    # Find existing rule file or create new one with YAML
    possible_files = [
        rule_path / f"{rule_name}.yaml",
        rule_path / f"{rule_name}.yml",
        rule_path / f"{rule_name}.json"
    ]
    
    existing_file = None
    for file_path in possible_files:
        if file_path.exists():
            existing_file = file_path
            break
    
    # If no existing file, create new YAML file
    if existing_file is None:
        existing_file = rule_path / f"{rule_name}.yaml"
    
    try:
        # Write the updated configuration
        with open(existing_file, 'w') as f:
            if existing_file.suffix == '.json':
                json.dump(config, f, indent=2)
            else:
                yaml.dump(config, f, default_flow_style=False)
        
        return {
            "status": "success",
            "message": f"Rule {rule_name} updated successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update rule configuration: {str(e)}"
        )

@router.post("/settings/logging/update", response_model=Dict[str, str])
def update_logging_settings(settings: Dict[str, Any] = Body(...)):
    """Update logging settings"""
    from backend.config.settings import update_settings
    
    try:
        # Update logging settings in the app configuration
        update_settings({"logging": settings})
        
        return {
            "status": "success",
            "message": "Logging settings updated successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update logging settings: {str(e)}"
        )

@router.post("/settings/alerts/update", response_model=Dict[str, str])
def update_alert_settings(settings: Dict[str, Any] = Body(...)):
    """Update alert settings"""
    from backend.config.settings import update_settings
    
    try:
        # Update alert settings in the app configuration
        update_settings({"alerts": settings})
        
        return {
            "status": "success",
            "message": "Alert settings updated successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update alert settings: {str(e)}"
        )

@router.post("/settings/alerts/email/test", response_model=Dict[str, str])
def test_email_alert(email_config: Dict[str, Any] = Body(...)):
    """Test email alert configuration"""
    try:
        # Extract email configuration
        smtp_server = email_config.get('smtp_server')
        smtp_port = int(email_config.get('smtp_port', 587))
        use_tls = email_config.get('use_tls', True)
        username = email_config.get('username')
        password = email_config.get('password')
        from_address = email_config.get('from_address')
        to_address = email_config.get('to_addresses', [])[0] if email_config.get('to_addresses') else None
        
        if not all([smtp_server, smtp_port, from_address, to_address]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required email configuration"
            )
        
        # Create test email
        msg = MIMEText("This is a test email from your Network Traffic Analyzer.")
        msg['Subject'] = "Test Alert - Network Traffic Analyzer"
        msg['From'] = from_address
        msg['To'] = to_address
        
        # Send email
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            if use_tls:
                server.starttls()
            if username and password:
                server.login(username, password)
            server.send_message(msg)
            server.quit()
            
            return {
                "status": "success",
                "message": f"Test email sent successfully to {to_address}"
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to send email: {str(e)}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error testing email configuration: {str(e)}"
        )

@router.post("/settings/alerts/webhook/test", response_model=Dict[str, str])
async def test_webhook_alert(webhook_config: Dict[str, Any] = Body(...)):
    """Test webhook alert configuration"""
    try:
        # Extract webhook configuration
        webhook_url = webhook_config.get('url')
        headers = webhook_config.get('headers', {})
        
        if not webhook_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing webhook URL"
            )
        
        # Prepare test payload
        payload = {
            "test": True,
            "message": "This is a test alert from your Network Traffic Analyzer.",
            "severity": "INFO",
            "timestamp": str(datetime.now())
        }
        
        # Send webhook request
        async with httpx.AsyncClient() as client:
            response = await client.post(webhook_url, json=payload, headers=headers, timeout=10.0)
            
            if response.status_code >= 200 and response.status_code < 300:
                return {
                    "status": "success",
                    "message": f"Webhook test successful (Status code: {response.status_code})"
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Webhook returned error: {response.status_code}, Response: {response.text}"
                )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error testing webhook: {str(e)}"
        )

@router.get("/settings/capture/interfaces", response_model=List[NetworkInterface])
def get_network_interfaces():
    """Get all available network interfaces"""
    try:
        interfaces = []
        for iface in netifaces.interfaces():
            try:
                # Get interface info
                addresses = netifaces.ifaddresses(iface)
                if netifaces.AF_INET in addresses:
                    ipv4 = addresses[netifaces.AF_INET][0]['addr']
                    interfaces.append({
                        "name": iface,
                        "ipv4": ipv4,
                        "active": True  # Simplified - in a real app you'd check this
                    })
                else:
                    interfaces.append({
                        "name": iface,
                        "ipv4": None,
                        "active": False
                    })
            except:
                # Skip interfaces that raise errors
                pass
        
        return interfaces
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting network interfaces: {str(e)}"
        )

@router.post("/settings/capture/update", response_model=Dict[str, str])
def update_capture_settings(settings: Dict[str, Any] = Body(...)):
    """Update capture settings"""
    from backend.config.settings import update_settings
    
    try:
        # Update capture settings in the app configuration
        update_settings({"capture": settings})
        
        return {
            "status": "success",
            "message": "Capture settings updated successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update capture settings: {str(e)}"
        )
        