from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from scapy.all import rdpcap
from processing.statistics import TrafficStats
from processing.flow_analyzer import FlowAnalyzer
from processing.normalizer import FeatureNormalizer
from processing.geoip import lookup, load_geoip_reader

import tempfile
import json

router = APIRouter()

# --- Models ---
class GeoIPInput(BaseModel):
    ip: str
    db_path: str | None = None

class NormalizationRequest(BaseModel):
    data: list[list[float]]  # 2D list of floats

# --- Endpoints ---

@router.post("/upload-pcap/statistics")
async def analyze_traffic_stats(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        packets = rdpcap(tmp.name)

    stats = TrafficStats()
    for pkt in packets:
        stats.update(pkt)

    return {"stats_summary": stats.summary()}


@router.post("/upload-pcap/flows")
async def analyze_flows(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        packets = rdpcap(tmp.name)

    analyzer = FlowAnalyzer()
    for pkt in packets:
        analyzer.process_packet(pkt)

    serialized_flows = {
        str(key): times for key, times in analyzer.get_active_flows().items()
    }

    return {"flows": serialized_flows}


@router.post("/geoip/lookup")
def geoip_lookup(data: GeoIPInput):
    # Load DB if custom path provided
    if data.db_path:
        load_geoip_reader(data.db_path)

    result = lookup(data.ip)
    return {"geoip_result": result}


@router.post("/normalize/fit-transform")
def normalize_fit_transform(req: NormalizationRequest):
    normalizer = FeatureNormalizer()
    scaled = normalizer.fit_transform(req.data)
    return {"normalized": scaled.tolist()}


@router.post("/normalize/transform")
def normalize_transform(req: NormalizationRequest):
    normalizer = FeatureNormalizer()  # Should be saved/reused in production
    transformed = normalizer.transform(req.data)
    return {"transformed": transformed.tolist()}
