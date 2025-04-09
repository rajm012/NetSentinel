import { useEffect, useState } from 'react';

export default function RealtimeView() {
  const [packets, setPackets] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // TEMP MOCK PACKET (replace with WebSocket/API)
      setPackets(prev => [
        {
          id: Date.now(),
          srcIP: '192.168.1.10',
          dstIP: '10.0.0.1',
          protocol: 'TCP',
          length: 60,
        },
        ...prev.slice(0, 49), // limit to 50 entries
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Live Packet Feed</h2>
      <table className="w-full table-auto text-left border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Source IP</th>
            <th className="px-4 py-2">Destination IP</th>
            <th className="px-4 py-2">Protocol</th>
            <th className="px-4 py-2">Length</th>
          </tr>
        </thead>
        <tbody>
          {packets.map((pkt, idx) => (
            <tr key={pkt.id || idx} className="border-b">
              <td className="px-4 py-2">{pkt.srcIP}</td>
              <td className="px-4 py-2">{pkt.dstIP}</td>
              <td className="px-4 py-2">{pkt.protocol}</td>
              <td className="px-4 py-2">{pkt.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
