import React, { useState, useEffect } from 'react';
import { VictoryPie } from 'victory';

const ProtocolDistribution = () => {
  const [data, setData] = useState(getInitialData());

  // Simulate live updates (replace with API/WebSocket later)
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateRandomProtocolData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Protocol Distribution</h3>
      <VictoryPie
        data={data}
        colorScale={["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
        labels={({ datum }) => `${datum.x}: ${datum.y}%`}
        style={{
          labels: { fontSize: 14, fill: "#1f2937" },
        }}
      />
    </div>
  );
};

const getInitialData = () => [
  { x: "TCP", y: 40 },
  { x: "UDP", y: 30 },
  { x: "ICMP", y: 15 },
  { x: "HTTP", y: 10 },
  { x: "Others", y: 5 },
];

const generateRandomProtocolData = () => {
  const tcp = Math.floor(Math.random() * 40) + 30;
  const udp = Math.floor(Math.random() * 20) + 15;
  const icmp = Math.floor(Math.random() * 15) + 5;
  const http = Math.floor(Math.random() * 20) + 5;
  const others = 100 - tcp - udp - icmp - http;
  return [
    { x: "TCP", y: tcp },
    { x: "UDP", y: udp },
    { x: "ICMP", y: icmp },
    { x: "HTTP", y: http },
    { x: "Others", y: others > 0 ? others : 0 },
  ];
};

export default ProtocolDistribution;
