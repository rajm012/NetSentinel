import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TrafficFlowChart({ packets }) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (packets.length === 0) return

    // Group by minute and protocol
    const minuteMap = packets.reduce((acc, pkt) => {
      const date = new Date(pkt.timestamp * 1000)
      const minuteKey = new Date(date)
      minuteKey.setSeconds(0, 0)
      
      const key = minuteKey.getTime()
      const protocol = getProtocolLabel(pkt)
      
      if (!acc[key]) {
        acc[key] = {
          time: key,
          DNS: 0,
          HTTPS: 0,
          TCP: 0,
          Other: 0,
          total: 0
        }
      }
      
      acc[key][protocol] += 1
      acc[key].total += 1
      
      return acc
    }, {})

    const formattedData = Object.values(minuteMap)
      .sort((a, b) => a.time - b.time)
      .map(item => ({
        ...item,
        time: new Date(item.time).toLocaleTimeString()
      }))

    setChartData(formattedData)
  }, [packets])

  const getProtocolLabel = (pkt) => {
    if (pkt.protocol === 'DNS') return 'DNS'
    if (pkt.protocol === 'TLS' && pkt.dst_port === 443) return 'HTTPS'
    if (pkt.protocol === 'TCP') return 'TCP'
    return 'Other'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-80">
      <h3 className="text-lg font-semibold mb-4">Protocol Activity Over Time</h3>
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
              formatter={(value, name) => [`${value} packets`, name]}
              labelFormatter={(time) => `Time: ${time}`}
            />
            <Area 
              type="monotone" 
              dataKey="DNS" 
              stackId="1" 
              stroke="#8884d8" 
              fill="#8884d8" 
            />
            <Area 
              type="monotone" 
              dataKey="HTTPS" 
              stackId="1" 
              stroke="#82ca9d" 
              fill="#82ca9d" 
            />
            <Area 
              type="monotone" 
              dataKey="TCP" 
              stackId="1" 
              stroke="#ffc658" 
              fill="#ffc658" 
            />
            <Area 
              type="monotone" 
              dataKey="Other" 
              stackId="1" 
              stroke="#ff8042" 
              fill="#ff8042" 
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          {packets.length > 0 ? 'Processing traffic data...' : 'No packet data available'}
        </div>
      )}
    </div>
  )
}
