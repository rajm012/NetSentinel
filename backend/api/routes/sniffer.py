from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from backend.sniffer import Sniffer, OfflineAnalyzer
from backend.sniffer.adapters.pcap_adapter import read_pcap
from backend.sniffer.adapters.tshark_adapter import parse_with_tshark

import tempfile
import threading

router = APIRouter()

# --- Models ---
class SnifferConfig(BaseModel):
    iface: str
    filters: list[str] = []

# --- API Endpoints ---

@router.get("/status")
def sniffer_status():
    return {"status": "Sniffer module ready", "live": True, "offline": True}

@router.post("/start-live")
def start_live_sniffer(config: SnifferConfig):
    sniffer = Sniffer(iface=config.iface, filters=config.filters)
    thread = threading.Thread(target=sniffer.start, daemon=True)
    thread.start()
    return {"status": "Live sniffing started", "interface": config.iface, "filters": config.filters}

@router.post("/analyze-pcap")
async def analyze_pcap(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    analyzer = OfflineAnalyzer(tmp_path)
    analyzer.analyze()
    return {"status": "PCAP analysis completed", "filename": file.filename}

@router.post("/read-pcap")
async def read_pcap_file(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    packets = read_pcap(tmp_path)
    return {"packet_count": len(packets)}

@router.post("/tshark")
def tshark_stub(file_path: str = Form(...)):
    parse_with_tshark(file_path)
    return {"status": "TShark parsing stub triggered", "file": file_path}
