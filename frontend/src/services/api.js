const API_BASE = 'http://localhost:8000/api';

export const apiService = {
  // Alerts
  getAlerts: async () => {
    const response = await fetch(`${API_BASE}/alerts/`);
    return await response.json();
  },

  postManualAlert: async (alert) => {
    const response = await fetch(`${API_BASE}/alerts/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert)
    });
    return await response.json();
  },

  // Sniffer Control
  startLiveCapture: async (config) => {
    const response = await fetch(`${API_BASE}/sniffer/start-live`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await response.json();
  },

  // Config
  getThresholds: async () => {
    const response = await fetch(`${API_BASE}/config/thresholds`);
    return await response.json();
  },

  updateThreshold: async (key, value) => {
    const response = await fetch(`${API_BASE}/config/thresholds/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    return await response.json();
  }
};