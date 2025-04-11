import { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';

export const AlertFeed = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await apiService.getAlerts();
        setAlerts(data.reverse()); // Show newest first
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 border-red-500 text-red-700';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-700';
      default: return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="font-bold text-lg mb-4">Alerts Feed</h3>
      {isLoading ? (
        <div>Loading alerts...</div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="text-gray-500">No alerts to display</p>
          ) : (
            alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`border-l-4 p-3 rounded ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{alert.type}</span>
                  <span className="text-sm">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm mt-1">{alert.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
