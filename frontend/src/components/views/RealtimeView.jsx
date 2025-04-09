import React, { useState } from 'react';
import TrafficFlowChart from '../charts/TrafficFlowChart';
import ProtocolDistribution from '../charts/ProtocolDistribution';
import GeoMap from '../charts/GeoMap';
import CaptureControls from '../controls/CaptureControls';

const RealtimeView = () => {

  const [isCapturing, setIsCapturing] = useState(false);
  const [interfaceName, setInterfaceName] = useState('');

  const handleStartCapture = async (iface) => {
    setInterfaceName(iface);
    setIsCapturing(true);
    console.log(`🟢 Starting capture on ${iface}`);

    // TODO: Make API call to Flask backend to start sniffing
    // Example:
    // await axios.post('/api/start-capture', { interface: iface });
  };

  const handleStopCapture = async () => {
    setIsCapturing(false);
    console.log(`🔴 Stopping capture on ${interfaceName}`);

    // TODO: Make API call to Flask backend to stop sniffing
    // Example:
    // await axios.post('/api/stop-capture');
  };

  return (  
    <div className="p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📡 Real-Time Traffic View</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-medium text-blue-800">Packet Count</h3>
          <p className="text-2xl text-blue-600 font-bold">0</p>
        </div>

        <div className="bg-green-50 p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-medium text-green-800">Detected Threats</h3>
          <p className="text-2xl text-green-600 font-bold">0</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-medium text-yellow-800">Protocols Active</h3>
          <p className="text-2xl text-yellow-600 font-bold">0</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Live Packet Stream</h3>
        <div className="border border-gray-300 rounded p-4 h-64 overflow-auto bg-gray-50 text-sm text-gray-700">
          <p>[00:00:00] Waiting for packets...</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrafficFlowChart />
        <ProtocolDistribution />
      </div>
      <div className="mt-8">
        <GeoMap />
      </div>
      <CaptureControls
  isCapturing={isCapturing}
  onStart={handleStartCapture}
  onStop={handleStopCapture}
/>
    </div>
  );
};

export default RealtimeView;
