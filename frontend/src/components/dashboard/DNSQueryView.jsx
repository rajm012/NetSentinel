import React, { useEffect, useState } from 'react'

export default function DNSQueryView({ packets }) {
  const [dnsQueries, setDnsQueries] = useState([])
  const [expandedQuery, setExpandedQuery] = useState(null)

  useEffect(() => {
    if (packets.length === 0) return

    const queries = packets
      .filter(pkt => pkt.protocol === 'DNS' && pkt.query)
      .reduce((acc, pkt) => {
        if (!acc[pkt.query]) {
          acc[pkt.query] = {
            query: pkt.query,
            count: 0,
            packets: [],
            firstSeen: pkt.timestamp,
            lastSeen: pkt.timestamp
          }
        }
        acc[pkt.query].count++
        acc[pkt.query].packets.push(pkt)
        acc[pkt.query].lastSeen = Math.max(acc[pkt.query].lastSeen, pkt.timestamp)
        return acc
      }, {})

    setDnsQueries(Object.values(queries).sort((a, b) => b.count - a.count))
  }, [packets])

  const toggleExpand = (query) => {
    setExpandedQuery(expandedQuery === query ? null : query)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-96">
      <h3 className="text-lg font-semibold mb-4">DNS Query Analysis</h3>
      {dnsQueries.length > 0 ? (
        <div className="overflow-auto max-h-80">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Query</th>
                <th className="px-4 py-2 text-left">Count</th>
                <th className="px-4 py-2 text-left">First Seen</th>
                <th className="px-4 py-2 text-left">Last Seen</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {dnsQueries.map((query, index) => (
                <React.Fragment key={index}>
                  <tr 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => toggleExpand(query.query)}
                  >
                    <td className="px-4 py-2">{query.query}</td>
                    <td className="px-4 py-2">{query.count}</td>
                    <td className="px-4 py-2">
                      {new Date(query.firstSeen * 1000).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(query.lastSeen * 1000).toLocaleTimeString()}
                    </td>
                  </tr>
                  {expandedQuery === query.query && (
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <td colSpan="4" className="px-4 py-2">
                        <div className="text-xs">
                          <h4 className="font-bold mb-1">DNS Packet Details:</h4>
                          <ul className="space-y-1">
                            {query.packets.map((pkt, idx) => (
                              <li key={idx}>
                                {new Date(pkt.timestamp * 1000).toLocaleTimeString()} - 
                                ID: {pkt.id} - 
                                QR: {pkt.qr ? 'Response' : 'Query'} - 
                                RCODE: {pkt.rcode}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          {packets.length > 0 ? 'No DNS queries found' : 'No packet data available'}
        </div>
      )}
    </div>
  )
}
