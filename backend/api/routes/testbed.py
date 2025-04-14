from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os
import uuid
import time
import json
import threading
import tempfile
from datetime import datetime
import random
from typing import Optional, Dict
from fastapi import BackgroundTasks, Query
import shutil

router = APIRouter()

# Models
class TrafficConfig(BaseModel):
    type: str
    protocols: Optional[Dict[str, bool]] = None
    includeMalicious: Optional[bool] = False
    duration: Optional[int] = 30

class JobStatus(BaseModel):
    status: str
    message: Optional[str] = None
    error: Optional[str] = None

# In-memory storage for test jobs
test_jobs = {}
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper functions (same as original)
def process_pcap_file(job_id: str, file_path: str):
    """Process a PCAP file and generate analysis results"""
    try:
        time.sleep(5)
        protocols = {'TCP': random.randint(50, 200), 
                     'UDP': random.randint(20, 100),
                     'HTTP': random.randint(10, 80),
                     'DNS': random.randint(5, 40),
                     'ICMP': random.randint(0, 15)}
        
        total_packets = sum(protocols.values())
        
        alerts = []
        alert_types = ['Port Scan', 'SQL Injection', 'Brute Force Attempt', 'Suspicious DNS', 'Malware Communication']
        alert_severities = ['low', 'medium', 'high']
        
        for _ in range(random.randint(0, 10)):
            alerts.append({
                'timestamp': (datetime.now().isoformat()),
                'severity': random.choice(alert_severities),
                'category': random.choice(alert_types),
                'description': f'Detected suspicious activity from {generate_random_ip()} to {generate_random_ip()}',
                'source': generate_random_ip(),
                'destination': generate_random_ip()
            })
        
        packet_summary = []
        for i in range(1, 21):
            packet_summary.append({
                'number': i,
                'time': f'{i * 0.1:.6f}',
                'source': generate_random_ip(),
                'destination': generate_random_ip(),
                'protocol': random.choice(list(protocols.keys())),
                'length': random.randint(60, 1500),
                'info': 'Packet information would be shown here',
                'flagged': random.random() < 0.2
            })
        
        results = {
            'status': 'completed',
            'alerts': alerts,
            'statistics': {
                'totalPackets': total_packets,
                'protocols': protocols,
                'duration': random.randint(10, 60)
            },
            'packetSummary': packet_summary
        }
        
        test_jobs[job_id]['status'] = 'completed'
        test_jobs[job_id]['results'] = results
        test_jobs[job_id]['completed'] = datetime.now().isoformat()
        
    except Exception as e:
        print(f"Error processing PCAP file: {e}")
        test_jobs[job_id]['status'] = 'failed'
        test_jobs[job_id]['error'] = str(e)

def generate_synthetic_traffic(job_id: str, config: TrafficConfig):
    """Generate synthetic traffic based on configuration"""
    try:
        time.sleep(3)
        
        traffic_type = config.type
        protocols = {}
        
        if traffic_type == 'custom':
            for proto, enabled in config.protocols.items():
                if enabled:
                    protocols[proto.upper()] = random.randint(20, 200)
        else:
            protocols = {'TCP': random.randint(50, 200), 
                        'UDP': random.randint(20, 100),
                        'HTTP': random.randint(10, 80),
                        'DNS': random.randint(5, 40),
                        'ICMP': random.randint(0, 15)}
        
        total_packets = sum(protocols.values())
        
        alerts = []
        if traffic_type == 'malicious' or (traffic_type == 'custom' and config.includeMalicious):
            alert_count = random.randint(5, 15)
            alert_types = ['Port Scan', 'SQL Injection', 'Brute Force Attempt', 'Suspicious DNS', 'Malware Communication']
            alert_severities = ['medium', 'high']
        else:
            alert_count = random.randint(0, 3)
            alert_types = ['Unusual Traffic Pattern', 'DNS Query', 'Connection Timeout', 'New Device']
            alert_severities = ['low', 'medium']
        
        for _ in range(alert_count):
            alerts.append({
                'timestamp': (datetime.now().isoformat()),
                'severity': random.choice(alert_severities),
                'category': random.choice(alert_types),
                'description': f'Detected activity from {generate_random_ip()} to {generate_random_ip()}',
                'source': generate_random_ip(),
                'destination': generate_random_ip()
            })
        
        packet_summary = []
        for i in range(1, 21):
            packet_summary.append({
                'number': i,
                'time': f'{i * 0.1:.6f}',
                'source': generate_random_ip(),
                'destination': generate_random_ip(),
                'protocol': random.choice(list(protocols.keys())),
                'length': random.randint(60, 1500),
                'info': 'Packet information would be shown here',
                'flagged': random.random() < 0.2
            })
        
        results = {
            'status': 'completed',
            'alerts': alerts,
            'statistics': {
                'totalPackets': total_packets,
                'protocols': protocols,
                'duration': config.duration
            },
            'packetSummary': packet_summary
        }
        
        test_jobs[job_id]['status'] = 'completed'
        test_jobs[job_id]['results'] = results
        test_jobs[job_id]['completed'] = datetime.now().isoformat()
        
    except Exception as e:
        print(f"Error generating traffic: {e}")
        test_jobs[job_id]['status'] = 'failed'
        test_jobs[job_id]['error'] = str(e)

