import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TrafficFlowChart({ data }) {
  // Group data by minute for the chart
  const groupedData = data.reduce((acc, item) => {
    const minute = new Date(item.timestamp)
    minute.setSeconds(0, 0)
    const key = minute.getTime()
    
    if (!acc[key]) {
      acc[key] = {
        timestamp: key,
        bytes: 0,
        count: 0
      }
    }
    
    acc[key].bytes += item.bytes
    acc[key].count++
    
    return acc
  }, {})
  
  const chartData = Object.values(groupedData)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString(),
      bytes: item.bytes,
      packets: item.count
    }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-80">
      <h3 className="text-lg font-semibold mb-4">Traffic Flow</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                value, 
                name === 'bytes' ? 'Bytes' : 'Packets'
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="bytes" 
              stackId="1" 
              stroke="#8884d8" 
              fill="#8884d8" 
              name="Bytes"
            />
            <Area 
              type="monotone" 
              dataKey="packets" 
              stackId="2" 
              stroke="#82ca9d" 
              fill="#82ca9d" 
              name="Packets"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          No traffic data available
        </div>
      )}
    </div>
  )
}
