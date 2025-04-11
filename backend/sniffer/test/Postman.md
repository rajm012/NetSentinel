Here's how we can test all endpoints of the Sniffer:

---

### ✅ 1. `GET /status`
**Purpose:** Check if sniffer module is ready  
**Method:** `GET`  
**Body:** _None_  
**Postman:**  
- Choose `GET`
- URL: `http://localhost:8000/api/sniffer/status`
- Click "Send"

---

### ✅ 2. `POST /start-live`
**Purpose:** Start a live sniffer  
**Method:** `POST`  
**Body Type:** `raw` JSON  
**Postman:**  
- Choose `POST`
- URL: `http://localhost:8000/api/sniffer/start-live`
- Go to **Body > raw > JSON**, and use:
```json
{
  "iface": "Wi-Fi",
  "filters": ["tcp", "udp"],
  "name": "Test Sniffer"
}
```
- Make sure the header `Content-Type: application/json` is set.

---

### ✅ 3. `GET /live/{sniffer_id}/status`
**Purpose:** Get live sniffer status  
**Method:** `GET`  
**URL Example:**  
```http
http://localhost:8000/api/sniffer/live/<your-sniffer-id>/status
```

---

### ✅ 4. `GET /live/{sniffer_id}/results`
**Purpose:** Get packet results from a live sniffer  
**Method:** `GET`  
**Postman Options:**
- URL:  
```http
http://localhost:8000/api/sniffer/live/<sniffer_id>/results?limit=100&clear=false&since_timestamp=1683600000.0
```
- You can remove `since_timestamp` if not needed.

---

### ✅ 5. `POST /live/{sniffer_id}/stop`
**Purpose:** Stop a running sniffer  
**Method:** `POST`  
**URL:**  
```http
http://localhost:8000/api/sniffer/live/<sniffer_id>/stop
```
- No body required.

---

### ✅ 6. `DELETE /live/{sniffer_id}`
**Purpose:** Delete a sniffer  
**Method:** `DELETE`  
**URL:**  
```http
http://localhost:8000/api/sniffer/live/<sniffer_id>
```

---

### ✅ 7. `GET /live`
**Purpose:** List all active sniffers  
**Method:** `GET`  
**URL:**  
```http
http://localhost:8000/api/sniffer/live
```

---

### ✅ 8. `POST /analyze-pcap`
**Purpose:** Upload and analyze a `.pcap` file  
**Method:** `POST`  
**Postman:**
- URL:  
```http
http://localhost:8000/api/sniffer/analyze-pcap
```
- Go to **Body > form-data**
    - Key: `file`, Type: `File`, Value: _(upload your `.pcap` file)_
    - Key: `name`, Type: `Text`, Value: `test-capture`
  
---

### ✅ 9. `GET /pcap/{analyzer_id}/status`
**Purpose:** Get PCAP analysis status  
**Method:** `GET`  
**URL:**  
```http
http://localhost:8000/api/sniffer/pcap/<analyzer_id>/status
```

---

### ✅ 10. `GET /pcap/{analyzer_id}/results`
**Purpose:** Get results of a `.pcap` analysis  
**Method:** `GET`  
**URL Example:**  
```http
http://localhost:8000/api/sniffer/pcap/<analyzer_id>/results?limit=100&offset=0
```

---

-------------------------Another Way------------------------------
1. Get Sniffer Status

Request Type: GET
URL: http://localhost:8000/api/sniffer/status
Description: Checks the status of the sniffer module
No parameters required

2. Start Live Sniffer

Request Type: POST
URL: http://localhost:8000/api/sniffer/start-live
Body: Select "raw" and "JSON" with the following content:

json{
  "iface": "eth0",
  "filters": ["tcp", "port 80"],
  "name": "HTTP Traffic Monitor"
}

Description: Starts a live network sniffer on the specified interface

3. Get Live Sniffer Status

Request Type: GET
URL: http://localhost:8000/api/sniffer/live/{sniffer_id}/status
Path Parameter: Replace {sniffer_id} with the ID returned from the start-live endpoint
Description: Gets the status of a specific running sniffer

4. Get Live Sniffer Results

Request Type: GET
URL: http://localhost:8000/api/sniffer/live/{sniffer_id}/results
Path Parameter: Replace {sniffer_id} with the ID returned from the start-live endpoint
Query Parameters:

limit: Number of results to return (default 100, max 1000)
clear: Boolean to clear results after fetching (default false)
since_timestamp: Optional timestamp to only return newer results


Example: http://localhost:8000/api/sniffer/live/123e4567-e89b-12d3-a456-426614174000/results?limit=200&clear=false&since_timestamp=1680000000.123

5. Stop Live Sniffer

Request Type: POST
URL: http://localhost:8000/api/sniffer/live/{sniffer_id}/stop
Path Parameter: Replace {sniffer_id} with the ID returned from the start-live endpoint
Description: Stops a running sniffer but keeps results available

6. Delete Live Sniffer

Request Type: DELETE
URL: http://localhost:8000/api/sniffer/live/{sniffer_id}
Path Parameter: Replace {sniffer_id} with the ID returned from the start-live endpoint
Description: Stops and deletes a sniffer and its results

7. List Active Sniffers

Request Type: GET
URL: http://localhost:8000/api/sniffer/live
Description: Lists all active sniffers and their statuses

8. Analyze PCAP File

Request Type: POST
URL: http://localhost:8000/api/sniffer/analyze-pcap
Body: Select "form-data" and add:

Key: file (select file type from dropdown)

Value: [Select your PCAP file]
Key: name (text)

Value: "My PCAP Analysis" (optional)

Description: Uploads and starts analyzing a PCAP file

9. Get PCAP Analysis Status

Request Type: GET
URL: http://localhost:8000/api/sniffer/pcap/{analyzer_id}/status
Path Parameter: Replace {analyzer_id} with the ID returned from analyze-pcap endpoint
Description: Gets the status of a PCAP file analysis

10. Get PCAP Analysis Results

Request Type: GET
URL: http://localhost:8000/api/sniffer/pcap/{analyzer_id}/results
Path Parameter: Replace {analyzer_id} with the ID returned from analyze-pcap endpoint
Query Parameters:

limit: Number of results to return (default 100, max 1000)
offset: Results offset for pagination (default 0)


Example: http://localhost:8000/api/sniffer/pcap/123e4567-e89b-12d3-a456-426614174000/results?limit=500&offset=0

11. Get PCAP Analysis Summary

Request Type: GET
URL: http://localhost:8000/api/sniffer/pcap/{analyzer_id}/summary
Path Parameter: Replace {analyzer_id} with the ID returned from analyze-pcap endpoint
Description: Gets a summary of the PCAP analysis

12. Delete PCAP Analysis

Request Type: DELETE
URL: http://localhost:8000/api/sniffer/pcap/{analyzer_id}
Path Parameter: Replace {analyzer_id} with the ID returned from analyze-pcap endpoint
Description: Deletes a PCAP analysis and its associated temporary files

13. TShark Parser

Request Type: POST
URL: http://localhost:8000/api/sniffer/tshark
Body: Select "form-data" and add:

Key: file (select file type from dropdown)

Value: [Select your PCAP file]

-----------------------------------------------------------------------------------

