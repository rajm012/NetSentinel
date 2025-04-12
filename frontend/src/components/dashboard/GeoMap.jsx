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

// Default locations to show when no data is available
const DEFAULT_LOCATIONS = [
  { longitude: -74.006, latitude: 40.7128, count: 5, country: 'United States' },
  { longitude: -0.1278, latitude: 51.5074, count: 4, country: 'United Kingdom' }, 
  { longitude: 139.6917, latitude: 35.6895, count: 3, country: 'Japan' },
  { longitude: 2.3522, latitude: 48.8566, count: 2, country: 'France' },
  { longitude: 151.2093, latitude: -33.8688, count: 1, country: 'Australia' }
]

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
      // When no IPs, use default locations but mark them as demo data
      setMapData(DEFAULT_LOCATIONS.map(loc => ({
        country: loc.country,
        count: loc.count,
        percentage: ((loc.count / 15) * 100).toFixed(1) + '%',
        isDemo: true
      })))
      setGeoData(DEFAULT_LOCATIONS)
      setDebugInfo(prev => ({
        ...prev,
        message: isUserSelection ? "No IPs selected by user" : "No packets received",
        isDemoData: true
      }))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const validIPs = ipsToProcess.filter(ip => isValidIP(ip))

      setDebugInfo(prev => ({
        ...prev,
        totalIPs: ipsToProcess.length,
        validIPsFound: validIPs.length,
        sampleIPs: validIPs.slice(0, 5),
        source: isUserSelection ? 'user' : 'system',
        isDemoData: false
      }))

      if (validIPs.length === 0) {
        setMapData(DEFAULT_LOCATIONS.map(loc => ({
          country: loc.country,
          count: loc.count,
          percentage: ((loc.count / 15) * 100).toFixed(1) + '%',
          isDemo: true
        })))
        setGeoData(DEFAULT_LOCATIONS)
        setDebugInfo(prev => ({
          ...prev,
          warning: "No valid public IPs found",
          isDemoData: true
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
            count: countryCounts[country],
            isDemo: false
          }
        }
      })

      // Format results
      const formattedData = Object.entries(countryCounts)
        .map(([country, count]) => ({
          country,
          count,
          percentage: ((count / validIPs.length) * 100).toFixed(1) + '%',
          isDemo: false
        }))
        .sort((a, b) => b.count - a.count)

      // Prepare data for the map
      const geoDataForMap = Object.values(countryCoordinates)
      setGeoData(geoDataForMap)

      setMapData(formattedData)
      setDebugInfo(prev => ({
        ...prev,
        countriesFound: formattedData.length,
        sampleCountries: formattedData.slice(0, 3),
        isDemoData: false
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
  const maxCount = geoData.length > 0 ? Math.max(...geoData.map(d => d.count)) : 5
  const colorScale = scaleLinear()
    .domain([0, maxCount || 1])
    .range(["#ffedea", "#ff5233"])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-[700px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
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
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center flex-1 text-red-500">
          {error}
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Map container with fixed height */}
          <div className="flex-1 max-h-[450px]">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 120,
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
              {/* Show markers - either real data or default locations */}
              {geoData.map(({ longitude, latitude, count, isDemo }, i) => (
                <Marker key={i} coordinates={[longitude, latitude]}>
                  <circle
                    r={Math.min(5 + (count / maxCount) * 15, 15)}
                    fill={colorScale(count)}
                    stroke="#FFF"
                    strokeWidth={1}
                    fillOpacity={isDemo ? 0.5 : 0.7}
                    className={isDemo ? 'opacity-70' : ''}
                  />
                </Marker>
              ))}
            </ComposableMap>
          </div>
          
          {/* Table container with scrollable content */}
          <div className="mt-2 flex-1 overflow-auto max-h-[150px]">
            {mapData.length > 0 ? (
              <>
                <div className="text-sm mb-1">
                  {debugInfo.isDemoData ? (
                    <span className="text-gray-500 italic">Showing demo data</span>
                  ) : (
                    <>Showing data from: <span className="font-medium">{displayMode === 'manual' ? 'User Selection' : 'System Packets'}</span></>
                  )}
                </div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-3 py-1 text-left text-xs">Country</th>
                      <th className="px-3 py-1 text-left text-xs">Requests</th>
                      <th className="px-3 py-1 text-left text-xs">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mapData.map((item, index) => (
                      <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${item.isDemo ? 'text-gray-500 italic' : ''}`}>
                        <td className="px-3 py-1 text-sm">
                          {item.country}
                          {item.isDemo && ' (demo)'}
                        </td>
                        <td className="px-3 py-1 text-sm">{item.count}</td>
                        <td className="px-3 py-1 text-sm">{item.percentage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
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
        </div>
      )}
    </div>
  )
}
