import { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';

export const StatsOverview = () => {
  const [stats, setStats] = useState({
    packetCount: 0,
    protocols: {},
    threats: 0,
    throughput: 0
  });
  const [thresholds, setThresholds] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you'd have an endpoint for live stats
        // For now, we'll simulate with random data
        const newStats = {
          packetCount: Math.floor(Math.random() * 1000),
          protocols: {
            TCP: Math.floor(Math.random() * 500),
            UDP: Math.floor(Math.random() * 300),
            ICMP: Math.floor(Math.random() * 100),
            Other: Math.floor(Math.random() * 50)
          },
          threats: Math.floor(Math.random() * 10),
          throughput: Math.floor(Math.random() * 1000)
        };
        setStats(newStats);

        const thresholdsData = await apiService.getThresholds();
        setThresholds(thresholdsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-lg mb-4">Traffic Overview</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600">Total Packets</p>
          <p className="text-2xl font-bold">{stats.packetCount}</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600">Threats Detected</p>
          <p className="text-2xl font-bold">{stats.threats}</p>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-purple-600">Throughput</p>
          <p className="text-2xl font-bold">{stats.throughput} pps</p>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-600">Port Scan Threshold</p>
          <p className="text-2xl font-bold">{thresholds.PORT_SCAN || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};
