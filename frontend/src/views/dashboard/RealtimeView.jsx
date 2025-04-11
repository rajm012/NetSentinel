import { useState, useEffect } from 'react';
import { AlertFeed } from '../../components/ui/realtime/AlertFeed';
import { CaptureControls } from '../../components/ui/realtime/CaptureControls';
import { PacketTable } from '../../components/ui/realtime/PacketTable';
import { StatsOverview } from '../../components/ui/realtime/StatsOverview';
import { GeoMap } from '../../components/ui/charts/GeoMap';
import { ProtocolDistribution } from '../../components/ui/charts/ProtocolDistribution';
import { TrafficFlowChart } from '../../components/ui/charts/TrafficFlowChart';

export const RealtimeView = () => {
  const [packets, setPackets] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);

  // Simulate packet updates when capturing
  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      // In a real app, you'd fetch from your WebSocket or API endpoint
      const newPacket = {
        timestamp: new Date().toISOString(),
        src_ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        src_port: Math.floor(Math.random() * 65535),
        dst_ip: `10.0.0.${Math.floor(Math.random() * 255)}`,
        dst_port: Math.floor(Math.random() * 65535),
        protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
        length: Math.floor(Math.random() * 1500),
        info: 'Sample packet data'
      };
      
      setPackets(prev => [newPacket, ...prev].slice(0, 1000)); // Keep max 1000 packets
    }, 300);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const handleStartCapture = () => {
    setIsCapturing(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatsOverview />
        </div>
        <div>
          <CaptureControls onStartCapture={handleStartCapture} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PacketTable packets={packets} />
        </div>
        <div>
          <AlertFeed />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <ProtocolDistribution />
        </div>
        <div className="lg:col-span-2">
          <TrafficFlowChart />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-lg mb-4">Traffic Geo Distribution</h3>
        <GeoMap />
      </div>
    </div>
  );
};


export default RealtimeView;

