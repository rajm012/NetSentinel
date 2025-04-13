# backend/api/routes/sniffer.py
from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
# from backend.sniffer.adapters.pcap_adapter import read_pcap
import tempfile
import os, time
import uuid, sys

router = APIRouter()

# Store active sniffers
active_sniffers = {}

class SnifferConfig(BaseModel):
    iface: str
    filters: List[str] = []
    name: Optional[str] = None

class SnifferResponse(BaseModel):
    id: str
    status: str
    interface: str
    filters: List[str]
    name: Optional[str] = None

class SnifferStatusResponse(BaseModel):
    id: str
    running: bool
    packet_count: int
    interface: str
    filters: List[str]
    name: Optional[str] = None

class SnifferResultsResponse(BaseModel):
    id: str
    results: List[Dict[str, Any]]
    more_available: bool
    total_count: int

@router.get("/status")
def sniffer_status():
    """Get the status of the sniffer module"""
    return {
        "status": "Sniffer module ready",
        "live": True,
        "offline": True,
        "active_sniffers": len(active_sniffers)
    }

@router.post("/start-live", response_model=SnifferResponse)
def start_live_sniffer(config: SnifferConfig):
    from backend.sniffer import Sniffer
    """Start a live sniffer with the given configuration"""
    sniffer_id = str(uuid.uuid4())
    sniffer = Sniffer(iface=config.iface, filters=config.filters)
    
    if not sniffer.start():
        raise HTTPException(status_code=400, detail="Failed to start sniffer. It may already be running.")
    
    # Store the sniffer instance
    active_sniffers[sniffer_id] = {
        "sniffer": sniffer,
        "config": config.dict(),
        "id": sniffer_id
    }
    
    return {
        "id": sniffer_id,
        "status": "Live sniffing started",
        "interface": config.iface,
        "filters": config.filters,
        "name": config.name
    }

@router.get("/live/{sniffer_id}/status", response_model=SnifferStatusResponse)
def get_live_sniffer_status(sniffer_id: str):
    """Get the status of a specific sniffer"""
    if sniffer_id not in active_sniffers:
        raise HTTPException(status_code=404, detail="Sniffer not found")
    
    sniffer = active_sniffers[sniffer_id]["sniffer"]
    config = active_sniffers[sniffer_id]["config"]
    stats = sniffer.get_stats()
    
    return {
        "id": sniffer_id,
        "running": stats["running"],
        "packet_count": stats["packet_count"],
        "interface": stats["interface"],
        "filters": stats["filters"],
        "name": config.get("name")
    }

# Modify this function in backend/api/routes/sniffer.py
@router.get("/live/{sniffer_id}/results", response_model=SnifferResultsResponse)
def get_live_sniffer_results(
    sniffer_id: str, 
    limit: int = Query(100, ge=1, le=1000),
    clear: bool = Query(False),
    since_timestamp: Optional[float] = Query(None, description="Only return results after this timestamp")
):
    """Get the results from a specific sniffer"""
    if sniffer_id not in active_sniffers:
        raise HTTPException(status_code=404, detail="Sniffer not found")
    
    sniffer = active_sniffers[sniffer_id]["sniffer"]
    
    # Modify sniffer.get_results to accept a timestamp parameter
    results = sniffer.get_results(limit=limit, clear=clear, since_timestamp=since_timestamp)
    stats = sniffer.get_stats()
    
    # Add timestamp to response
    current_timestamp = time.time()
    
    return {
        "id": sniffer_id,
        "results": results,
        "more_available": len(results) == limit,
        "total_count": stats["packet_count"],
        "timestamp": current_timestamp
    }


@router.post("/live/{sniffer_id}/stop")
def stop_live_sniffer(sniffer_id: str):
    """Stop a specific sniffer"""
    if sniffer_id not in active_sniffers:
        raise HTTPException(status_code=404, detail="Sniffer not found")
    
    sniffer = active_sniffers[sniffer_id]["sniffer"]
    if not sniffer.stop():
        raise HTTPException(status_code=400, detail="Failed to stop sniffer. It may not be running.")
    
    # Keep the sniffer in the list to access results
    return {
        "id": sniffer_id,
        "status": "Sniffer stopped",
        "packet_count": sniffer.get_stats()["packet_count"]
    }

