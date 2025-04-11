import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function ProtocolDistribution({ packets }) {
  const [protocolData, setProtocolData] = useState([])

  useEffect(() => {
    if (packets.length === 0) return

    const protocolCounts = packets.reduce((acc, pkt) => {
      let protocol = pkt.protocol || 'unknown'
      
      // Enhance protocol names for better visualization
      if (protocol === 'TLS' && pkt.dst_port === 443) protocol = 'HTTPS'
      else if (protocol === 'TCP' && pkt.dst_port === 80) protocol = 'HTTP'
      else if (protocol === 'DNS') protocol = 'DNS'
      
      acc[protocol] = (acc[protocol] || 0) + 1
      return acc
    }, {})

    const formattedData = Object.entries(protocolCounts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / packets.length) * 100).toFixed(1) + '%'
      }))
      .sort((a, b) => b.value - a.value)

    setProtocolData(formattedData)
  }, [packets])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-80">
      <h3 className="text-lg font-semibold mb-4">Protocol Distribution</h3>
      {protocolData.length > 0 ? (
        <div className="flex flex-col h-full">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={protocolData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {protocolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    value, 
                    `${name}: ${(props.payload.percent * 100).toFixed(2)}%`
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-auto max-h-24">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Protocol</th>
                  <th className="text-left">Count</th>
                  <th className="text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {protocolData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.value}</td>
                    <td>{item.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          {packets.length > 0 ? 'Processing protocol data...' : 'No packet data available'}
        </div>
      )}
    </div>
  )
}
