import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import AlertFeed from '../../components/dashboard/AlertFeed';
import GeoMap from '../../components/dashboard/GeoMap';
import ProtocolDistribution from '../../components/dashboard/ProtocolDistribution';
import TrafficFlowChart from '../../components/dashboard/TrafficFlowChart';
import CaptureControls from '../../components/dashboard/CaptureControls';
import { fetchApi } from '../../utils/api';
import DNSQueryView from '../../components/dashboard/DNSQueryView';

export default function RealtimeView() {
  const { enqueueSnackbar } = useSnackbar()
  const [isCapturing, setIsCapturing] = useState(false)
  const [activeSniffer, setActiveSniffer] = useState(null)
  const [packets, setPackets] = useState([])
  const [alerts, setAlerts] = useState([])
  const [geoData, setGeoData] = useState([])
  const [protocolData, setProtocolData] = useState([])
  const [trafficData, setTrafficData] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)
  const [viewMode, setViewMode] = useState('packets') // 'packets' or 'flows'

  // Fetch initial data
  useEffect(() => {
    fetchActiveSniffers()
    fetchAlerts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set up polling for real-time updates
  useEffect(() => {
    if (!isCapturing) return

    const interval = setInterval(() => {
      fetchPacketUpdates()
      fetchAlerts()
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isCapturing, activeSniffer])

  const fetchActiveSniffers = async () => {
    try {
      const response = await fetchApi('/api/sniffer/live')
      if (response.sniffers.length > 0) {
        setActiveSniffer(response.sniffers[0].id)
        setIsCapturing(response.sniffers[0].running)
      }
    } 
    catch (error) {
      enqueueSnackbar('Error fetching active sniffers', { variant: 'error' });
      console.error('Error fetching active sniffers:', error);
    }
  }

  const fetchPacketUpdates = async () => {
    if (!activeSniffer) return
    
    try {
      const response = await fetchApi(
        `/api/sniffer/live/${activeSniffer}/results?limit=100&clear=false${lastUpdate ? `&since_timestamp=${lastUpdate}` : ''}`
      )
      
      if (response.results.length > 0) {
        setPackets(prev => [...response.results, ...prev].slice(0, 1000))
        processTrafficData(response.results)
        setLastUpdate(response.timestamp)
      }
    } 
    catch (error) {
      enqueueSnackbar('Error fetching packet updates', { variant: 'error' });
      console.error('Error fetching active sniffers:', error);
    }
  }

  const fetchAlerts = async () => {
    try {
      const response = await fetchApi('/api/alerts?limit=10&severity=high')
      setAlerts(response.alerts)
    } 
    catch (error) {
      enqueueSnackbar('Error fetching alerts', { variant: 'error' });
      console.error('Error fetching active sniffers:', error);
    }
  }

  const processTrafficData = (newPackets) => {
    const protocolCounts = {}
    // const geoUpdates = []
    const trafficUpdates = []
    
    newPackets.forEach(pkt => {
      const srcPort = pkt['src_port'] || (typeof pkt.src === 'string' ? pkt.src.replace(':', '') : null)
      const dstPort = pkt['dst_port'] || (typeof pkt.dst === 'string' ? pkt.dst.replace(':', '') : null)
      
      const protocol = pkt.protocol || 'unknown'
      protocolCounts[protocol] = (protocolCounts[protocol] || 0) + 1
      
      trafficUpdates.push({
        timestamp: new Date(pkt.timestamp * 1000),
        bytes: pkt.length || 0,
        protocol,
        srcPort,
        dstPort
      })
    })
    
    setProtocolData(Object.entries(protocolCounts).map(([name, value]) => ({
      name,
      value
    })))
    
    setTrafficData(prev => [...trafficUpdates, ...prev].slice(0, 200))
    setGeoData(prev => [...trafficUpdates, ...prev].slice(0, 100))
  }

  const handleStartCapture = async (config) => {
    try {
      const response = await fetchApi('/api/sniffer/start-live', {
        method: 'POST',
        body: JSON.stringify(config)
      })
      
      setActiveSniffer(response.id)
      setIsCapturing(true)
      enqueueSnackbar('Capture started successfully', { variant: 'success' })
    } 
    catch (error) {
      enqueueSnackbar('Error starting capture', { variant: 'error' });
      console.error('Error fetching active sniffers:', error);
    }
  }

  const handleStopCapture = async () => {
    if (!activeSniffer) return
    
    try {
      await fetchApi(`/api/sniffer/live/${activeSniffer}/stop`, {
        method: 'POST'
      })
      
      setIsCapturing(false)
      enqueueSnackbar('Capture stopped successfully', { variant: 'success' })
    } 
    catch (error) {
      enqueueSnackbar('Error stopping capture', { variant: 'error' });
      console.error('Error fetching active sniffers:', error);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {/* Reorganized top section with alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <CaptureControls 
            isCapturing={isCapturing}
            onStart={handleStartCapture}
            onStop={handleStopCapture}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
        <div className="lg:col-span-1">
          <AlertFeed alerts={alerts} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="group hover:lg:col-span-1.5 transition-all duration-300">
          <ProtocolDistribution packets={packets} />
        </div>
        <div className="group hover:lg:col-span-1.5 transition-all duration-300">
          <TrafficFlowChart packets={packets} />
        </div>
      </div>

      {/* DNS Query with enhanced styling */}
      <div className="grid grid-cols-1">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow p-4 border border-blue-100 dark:border-gray-600">
          <DNSQueryView packets={packets} />
        </div>
      </div>

      {/* Enhanced GeoMap with increased height */}
      <div className="grid grid-cols-1">
        <div className="h-[700px]">
          <GeoMap packets={packets} />
        </div>
      </div>

      {/* Packet/Flow view with colored rows */}
      <div className="grid grid-cols-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">
            {viewMode === 'packets' ? 'Packet View' : 'Flow View'}
          </h3>
          <div className="overflow-auto max-h-96">
            {viewMode === 'packets' ? (
              <PacketTable packets={packets} />
            ) : (
              <FlowView packets={packets} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PacketTable({ packets }) {
  // Color mapping for protocols
  const protocolColors = {
    tcp: 'bg-blue-50 dark:bg-blue-900',
    udp: 'bg-green-50 dark:bg-green-900',
    icmp: 'bg-purple-50 dark:bg-purple-900',
    http: 'bg-yellow-50 dark:bg-yellow-900',
    https: 'bg-orange-50 dark:bg-orange-900',
    dns: 'bg-pink-50 dark:bg-pink-900',
    default: 'bg-gray-50 dark:bg-gray-700'
  }

  const getProtocolColor = (protocol) => {
    if (!protocol) return protocolColors.default
    const proto = protocol.toLowerCase()
    return protocolColors[proto] || protocolColors.default
  }

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destination</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Protocol</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Length</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Info</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {packets.map((pkt, i) => (
          <tr 
            key={i} 
            className={`${getProtocolColor(pkt.protocol)} hover:opacity-80 transition-opacity`}
          >
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {new Date(pkt.timestamp * 1000).toLocaleTimeString()}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {pkt.src_ip}:{pkt.src_port}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {pkt.dst_ip}:{pkt.dst_port}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
              {pkt.protocol}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {pkt.length}
            </td>
            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
              {pkt.info || '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function FlowView({ packets }) {
  // Group packets by flow
  const flows = packets.reduce((acc, pkt) => {
    const flowKey = `${pkt.src_ip}:${pkt.src_port}-${pkt.dst_ip}:${pkt.dst_port}`
    if (!acc[flowKey]) {
      acc[flowKey] = {
        src: `${pkt.src_ip}:${pkt.src_port}`,
        dst: `${pkt.dst_ip}:${pkt.dst_port}`,
        protocol: pkt.protocol,
        count: 0,
        bytes: 0,
        lastSeen: 0
      }
    }
    acc[flowKey].count++
    acc[flowKey].bytes += pkt.length || 0
    acc[flowKey].lastSeen = Math.max(acc[flowKey].lastSeen, pkt.timestamp)
    return acc
  }, {})

  const flowList = Object.values(flows).sort((a, b) => b.count - a.count)

  // Color mapping for flows
  const flowColors = {
    tcp: 'bg-blue-100 dark:bg-blue-800',
    udp: 'bg-green-100 dark:bg-green-800',
    icmp: 'bg-purple-100 dark:bg-purple-800',
    default: 'bg-gray-100 dark:bg-gray-700'
  }

  const getFlowColor = (protocol) => {
    if (!protocol) return flowColors.default
    const proto = protocol.toLowerCase()
    return flowColors[proto] || flowColors.default
  }

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destination</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Protocol</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Packets</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bytes</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Seen</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {flowList.map((flow, i) => (
          <tr 
            key={i} 
            className={`${getFlowColor(flow.protocol)} hover:opacity-80 transition-opacity`}
          >
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {flow.src}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {flow.dst}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
              {flow.protocol}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {flow.count}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {flow.bytes}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {new Date(flow.lastSeen * 1000).toLocaleTimeString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

