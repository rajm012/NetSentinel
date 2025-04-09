// frontend/src/components/views/HistoricalView.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AlertFeed from '../alerts/AlertFeed';
import ProtocolDistribution from '../charts/ProtocolDistribution';
import TrafficFlowChart from '../charts/TrafficFlowChart';
import TimeRangeSelector from '../controls/TimeRangeSelector';

const HistoricalView = () => {
  const [alerts, setAlerts] = useState([]);
  const [protocolStats, setProtocolStats] = useState([]);
  const [trafficFlow, setTrafficFlow] = useState([]);
  const [timeRange, setTimeRange] = useState({ from: '', to: '' });

  const fetchHistoricalData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/history`, {
        params: { from: timeRange.from, to: timeRange.to }
      });

      setAlerts(res.data.alerts || []);
      setProtocolStats(res.data.protocolStats || []);
      setTrafficFlow(res.data.trafficFlow || []);
    } catch (err) {
      console.error("Failed to load historical data:", err.message);
    }
  };

  useEffect(() => {
    if (timeRange.from && timeRange.to) {
      fetchHistoricalData();
    }
  }, [timeRange]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📜 Historical Analysis</h1>
      
      <TimeRangeSelector onChange={setTimeRange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProtocolDistribution stats={protocolStats} />
        <TrafficFlowChart data={trafficFlow} />
      </div>

      <AlertFeed alerts={alerts} />
    </div>
  );
};

export default HistoricalView;
