import { SeverityBadge } from './ThreatBadges';

export default function ThreatIntelSummary({ threats, isLoading }) {
  if (isLoading) return null;

  const severityCounts = threats.reduce((acc, threat) => {
    const severity = threat.severity || 'medium';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {});

  const threatTypes = threats.reduce((acc, threat) => {
    const type = threat.source;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Threat Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">By Severity</h4>
          <div className="space-y-2">
            {Object.entries(severityCounts).map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between">
                <div className="flex items-center">
                  <SeverityBadge severity={severity} />
                  <span className="ml-2 text-sm capitalize">{severity}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">By Type</h4>
          <div className="space-y-2">
            {Object.entries(threatTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Threats</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{threats.length}</span>
        </div>
      </div>
    </div>
  );
}
