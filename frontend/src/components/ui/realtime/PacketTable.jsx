import { useState, useEffect } from 'react';

export const PacketTable = ({ packets = [] }) => {
  const [displayMode, setDisplayMode] = useState('raw'); // 'raw' or 'flow'
  const [filteredPackets, setFilteredPackets] = useState(packets);

  useEffect(() => {
    setFilteredPackets(packets.slice(0, 100)); // Show only latest 100 packets
  }, [packets]);

  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === 'raw' ? 'flow' : 'raw');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Packet View</h3>
        <button
          onClick={toggleDisplayMode}
          className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
        >
          Switch to {displayMode === 'raw' ? 'Flow View' : 'Raw View'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPackets.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No packets to display</td>
              </tr>
            ) : (
              filteredPackets.map((packet, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(packet.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {packet.src_ip}:{packet.src_port}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {packet.dst_ip}:{packet.dst_port}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {packet.protocol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {packet.length}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {packet.info || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
