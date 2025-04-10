from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json, yaml, os

from backend.config import thresholds as global_thresholds
from backend.config.settings import RULE_PATH

router = APIRouter()

class ThresholdUpdate(BaseModel):
    key: str
    value: int

@router.get("/thresholds")
def get_thresholds():
    return global_thresholds.THRESHOLDS

@router.post("/thresholds/update")
def update_threshold(update: ThresholdUpdate):
    if update.key not in global_thresholds.THRESHOLDS:
        raise HTTPException(status_code=404, detail="Threshold key not found.")
    global_thresholds.THRESHOLDS[update.key] = update.value
    return {"message": f"Threshold for {update.key} updated to {update.value}"}

@router.get("/rule/{rule_file}")
def get_rule(rule_file: str):
    full_path_yaml = os.path.join(RULE_PATH, f"{rule_file}.yaml")
    full_path_json = os.path.join(RULE_PATH, f"{rule_file}.json")

    if os.path.exists(full_path_yaml):
        with open(full_path_yaml) as f:
            return yaml.safe_load(f)
    elif os.path.exists(full_path_json):
        with open(full_path_json) as f:
            return json.load(f)
    else:
        raise HTTPException(status_code=404, detail="Rule file not found.")
