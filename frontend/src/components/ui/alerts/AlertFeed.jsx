import { useEffect, useState } from "react";

export default function AlertFeed() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // TEMP MOCK ALERT (replace with API/WebSocket later)
      setAlerts(prev => [
        {
          id: Date.now(),
          type: "Port Scan",
          srcIP: "192.168.1.20",
          severity: "high",
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 19),
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const colorMap = {
    high: "bg-red-500",
    medium: "bg-yellow-400",
    low: "bg-green-400",
  };

  return (
    <div className="bg-white shadow p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">⚠️ Live Alerts</h3>
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.map(alert => (
          <li key={alert.id} className="flex items-center gap-3 border-b pb-2">
            <span className={`h-3 w-3 rounded-full ${colorMap[alert.severity]}`}></span>
            <div className="flex flex-col text-sm">
              <span>{alert.type}</span>
              <span className="text-xs text-gray-500">{alert.srcIP} • {alert.timestamp}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
