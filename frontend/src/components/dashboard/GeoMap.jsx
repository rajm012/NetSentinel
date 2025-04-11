import { useEffect, useState } from 'react'
import { fetchApi } from '../../utils/api'

// Helper to validate IPs
const isValidIP = (ip) => {
  if (!ip) return false
  if (ip === '0.0.0.0') return false
  if (ip.startsWith('192.168.')) return false // Skip local IPs
  if (ip.startsWith('10.')) return false // Skip local IPs
  if (ip.startsWith('172.')) {
    const parts = ip.split('.')
    if (parts.length >= 2 && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) {
      return false // Skip 172.16.0.0 - 172.31.255.255
    }
  }
  return true
}

export default function GeoMap({ packets }) {
  const [mapData, setMapData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    const processGeoData = async () => {
      if (!packets || packets.length === 0) {
        setMapData([])
        setDebugInfo({ message: "No packets received" })
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Extract and validate source IPs
        const sourceIPs = packets
          .map(pkt => pkt.src_ip || pkt.ip?.src) // Try different possible fields
          .filter(ip => isValidIP(ip))

        setDebugInfo(prev => ({
          ...prev,
          totalPackets: packets.length,
          sourceIPsFound: sourceIPs.length,
          sampleIPs: sourceIPs.slice(0, 5)
        }))

        if (sourceIPs.length === 0) {
          setMapData([])
          setDebugInfo(prev => ({
            ...prev,
            warning: "No valid public IPs found in packets"
          }))
          return
        }

        // Get unique IPs
        const uniqueIPs = [...new Set(sourceIPs)]
        
        // Batch lookups to avoid overwhelming the API
        const BATCH_SIZE = 5
        const geoInfo = []
        
        for (let i = 0; i < uniqueIPs.length; i += BATCH_SIZE) {
          const batch = uniqueIPs.slice(i, i + BATCH_SIZE)
          const batchResults = await Promise.all(
            batch.map(ip => 
              fetchApi('/api/processing/geoip/lookup', {
                method: 'POST',
                body: JSON.stringify({ ip })
              }).catch(e => {
                console.warn(`GeoIP lookup failed for ${ip}:`, e)
                return { ip, error: e.message }
              })
            )
          )
          geoInfo.push(...batchResults)
          await new Promise(resolve => setTimeout(resolve, 200)) // Small delay between batches
        }

        // Process successful lookups
        const countryCounts = {}
        geoInfo.forEach((result) => {
          if (!result || result.error) return
          
          const country = result.geoip_result?.country?.names?.en || 
                         result.geoip_result?.country?.iso_code || 
                         'Unknown'
          countryCounts[country] = (countryCounts[country] || 0) + 1
        })

        // Format results
        const formattedData = Object.entries(countryCounts)
          .map(([country, count]) => ({
            country,
            count,
            percentage: ((count / sourceIPs.length) * 100).toFixed(1) + '%'
          }))
          .sort((a, b) => b.count - a.count)

        setMapData(formattedData)
        setDebugInfo(prev => ({
          ...prev,
          countriesFound: formattedData.length,
          sampleCountries: formattedData.slice(0, 3)
        }))

      } catch (err) {
        console.error('Geo data processing error:', err)
        setError(`Failed to load geographic data: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    processGeoData()
  }, [packets])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-96">
      <h3 className="text-lg font-semibold mb-4">Traffic Origins</h3>
      
      {/* Debug info panel - remove in production */}
      <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
        <h4 className="font-bold">Debug Info:</h4>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
        </div>
      ) : mapData.length > 0 ? (
        <div className="h-full w-full">
          <div className="overflow-auto max-h-64">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Country</th>
                  <th className="px-4 py-2 text-left">Requests</th>
                  <th className="px-4 py-2 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mapData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{item.country}</td>
                    <td className="px-4 py-2">{item.count}</td>
                    <td className="px-4 py-2">{item.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          {packets.length > 0 
            ? 'No geographic data available (all packets may be local traffic)' 
            : 'No packet data available'}
        </div>
      )}
    </div>
  )
}