def generate_random_ip():
    """Generate a random IP address"""
    return f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"


@router.post("/upload")
async def upload_pcap(file: UploadFile = File(...)):
    # Validate file extension
    if not file.filename.lower().endswith(('.pcap', '.pcapng')):
        raise HTTPException(
            status_code=400,
            detail="Only .pcap or .pcapng files are allowed"
        )

    try:
        # Create upload directory if it doesn't exist
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Save file to disk
        file_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}_{file.filename}")
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)  # Efficiently save the file

        # Create job entry
        job_id = str(uuid.uuid4())
        test_jobs[job_id] = {
            "id": job_id,
            "status": "processing",
            "file": file_path,
            "created": datetime.now().isoformat(),
            "results": None
        }

        # Process in background
        threading.Thread(target=process_pcap_file, args=(job_id, file_path)).start()

        return {"jobId": job_id, "message": "PCAP upload successful"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.post("/generate")
async def generate_traffic(config: TrafficConfig):
    try:
        job_id = str(uuid.uuid4())
        
        test_jobs[job_id] = {
            'id': job_id,
            'status': 'processing',
            'config': config.dict(),
            'created': datetime.now().isoformat(),
            'results': None
        }
        
        threading.Thread(target=generate_synthetic_traffic, args=(job_id, config)).start()
        
        return JSONResponse(content={
            'jobId': job_id,
            'message': 'Traffic generation started'
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error: {str(e)}')

@router.get("/results/{job_id}")
async def get_test_results(job_id: str):
    if job_id not in test_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = test_jobs[job_id]
    
    if job['status'] == 'processing':
        return JobStatus(status='processing', message='Job is still processing')
    elif job['status'] == 'completed':
        return job['results']
    else:
        return JobStatus(status='failed', error=job.get('error', 'Unknown error'))

@router.post("/cancel/{job_id}")
async def cancel_test_job(job_id: str):
    if job_id not in test_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = test_jobs[job_id]
    
    if job['status'] == 'processing':
        job['status'] = 'cancelled'
        return JobStatus(status='cancelled', message='Job cancelled successfully')
    else:
        return JobStatus(
            status=job['status'],
            message=f'Job is already in {job["status"]} state and cannot be cancelled'
        )


@router.get("/download/{job_id}")
async def download_results(
    job_id: str, 
    format_type: str = Query("json", alias="format")
):
    if job_id not in test_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = test_jobs[job_id]
    
    if job['status'] != 'completed':
        raise HTTPException(
            status_code=400,
            detail=f'Job is in {job["status"]} state and cannot be downloaded'
        )
    
    try:
        if format_type == "json":
            # Create a temporary file with the JSON data
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.json')
            temp_path = temp_file.name
            temp_file.close()
            
            # Write to the file
            with open(temp_path, 'w') as f:
                json.dump(job['results'], f, indent=2)
            
            # Return the file
            return FileResponse(
                temp_path,
                media_type='application/json',
                filename=f"testbed-results-{job_id}.json"
            )
        
        elif format_type == "csv":
            # Create a temporary file for CSV
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.csv')
            temp_path = temp_file.name
            temp_file.close()
            
            # Write to the file
            with open(temp_path, 'w') as f:
                f.write("timestamp,severity,category,description,source,destination\n")
                if 'alerts' in job['results']:
                    for alert in job['results']['alerts']:
                        # Use csv library to handle escaping properly
                        description = alert['description'].replace('"', '""')
                        line = f"{alert['timestamp']},{alert['severity']},{alert['category']},\"{description}\",{alert['source']},{alert['destination']}\n"
                        f.write(line)
            
            # Return the file
            return FileResponse(
                temp_path,
                media_type='text/csv',
                filename=f"testbed-results-{job_id}.csv"
            )
        
        elif format_type == "pcap":
            if 'file' in job and os.path.exists(job['file']):
                return FileResponse(
                    job['file'],
                    media_type='application/vnd.tcpdump.pcap',
                    filename=f"testbed-results-{job_id}.pcap"
                )
            else:
                # Create a minimal valid PCAP file
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pcap')
                temp_path = temp_file.name
                
                # Write PCAP header (magic number and other headers)
                with open(temp_path, 'wb') as f:
                    # PCAP global header (magic number, version, timezone, etc.)
                    f.write(b"\xd4\xc3\xb2\xa1")  # Magic number
                    f.write(b"\x02\x00")          # Major version
                    f.write(b"\x04\x00")          # Minor version
                    f.write(b"\x00\x00\x00\x00")  # GMT to local correction
                    f.write(b"\x00\x00\x00\x00")  # Accuracy of timestamps
                    f.write(b"\xff\xff\x00\x00")  # Max length of captured packets
                    f.write(b"\x01\x00\x00\x00")  # Data link type
                
                return FileResponse(
                    temp_path,
                    media_type='application/vnd.tcpdump.pcap',
                    filename=f"testbed-results-{job_id}.pcap"
                )
        else:
            raise HTTPException(status_code=400, detail="Invalid format requested")
    
    except Exception as e:
        # Add better error logging
        import traceback
        print(f"Download error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f'Error preparing download: {str(e)}')
    

