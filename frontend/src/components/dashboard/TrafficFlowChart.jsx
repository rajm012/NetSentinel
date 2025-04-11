import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrafficFlowChart({ packets }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!packets || packets.length === 0) {
      setChartData([]);
      return;
    }

    // Group packets into 10-second intervals
    const tenSecondMap = packets.reduce((acc, pkt) => {
      const timestamp = pkt.timestamp * 1000; // Convert to milliseconds
      const date = new Date(timestamp);
      
      // Round to the nearest 10-second mark
      const seconds = date.getSeconds();
      const roundedSeconds = Math.floor(seconds / 10) * 10;
      const roundedDate = new Date(date);
      roundedDate.setSeconds(roundedSeconds, 0);
      
      const key = roundedDate.getTime();
      const protocol = getProtocolLabel(pkt);
      
      if (!acc[key]) {
        acc[key] = { 
          time: key, 
          DNS: 0, HTTPS: 0, TCP: 0, 
          UDP: 0, HTTP: 0, 
          Other: 0, total: 0 
        };
      }
      
      acc[key][protocol] += 1;
      acc[key].total += 1;
      return acc;
    }, {});

    const formattedData = Object.values(tenSecondMap)
      .sort((a, b) => a.time - b.time)
      .map(item => ({
        ...item,
        // Format time as "HH:MM:SS" (with seconds)
        time: new Date(item.time).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        })
      }));

    setChartData(formattedData);
  }, [packets]);

  const getProtocolLabel = (pkt) => {
    if (!pkt.protocol) return 'Other';
    switch (pkt.protocol) {
      case 'DNS': return 'DNS';
      case 'TLS': return pkt.dst_port === 443 ? 'HTTPS' : 'Other';
      case 'TCP': return 'TCP';
      case 'UDP': return 'UDP';
      case 'HTTP': return 'HTTP';
      default: return 'Other';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4" style={{ height: '400px' }}>
      <h3 className="text-lg font-semibold mb-4">Protocol Activity (10-Second Intervals)</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="time" 
              // Optional: Prevent overcrowding by showing every 2nd label
              tick={{ fontSize: 12 }}
              interval={Math.ceil(chartData.length / 10)} 
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [`${value} packets`, name]}
              labelFormatter={(time) => `Time: ${time}`}
            />
            <Legend />
            <Line type="monotone" dataKey="DNS" stroke="#8884d8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="HTTPS" stroke="#82ca9d" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="TCP" stroke="#ffc658" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="UDP" stroke="#ffbb28" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="HTTP" stroke="#d0ed57" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Other" stroke="#ff8042" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          {packets.length > 0 ? 'Processing traffic data...' : 'No packet data available'}
        </div>
      )}
    </div>
  );
}
