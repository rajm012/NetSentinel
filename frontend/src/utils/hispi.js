import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

// Sniffer functions
export const startLiveSniffer = async (config) => {
  const response = await axios.post(`${API_BASE}/sniffer/start-live`, config);
  return response.data;
};

export const stopLiveSniffer = async (snifferId) => {
  const response = await axios.post(`${API_BASE}/sniffer/live/${snifferId}/stop`);
  return response.data;
};

export const getLiveSnifferStatus = async (snifferId) => {
  const response = await axios.get(`${API_BASE}/sniffer/live/${snifferId}/status`);
  return response.data;
};

export const getLiveSnifferResults = async (snifferId, limit = 100, clear = false, sinceTimestamp = null) => {
  const response = await axios.get(`${API_BASE}/sniffer/live/${snifferId}/results`, {
    params: { limit, clear, since_timestamp: sinceTimestamp }
  });
  return response.data;
};

export const listActiveSniffers = async () => {
  const response = await axios.get(`${API_BASE}/sniffer/live`);
  return response.data;
};

export const deleteLiveSniffer = async (snifferId) => {
  const response = await axios.delete(`${API_BASE}/sniffer/live/${snifferId}`);
  return response.data;
};

// PCAP functions
export const analyzePcap = async (file, name = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (name) formData.append('name', name);
  
  const response = await axios.post(`${API_BASE}/sniffer/analyze-pcap`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getPcapAnalysisStatus = async (analyzerId) => {
  const response = await axios.get(`${API_BASE}/sniffer/pcap/${analyzerId}/status`);
  return response.data;
};

export const getPcapAnalysisResults = async (analyzerId, limit = 100, offset = 0) => {
  const response = await axios.get(`${API_BASE}/sniffer/pcap/${analyzerId}/results`, {
    params: { limit, offset }
  });
  return response.data;
};

export const getPcapAnalysisSummary = async (analyzerId) => {
  const response = await axios.get(`${API_BASE}/sniffer/pcap/${analyzerId}/summary`);
  return response.data;
};

export const deletePcapAnalysis = async (analyzerId) => {
  const response = await axios.delete(`${API_BASE}/sniffer/pcap/${analyzerId}`);
  return response.data;
};

// TShark functions
export const parseWithTshark = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_BASE}/sniffer/tshark`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
