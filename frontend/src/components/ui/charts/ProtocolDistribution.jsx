import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ProtocolDistribution = () => {
  // Mock data - replace with real data from your API
  const data = [
    { name: 'TCP', value: 400 },
    { name: 'UDP', value: 300 },
    { name: 'ICMP', value: 200 },
    { name: 'HTTP', value: 150 },
    { name: 'Other', value: 50 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 h-64">
      <h3 className="font-bold text-lg mb-2">Protocol Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};