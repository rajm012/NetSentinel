// src/services/api/packetAPI.jsx
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchPackets = async () => {
  const res = await axios.get(`${API_BASE}/sniffer/live`);
  return res.data;
};
