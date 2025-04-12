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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Protocol Activity</h3>
      <div className="text-xs text-gray-500 mb-1">10-second intervals</div>
      
      {chartData.length > 0 ? (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" strokeOpacity={0.3} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                interval={Math.ceil(chartData.length / 6)} 
                height={20}
              />
              <YAxis 
                width={30}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}`, name]}
                labelFormatter={(time) => `Time: ${time}`}
                contentStyle={{
                  fontSize: '12px',
                  padding: '5px 8px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '5px',
                  fontSize: '12px',
                }}
                layout="horizontal"
                verticalAlign="bottom"
                height={36}
              />
              <Line type="monotone" dataKey="DNS" stroke="#8884d8" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="HTTPS" stroke="#82ca9d" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="TCP" stroke="#ffc658" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="UDP" stroke="#ffbb28" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="HTTP" stroke="#d0ed57" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Other" stroke="#ff8042" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          {packets.length > 0 ? 'Processing traffic data...' : 'No packet data available'}
        </div>
      )}
    </div>
  );
}
