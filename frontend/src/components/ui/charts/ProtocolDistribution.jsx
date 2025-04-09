import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ProtocolDistribution() {
  const [data, setData] = useState([
    { protocol: "TCP", count: 40 },
    { protocol: "UDP", count: 25 },
    { protocol: "ICMP", count: 15 },
    { protocol: "DNS", count: 5 },
  ]);

  useEffect(() => {
    // TODO: Later replace with real stats
    const interval = setInterval(() => {
      setData(prev =>
        prev.map(entry => ({
          ...entry,
          count: Math.floor(Math.random() * 100),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">📈 Protocol Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="protocol" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
