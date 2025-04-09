// frontend/src/components/alerts/AlertFeed.js
import React from 'react';

const AlertFeed = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">🚨 Alert Feed</h2>
        <p className="text-gray-500">No alerts at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4 max-h-[400px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">🚨 Alert Feed</h2>
      <ul className="space-y-2">
        {alerts.map((alert, idx) => (
          <li key={idx} className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
            <div className="text-sm font-bold text-red-600">{alert.type || "Unknown Alert"}</div>
            <div className="text-xs text-gray-700">{alert.message || "No details available"}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertFeed;
