import { useEffect, useState, useCallback, useRef } from 'react'
import { fetchApi } from '../../utils/api'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'

// Helper to validate IPs
const isValidIP = (ip) => {
  if (!ip) return false
  if (ip === '0.0.0.0') return false
  if (ip.startsWith('192.168.')) return false
  if (ip.startsWith('10.')) return false
  if (ip.startsWith('172.')) {
    const parts = ip.split('.')
    if (parts.length >= 2 && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31) {
      return false
    }
  }
  return true
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function GeoMap({ packets = [], userSelectedIPs = [] }) {
  const [mapData, setMapData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState({})
  const [geoData, setGeoData] = useState([])
  const [displayMode, setDisplayMode] = useState('auto') // 'auto' or 'manual'
  const prevIPsRef = useRef()

  const processGeoData = useCallback(async (ipsToProcess, isUserSelection = false) => {
    if (!ipsToProcess || ipsToProcess.length === 0) {
      setMapData([])
      setGeoData([])
      setDebugInfo(prev => ({
        ...prev,
        message: isUserSelection ? "No IPs selected by user" : "No packets received"
      }))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Extract and validate IPs
      const validIPs = ipsToProcess.filter(ip => isValidIP(ip))

      setDebugInfo(prev => ({
        ...prev,
        totalIPs: ipsToProcess.length,
        validIPsFound: validIPs.length,
        sampleIPs: validIPs.slice(0, 5),
        source: isUserSelection ? 'user' : 'system'
      }))

      if (validIPs.length === 0) {
        setMapData([])
        setGeoData([])
        setDebugInfo(prev => ({
          ...prev,
          warning: "No valid public IPs found"
        }))
        return
      }

      // Get unique IPs
      const uniqueIPs = [...new Set(validIPs)]
      
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
      const countryCoordinates = {}
      
      geoInfo.forEach((result) => {
        if (!result || result.error) return
        
        const country = result.geoip_result?.country?.names?.en || 
                       result.geoip_result?.country?.iso_code || 
                       'Unknown'
        countryCounts[country] = (countryCounts[country] || 0) + 1
        
        // Store coordinates if available
        if (result.geoip_result?.location) {
          countryCoordinates[country] = {
            longitude: result.geoip_result.location.longitude,
            latitude: result.geoip_result.location.latitude,
            count: countryCounts[country]
          }
        }
      })

      // Format results
      const formattedData = Object.entries(countryCounts)
        .map(([country, count]) => ({
          country,
          count,
          percentage: ((count / validIPs.length) * 100).toFixed(1) + '%'
        }))
        .sort((a, b) => b.count - a.count)

      // Prepare data for the map
      const geoDataForMap = Object.values(countryCoordinates)
      setGeoData(geoDataForMap)

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
  }, [])

  useEffect(() => {
    // Extract IPs based on current mode
    const currentIPs = displayMode === 'manual' 
      ? userSelectedIPs 
      : packets.map(pkt => pkt.src_ip || pkt?.ip?.src).filter(Boolean)

    // Compare with previous IPs to avoid unnecessary processing
    if (JSON.stringify(currentIPs) === JSON.stringify(prevIPsRef.current)) {
      return
    }

    prevIPsRef.current = currentIPs
    processGeoData(currentIPs, displayMode === 'manual')
  }, [packets, userSelectedIPs, displayMode, processGeoData])

  // Create a color scale based on the counts
  const maxCount = geoData.length > 0 ? Math.max(...geoData.map(d => d.count)) : 0
  const colorScale = scaleLinear()
    .domain([0, maxCount || 1])
    .range(["#ffedea", "#ff5233"])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Traffic Origins</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setDisplayMode('auto')}
            className={`px-3 py-1 text-sm rounded ${displayMode === 'auto' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Auto
          </button>
          <button 
            onClick={() => {
              if (userSelectedIPs.length > 0) {
                setDisplayMode('manual')
              }
            }}
            className={`px-3 py-1 text-sm rounded ${displayMode === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            disabled={userSelectedIPs.length === 0}
          >
            Manual
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
        </div>
      ) : (
        <div className="h-full w-full flex flex-col">
          {/* Always show the map */}
          <div className="h-64 mb-4">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 100,
                center: [0, 20]
              }}
              className="w-full h-full"
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#EAEAEC"
                      stroke="#D6D6DA"
                      className="outline-none"
                    />
                  ))
                }
              </Geographies>
              {/* Only show markers if we have geoData */}
              {geoData.length > 0 && geoData.map(({ longitude, latitude, count }, i) => (
                <Marker key={i} coordinates={[longitude, latitude]}>
                  <circle
                    r={Math.min(5 + (count / maxCount) * 15, 15)}
                    fill={colorScale(count)}
                    stroke="#FFF"
                    strokeWidth={1}
                    fillOpacity={0.7}
                  />
                </Marker>
              ))}
            </ComposableMap>
          </div>
          
          {/* Show table if we have data, otherwise show message */}
          {mapData.length > 0 ? (
            <div className="overflow-auto flex-1">
              <div className="text-sm mb-2">
                Showing data from: <span className="font-medium">{displayMode === 'manual' ? 'User Selection' : 'System Packets'}</span>
              </div>
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
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
              {displayMode === 'manual' 
                ? userSelectedIPs.length > 0
                  ? 'No valid geographic data for selected IPs'
                  : 'No IPs selected by user'
                : packets.length > 0 
                  ? 'No geographic data available (all packets may be local traffic)' 
                  : 'No packet data available'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