@router.delete("/live/{sniffer_id}")
def delete_live_sniffer(sniffer_id: str):
    """Delete a specific sniffer and its results"""
    if sniffer_id not in active_sniffers:
        raise HTTPException(status_code=404, detail="Sniffer not found")
    
    sniffer = active_sniffers[sniffer_id]["sniffer"]
    sniffer.stop()  # Make sure it's stopped
    
    # Remove from active sniffers
    del active_sniffers[sniffer_id]
    
    return {
        "id": sniffer_id,
        "status": "Sniffer deleted"
    }

@router.get("/live")
def list_active_sniffers():
    """List all active sniffers"""
    result = []
    for sniffer_id, data in active_sniffers.items():
        sniffer = data["sniffer"]
        config = data["config"]
        stats = sniffer.get_stats()
        
        result.append({
            "id": sniffer_id,
            "running": stats["running"],
            "packet_count": stats["packet_count"],
            "interface": stats["interface"],
            "filters": stats["filters"],
            "name": config.get("name")
        })
    
    return {"sniffers": result, "count": len(result)}

# Store active analyzers for PCAP files
active_analyzers = {}

@router.post("/analyze-pcap")
async def analyze_pcap(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    name: str = Form(None)
):
    """Upload and analyze a PCAP file"""
    # Create a temporary file
    from backend.sniffer import OfflineAnalyzer
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name
    
    # Create an analyzer ID
    analyzer_id = str(uuid.uuid4())
    
    # Create and store the analyzer
    analyzer = OfflineAnalyzer(tmp_path)
    active_analyzers[analyzer_id] = {
        "analyzer": analyzer,
        "file_path": tmp_path,
        "original_filename": file.filename,
        "name": name or file.filename,
        "status": "processing"
    }
    
    # Start analysis in background
    background_tasks.add_task(run_analysis, analyzer_id)
    
    return {
        "id": analyzer_id,
        "status": "PCAP analysis started",
        "filename": file.filename,
        "name": name
    }

def run_analysis(analyzer_id):
    """Run analysis in background"""
    analyzer = active_analyzers[analyzer_id]["analyzer"]
    summary = analyzer.analyze()
    active_analyzers[analyzer_id]["status"] = "completed"
    active_analyzers[analyzer_id]["summary"] = summary

@router.get("/pcap/{analyzer_id}/status")
def get_pcap_analysis_status(analyzer_id: str):
    """Get the status of a PCAP analysis"""
    if analyzer_id not in active_analyzers:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    data = active_analyzers[analyzer_id]
    
    return {
        "id": analyzer_id,
        "status": data["status"],
        "filename": data["original_filename"],
        "name": data["name"]
    }

