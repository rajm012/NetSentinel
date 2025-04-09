// src/components/TestAPI.jsx
import { useEffect, useState } from 'react';
import { fetchPackets } from '../services/api/packetAPI';

export default function TestAPI() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchPackets()
      .then(setData)
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Live Packets</h2>
      <pre className="text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
