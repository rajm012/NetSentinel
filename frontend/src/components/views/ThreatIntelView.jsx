// frontend/src/components/views/ThreatIntelView.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ThreatIntelView = () => {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    const fetchThreatIntel = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/threats');
        setThreats(res.data || []);
      } catch (err) {
        console.error("Failed to load threat intel:", err.message);
      }
    };

    fetchThreatIntel();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧠 Threat Intelligence</h1>

      {threats.length === 0 ? (
        <p className="text-gray-500">No threat intelligence data available.</p>
      ) : (
        <ul className="space-y-4">
          {threats.map((threat, index) => (
            <li key={index} className="bg-red-100 p-4 rounded shadow">
              <h2 className="text-lg font-semibold text-red-700">{threat.type}</h2>
              <p className="text-gray-700">{threat.description}</p>
              {threat.indicator && (
                <p className="text-sm text-red-600 mt-1">
                  🔍 Indicator: <span className="font-mono">{threat.indicator}</span>
                </p>
              )}
              {threat.severity && (
                <p className="text-sm text-orange-700">⚠️ Severity: {threat.severity}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThreatIntelView;
