import { useEffect, useState } from 'react'
import React from 'react'
import { fetchApi } from '../../utils/api'

export default function GeoMap({ data }) {
  const [mapData, setMapData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const processGeoData = async () => {
      if (data.length === 0) {
        setMapData([])
        setIsLoading(false)
        return
      }

      try {
        // Get unique IPs
        const uniqueIPs = [...new Set(data.map(item => item.ip))]
        
        // Lookup geo info for each IP
        const geoInfo = await Promise.all(
          uniqueIPs.map(ip => 
            fetchApi('/api/processing/geoip/lookup', {
              method: 'POST',
              body: JSON.stringify({ ip })
            })
          )
        )
        
        // Count occurrences per country
        const countryCounts = {}
        geoInfo.forEach((result) => {
          const country = result.geoip_result?.country?.names?.en || 'Unknown'
          countryCounts[country] = (countryCounts[country] || 0) + 1
        })
        
        // Format for map
        const formattedData = Object.entries(countryCounts).map(([country, count]) => ({
          id: country,
          value: count
        }))
        
        setMapData(formattedData)
      } catch (error) {
        console.error('Error processing geo data:', error)
        setMapData([])
      } finally {
        setIsLoading(false)
      }
    }

    processGeoData()
  }, [data])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-96">
      <h3 className="text-lg font-semibold mb-4">Traffic Origins</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : mapData.length > 0 ? (
        <div className="h-full w-full">
          {/* In a real implementation, you would use a map library like react-simple-maps */}
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Map visualization would appear here
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mapData.slice(0, 6).map((item, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                    <p className="font-medium">{item.id}</p>
                    <p>{item.value} requests</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          No geographic data available
        </div>
      )}
    </div>
  )
}
