import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const TrafficFlowChart = () => {
  // Generate mock data for the last 10 minutes
  const generateData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 9; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      data.push({
        time: time.getMinutes() + ':' + time.getSeconds().toString().padStart(2, '0'),
        incoming: Math.floor(Math.random() * 1000),
        outgoing: Math.floor(Math.random() * 800),
        threats: Math.floor(Math.random() * 10)
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <div className="bg-white rounded-lg shadow p-4 h-64">
      <h3 className="font-bold text-lg mb-2">Traffic Flow (Last 10 Minutes)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="incoming" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="outgoing" stroke="#82ca9d" />
          <Line type="monotone" dataKey="threats" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};