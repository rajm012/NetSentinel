
--------

## 📌 1. **Upload PCAP for Traffic Statistics**

**Endpoint:**
```
POST /upload-pcap/statistics
```

### ⛏️ Postman Setup:

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/processing/upload-pcap/statistics`
- **Body:**
  - Type: `form-data`
  - Key: `file` (Type: *File*)
  - Value: Attach your `.pcap` file

### ✅ Expected Response:

```json
{
  "stats_summary": {
    "total_packets": 234,
    "total_bytes": 34523,
    "proto_6_count": 180,
    "proto_17_count": 54
  }
}
```

---

## 📌 2. **Upload PCAP for Flow Analysis**

**Endpoint:**
```
POST /upload-pcap/flows
```

### ⛏️ Postman Setup:

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/processing/upload-pcap/flows`
- **Body:**
  - Type: `form-data`
  - Key: `file` (Type: *File*)
  - Value: Attach your `.pcap` file

### ✅ Expected Response:

```json
{
  "flows": {
    "('192.168.0.10', '192.168.0.1', 12345, 80, 'TCP')": [1682333223.1111, 1682333223.5432],
    "('192.168.0.11', '8.8.8.8', 54321, 53, 'UDP')": [1682333224.1122]
  }
}
```

---

## 📌 3. **GeoIP Lookup**

**Endpoint:**
```
POST /geoip/lookup
```

### ⛏️ Postman Setup:

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/processing/geoip/lookup`
- **Body:**
  - Type: `raw`
  - Format: `JSON`
  - Content:

```json
{
  "ip": "8.8.8.8",
  "db_path": "backend/resources/GeoLite2-City.mmdb"  // Optional; only needed if default path fails
}
```

### ✅ Expected Response:

```json
{
  "geoip_result": {
    "success": true,
    "location": {
      "ip": "8.8.8.8",
      "city": "Mountain View",
      "country": "United States",
      "continent": "North America",
      "latitude": 37.386,
      "longitude": -122.0838,
      "timezone": "America/Los_Angeles"
    }
  }
}
```

> ❗ Ensure you've downloaded and placed the `GeoLite2-City.mmdb` in your `backend/resources/` folder.

---

## 📌 4. **Normalize Feature Set (Fit & Transform)**

**Endpoint:**
```
POST /normalize/fit-transform
```

### ⛏️ Postman Setup:

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/processing/normalize/fit-transform`
- **Body:**
  - Type: `raw`
  - Format: `JSON`
  - Content:

```json
{
  "data": [
    [10, 20, 30],
    [20, 40, 60],
    [30, 60, 90]
  ]
}
```

### ✅ Expected Response:

```json
{
  "normalized": [
    [0.0, 0.0, 0.0],
    [0.5, 0.5, 0.5],
    [1.0, 1.0, 1.0]
  ]
}
```

---

## 📌 5. **Normalize (Transform Only)**

**Note:** In production, you would reuse the same trained normalizer, but here, it's retrained each time.

**Endpoint:**
```
POST /normalize/transform
```

### ⛏️ Postman Setup:

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/processing/normalize/transform`
- **Body:**
  - Type: `raw`
  - Format: `JSON`
  - Content:

```json
{
  "data": [
    [15, 30, 45],
    [25, 50, 75]
  ]
}
```

### ✅ Expected Response:

```json
{
  "transformed": [
    [0.0, 0.0, 0.0],
    [1.0, 1.0, 1.0]
  ]
}
```
