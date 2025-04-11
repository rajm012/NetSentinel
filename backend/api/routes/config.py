from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import yaml
import os
from pathlib import Path

from backend.config import thresholds
from backend.config.settings import settings as app_settings

router = APIRouter(
    prefix="",
    tags=["Configuration"],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Resource not found"},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"description": "Validation error"},
    }
)

class ThresholdUpdate(BaseModel):
    key: str
    value: int

class RuleFileResponse(BaseModel):
    name: str
    type: str
    content: Dict[str, Any]

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

@router.get("/settings", response_model=Dict[str, str])
def get_application_settings():
    """Get current application settings"""
    return app_settings.dict()

