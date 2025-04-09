import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory';

const TrafficFlowChart = () => {
  const [data, setData] = useState(generateInitialData());


  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newPoint = {
          x: new Date().toLocaleTimeString().slice(3, 8),
          y: Math.floor(Math.random() * 100) + 1,
        };
        return [...prev.slice(-19), newPoint]; // Keep only last 20 points
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Network Packet Flow</h3>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
        <VictoryAxis dependentAxis tickFormat={(x) => `${x} pkt`} />
        <VictoryAxis />
        <VictoryLine
          data={data}
          interpolation="natural"
          style={{
            data: { stroke: "#4f46e5", strokeWidth: 2 },
          }}
        />
      </VictoryChart>
    </div>
  );
};

const generateInitialData = () => {
  const time = new Date();
  return Array.from({ length: 20 }, (_, i) => ({
    x: new Date(time.getTime() - (19 - i) * 2000).toLocaleTimeString().slice(3, 8),
    y: Math.floor(Math.random() * 50) + 10,
  }));
};

export default TrafficFlowChart;