@router.get("/pcap/{analyzer_id}/results")
def get_pcap_analysis_results(
    analyzer_id: str,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Get the results of a PCAP analysis"""
    if analyzer_id not in active_analyzers:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    data = active_analyzers[analyzer_id]
    
    if data["status"] != "completed":
        raise HTTPException(status_code=400, detail="Analysis not yet completed")
    
    analyzer = data["analyzer"]
    results = analyzer.get_results(limit=limit, offset=offset)
    
    return {
        "id": analyzer_id,
        "results": results,
        "more_available": len(results) == limit,
        "offset": offset,
        "limit": limit,
        "total_count": analyzer.packet_count
    }

@router.get("/pcap/{analyzer_id}/summary")
def get_pcap_analysis_summary(analyzer_id: str):
    """Get the summary of a PCAP analysis"""
    if analyzer_id not in active_analyzers:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    data = active_analyzers[analyzer_id]
    
    if data["status"] != "completed":
        raise HTTPException(status_code=400, detail="Analysis not yet completed")
    
    return data["summary"]

@router.delete("/pcap/{analyzer_id}")
def delete_pcap_analysis(analyzer_id: str):
    """Delete a PCAP analysis and its results"""
    if analyzer_id not in active_analyzers:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    data = active_analyzers[analyzer_id]
    
    # Delete the temporary file
    try:
        if os.path.exists(data["file_path"]):
            os.unlink(data["file_path"])
    except Exception:
        pass
    
    # Remove from active analyzers
    del active_analyzers[analyzer_id]
    
    return {
        "id": analyzer_id,
        "status": "Analysis deleted"
    }

@router.post("/tshark")
async def tshark_parser(file: UploadFile = File(...)):
    from backend.sniffer.adapters.tshark_adapter import parse_with_tshark
    """Parse a PCAP file with TShark"""
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name
    
    # Parse with TShark
    results = parse_with_tshark(tmp_path)
    
    # Delete the temporary file
    try:
        os.unlink(tmp_path)
    except Exception:
        pass
    
    return results

# ---------------------------------------------------------------------

import logging as lg
import platform
import sys
from psutil import net_if_addrs

# Configure the logger
logger = lg.getLogger("network_logger")
logger.setLevel(lg.DEBUG)
handler = lg.StreamHandler()
formatter = lg.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

@router.get("/interface")
def get_network_interface_details():
    """List detailed network interface info"""
    try:
        interfaces_info = {}
        interfaces = net_if_addrs()

        for interface_name, addresses in interfaces.items():
            iface_details = []
            for address in addresses:
                iface_details.append({
                    "address": address.address,
                    "family": str(address.family),
                    "netmask": address.netmask,
                    "broadcast": address.broadcast
                })
            interfaces_info[interface_name] = iface_details

        return {"interfaces": interfaces_info}

    except Exception as e:
        logger.error(f"Error retrieving interface details: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not retrieve interface details")

    

"""
{
    "interfaces": {
        "Local Area Connection* 1": [
            {
                "address": "BA-1E-A4-8E-D3-F5",
                "family": "-1",
                "netmask": null,
                "broadcast": null
            },
            {
                "address": "169.254.173.245",
                "family": "2",
                "netmask": "255.255.0.0",
                "broadcast": null
            },
            {
                "address": "fe80::eb07:cb3c:2558:8727",
                "family": "23",
                "netmask": null,
                "broadcast": null
            }
        ],
        "Local Area Connection* 2": [
            {
                "address": "FA-1E-A4-8E-D3-F5",
                "family": "-1",
                "netmask": null,
                "broadcast": null
            },
            {
                "address": "169.254.138.47",
                "family": "2",
                "netmask": "255.255.0.0",
                "broadcast": null
            },
            {
                "address": "fe80::240a:8c0f:8f57:b83f",
                "family": "23",
                "netmask": null,
                "broadcast": null
            }
        ],
        "Wi-Fi": [
            {
                "address": "B8-1E-A4-8E-D3-2C",
                "family": "-1",
                "netmask": null,
                "broadcast": null
            },
            {
                "address": "172.18.34.244",
                "family": "2",
                "netmask": "255.255.252.0",
                "broadcast": null
            },
            {
                "address": "fe80::bf62:d9d4:45f1:38ab",
                "family": "23",
                "netmask": null,
                "broadcast": null
            }
        ],
        "Ethernet": [
            {
                "address": "08-8F-C3-E0-38-3C",
                "family": "-1",
                "netmask": null,
                "broadcast": null
            },
            {
                "address": "169.254.92.133",
                "family": "2",
                "netmask": "255.255.0.0",
                "broadcast": null
            },
            {
                "address": "fe80::fc0b:f7f7:1f1:eb2d",
                "family": "23",
                "netmask": null,
                "broadcast": null
            }
        ],
        "Loopback Pseudo-Interface 1": [
            {
                "address": "127.0.0.1",
                "family": "2",
                "netmask": "255.0.0.0",
                "broadcast": null
            },
            {
                "address": "::1",
                "family": "23",
                "netmask": null,
                "broadcast": null
            }
        ]
    }
}
"""

# ============================================================================
from fastapi import Query

lg = lg.getLogger("network_logger")

def packet_to_dict(pkt):
    from datetime import datetime
    return {
        "time": datetime.fromtimestamp(pkt.time).isoformat(),
        "summary": pkt.summary()
    }


@router.get("/start-fetch")
def start_fetch_packets(
    iface: str = Query(..., description="Interface to sniff on"),
    duration: int = Query(10, ge=1, le=30, description="Duration in seconds to sniff")
):
    """
    Capture live packets from a given interface for the last `duration` seconds.
    """
    from scapy.all import sniff
    try:
        lg.info(f"Sniffing packets on interface: {iface} for {duration} seconds")
        packets = sniff(iface=iface, timeout=duration)
        parsed_packets = [packet_to_dict(pkt) for pkt in packets]

        return {
            "interface": iface,
            "duration": duration,
            "packet_count": len(parsed_packets),
            "packets": parsed_packets
        }

    except Exception as e:
        lg.error(f"Error during sniffing: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
