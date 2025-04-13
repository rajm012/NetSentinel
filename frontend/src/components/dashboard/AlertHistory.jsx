import { useState, useEffect } from 'react';
import { fetchAlerts } from '../../utils/hispi';

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAlerts(
          limit,
          severityFilter === 'all' ? null : severityFilter
        );
        
        // Handle both possible response structures
        const alertsData = response.alerts || response || [];
        setAlerts(Array.isArray(alertsData) ? alertsData : []);
      } catch (err) {
        console.error('Error loading alerts:', err);
        setError('Failed to load alerts. Please try again.');
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [severityFilter, limit]);

  const severityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
    info: 'bg-gray-500'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Alert History</h2>
        <div className="flex space-x-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-1 text-sm"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-1 text-sm"
          >
            <option value={50}>50 items</option>
            <option value={100}>100 items</option>
            <option value={250}>250 items</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No alerts found
            </p>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                      severityColors[alert.severity?.toLowerCase()] || 'bg-gray-500'
                    }`}
                  ></div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {alert.type || 'Unknown Alert Type'}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'No timestamp'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {alert.message || 'No message provided'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
