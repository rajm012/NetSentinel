# 🛡️ NetSentinel

> Real-time Network Traffic Monitoring and Threat Detection Platform Built using **React**, **FastAPI**, **Scapy**, and **modern data visualization tools**.

---

## 🌐 Overview

NetSentinel is a full-stack cybersecurity dashboard for real-time and historical network analysis. From live packet capture to behavioral threat intelligence and PCAP testbeds, NetSentinel aims to offer a modular, interactive, and extendable NIDS-like system with a beautiful UI and intuitive controls.

---

## 🚀 Features at a Glance

- 🌍 **Real-time network traffic visualization**
- 📦 **Upload and analyze PCAPs**
- 🔍 **Behavioral & fingerprint-based threat detection**
- 🧠 **AI/ML-enabled traffic analysis (WIP)**
- 📊 **Dashboards with live charts, GeoMaps, and protocol breakdowns**
- 🧪 **Built-in packet testbed for simulation & replay**
- 🔧 **Fully configurable via UI panel**
- 🌙 **Dark/light theme support**

---

## 🏗️ Web Structure & Views

### 🏠 Home Page (Landing Page)

**URL:** `/`  
The gateway to the platform, includes:

- Project name, logo, and description  
- CTA buttons:
  - ➡️ Dashboard
  - 📜 View Docs
  - 🔐 Admin/Login (optional)

---

### 📊 Dashboard Layout

**URL:** `/dashboard`  
Your main workspace.

#### 🧭 Sidebar Navigation:

- 🟢 Real-Time View
- 📁 Historical Data
- 🧠 Threat Intel
- ⚙️ Configuration
- 🧪 Packet Testbed
- 📦 Raw Logs / PCAP Upload
- 📜 Docs
- 👤 Profile

#### 🔝 Top Bar Controls:

- Capture status (live/offline)
- Interface selector
- Notification bell
- Timestamp
- Dark/light theme toggle

---

### 🔴 Real-time View

**URL:** `/dashboard/realtime`  
A live window into your network:

- Packet stream viewer (filterable)
- 🚨 Alert Feed
- 🌍 GeoMap of IP origins
- 🥧 Protocol distribution chart
- 📈 Time-series flow chart
- 🎛️ Capture control bar
- Toggle: Raw packets ↔️ Flow-based view

**Tech Used:**  
- WebSocket + Redux  
- FastAPI + Scapy/tshark backend

---

### 🧾 Historical View

**URL:** `/dashboard/historical`  
Inspect past logs, alerts, and flows.

- Load from PCAP or JSON logs
- Use `FilterBuilder.jsx` to query
- Export sessions or alerts
- Inspect historical packet sequences

---

### 🔍 Threat Intelligence

**URL:** `/dashboard/threatintel`  
AI and rule-based threat breakdown:

- Behavior-based detection (e.g., scanning, burst patterns)
- Device and protocol fingerprinting (TLS/HTTP/etc.)
- Known threat tool detection (Metasploit, CobaltStrike)
- Severity filters: 🔵 Low | 🟡 Medium | 🔴 High
- Drill-down per alert → View associated packets

---

### 🛠️ Configuration Panel

**URL:** `/dashboard/config`

Modify how your engine behaves:

- Detection thresholds & toggles
- Capture interface selection
- Logging format, location & frequency
- Alert channels (email/webhook)
- Time ranges (`TimeRangeSelector.jsx`)

---

### 🧪 Testbed / Packet Replay

**URL:** `/dashboard/testbed`  
Simulate attacks and test detection logic:

- Upload PCAPs
- Replay through detector engine
- Compare triggered alerts vs ground truth

---

### 📦 Packet Details View

**URL:** `/packet/:id` (or modal popup)

Whenever a packet or alert is clicked:

- Layered packet parsing (Ethernet, IP, TCP, etc.)
- Hex dump view
- Associated alerts/anomalies
- Source/Dest GeoIP
- Timeline correlation with other packets

---

## ⚙️ Tech Stack

| Layer        | Stack                            |
| ------------ | -------------------------------- |
| Frontend     | React + Tailwind + Recharts      |
| Backend      | FastAPI + Scapy/tshark           |
| Real-Time    | WebSocket + Redux                |
| Visualization| GeoMap (Leaflet/D3), Recharts    |
| Data Format  | PCAP, JSON, Parquet (ML)         |
| Auth (Opt.)  | JWT / OAuth (planned)            |

---

## 🧪 Running the App (Dev Mode)

```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📈 Future Plans

- ✅ Packet-level anomaly detection using ML/DL
- 🔍 DPI and App-layer analytics
- 🔐 Admin dashboard and audit logs
- 📊 Elasticsearch or ClickHouse backend for scalable storage
- 🧠 Integrate Deep Learning models like FNO for traffic prediction

---

## 📜 License

MIT License — feel free to fork, contribute, and make it your own!

---
