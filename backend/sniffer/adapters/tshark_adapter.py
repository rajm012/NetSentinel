# sniffer/adapters/tshark_adapter.py
import subprocess
import json
import os

def parse_with_tshark(pcap_file):
    """Parse a PCAP file using TShark and return structured data"""
    if not os.path.exists(pcap_file):
        return {"error": "File not found", "file_path": pcap_file}
        
    try:
        # Check if tshark is installed
        cmd = ["tshark", "--version"]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        
        # Run TShark to get JSON output
        cmd = [
            "tshark", 
            "-r", pcap_file, 
            "-T", "json", 
            "-c", "100"  # Limit to 100 packets for now
        ]
        
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        packets = json.loads(result.stdout)
        
        return {
            "file_path": pcap_file,
            "packet_count": len(packets),
            "packets": packets[:10],  # Return first 10 packets only to avoid huge responses
            "success": True
        }
        
    except subprocess.CalledProcessError as e:
        return {
            "error": "TShark execution failed",
            "file_path": pcap_file,
            "stderr": e.stderr.decode('utf-8', errors='ignore')
        }
    except json.JSONDecodeError:
        return {
            "error": "Failed to parse TShark output",
            "file_path": pcap_file
        }
    except Exception as e:
        return {
            "error": str(e),
            "file_path": pcap_file
        }