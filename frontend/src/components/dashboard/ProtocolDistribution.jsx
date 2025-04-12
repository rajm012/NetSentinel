import React, { useEffect, useState } from 'react' 
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function ProtocolDistribution({ packets }) {
  const [protocolData, setProtocolData] = useState([])

  useEffect(() => {
    if (!packets || packets.length === 0) {
      setProtocolData([])
      return
    }

    const protocolCounts = packets.reduce((acc, pkt) => {
      let protocol = pkt.protocol || 'Unknown'

      // Normalize protocol names
      if (protocol === 'TLS' && pkt.dst_port === 443) protocol = 'HTTPS'
      else if (protocol === 'TCP' && pkt.dst_port === 80) protocol = 'HTTP'
      else if (protocol === 'DNS') protocol = 'DNS'
      else if (protocol === 'UDP') protocol = 'UDP'
      else if (protocol === 'ICMP') protocol = 'ICMP'
      else if (protocol === 'ARP') protocol = 'ARP'
      else if (protocol === 'HTTP') protocol = 'HTTP'
      else if (protocol === 'HTTPS') protocol = 'HTTPS'
      acc[protocol] = (acc[protocol] || 0) + 1
      return acc
    }, {})

    const formattedData = Object.entries(protocolCounts).map(([name, value]) => ({
      name,
      value,
      percent: value / packets.length,
      percentage: `${((value / packets.length) * 100).toFixed(1)}%`
    }))

    setProtocolData(formattedData.sort((a, b) => b.value - a.value))
  }, [packets])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Protocol Distribution</h3>

      {protocolData.length > 0 ? (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Pie Chart */}
          <div className="w-full md:w-1/2" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={protocolData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={5}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {protocolData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Table */}
          <div className="w-full md:w-1/2 overflow-auto max-h-64">
            <table className="min-w-full text-sm table-auto">
              <thead>
                <tr>
                  <th className="text-left px-2">Protocol</th>
                  <th className="text-left px-2">Count</th>
                  <th className="text-left px-2">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {protocolData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2">{item.name}</td>
                    <td className="px-2">{item.value}</td>
                    <td className="px-2">{item.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          {packets.length > 0 ? 'Processing protocol data...' : 'No packet data available'}
        </div>
      )}
    </div>
  )
}
