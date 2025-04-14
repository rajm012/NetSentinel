import { useState } from 'react';

const TestResults = ({ results }) => {
  const [viewMode, setViewMode] = useState('alerts');

  if (!results) {
    return <div>No test results available</div>;
  }

  const { alerts, statistics, packetSummary } = results;

  // Calculate detection statistics
  const totalAlerts = alerts.length;
  const alertsByCategory = alerts.reduce((acc, alert) => {
    acc[alert.category] = (acc[alert.category] || 0) + 1;
    return acc;
  }, {});

  const alertsBySeverity = alerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-950">Test Results</h2>
        <div className="flex">
          <button
            className={`px-4 py-2 rounded-l ${viewMode === 'alerts' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('alerts')}
          >
            Alerts
          </button>
          <button
            className={`px-4 py-2 ${viewMode === 'statistics' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('statistics')}
          >
            Statistics
          </button>
          <button
            className={`px-4 py-2 rounded-r ${viewMode === 'packets' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setViewMode('packets')}
          >
            Packets
          </button>
        </div>
      </div>

      {viewMode === 'alerts' && (
        <div>
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-gray-800">Alerts Triggered ({totalAlerts})</h3>
            {totalAlerts > 0 && (
              <button className="text-blue-600 hover:text-blue-800">
                Export Alerts
              </button>
            )}
          </div>

          {totalAlerts === 0 ? (
            <div className="bg-gray-50 p-8 rounded text-center">
              <p className="text-gray-600">No alerts were triggered by this traffic.</p>
              <p className="text-sm text-gray-700 mt-2">This could mean the traffic is benign or that your detection rules need adjustment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {alerts.map((alert, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex px-2 text-xs font-semibold rounded-full 
                            ${alert.severity === 'high' ? 'bg-red-100 text-red-800' : 
                              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'}`}
                        >
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {alert.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {alert.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {alert.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {alert.destination}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === 'statistics' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-sm font-medium text-gray-500">Total Packets</h4>
              <p className="text-2xl font-bold text-gray-800">{statistics.totalPackets}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-sm font-medium text-gray-500">Total Alerts</h4>
              <p className="text-2xl font-bold text-gray-800">{totalAlerts}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-sm font-medium text-gray-500">Traffic Duration</h4>
              <p className="text-2xl font-bold text-gray-800">{statistics.duration} sec</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded p-4">
              <h4 className="font-medium text-gray-800 mb-2">Alerts by Category</h4>
              <div className="space-y-2">
                {Object.entries(alertsByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <span className="w-1/3 text-gray-600">{category}</span>
                    <div className="w-2/3">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                              {count}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-800 font-semibold inline-block">
                              {Math.round((count / totalAlerts) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                          <div style={{ width: `${(count / totalAlerts) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded p-4">
              <h4 className="font-medium text-gray-800 mb-2">Alerts by Severity</h4>
              <div className="space-y-2">
                {['high', 'medium', 'low'].map((severity) => (
                  <div key={severity} className="flex items-center">
                    <span className="w-1/3 text-gray-600 capitalize">{severity}</span>
                    <div className="w-2/3">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full 
                              ${severity === 'high' ? 'bg-red-200 text-red-800' : 
                                severity === 'medium' ? 'bg-yellow-200 text-yellow-800' : 
                                  'bg-blue-200 text-blue-800'}`}>
                              {alertsBySeverity[severity] || 0}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-800 font-semibold inline-block">
                              {alertsBySeverity[severity] ? Math.round((alertsBySeverity[severity] / totalAlerts) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                          <div 
                            style={{ width: `${alertsBySeverity[severity] ? (alertsBySeverity[severity] / totalAlerts) * 100 : 0}%` }} 
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
                              ${severity === 'high' ? 'bg-red-500' : 
                                severity === 'medium' ? 'bg-yellow-500' : 
                                  'bg-blue-500'}`}>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border rounded p-4">
            <h4 className="font-medium text-gray-800 mb-2">Protocol Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statistics.protocols).map(([protocol, count]) => (
                <div key={protocol} className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-950 uppercase">{protocol}</p>
                  <p className="text-lg text-gray-700 font-semibold">{count} packets</p>
                  <p className="text-xs text-gray-500">
                    {Math.round((count / statistics.totalPackets) * 100)}% of total
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'packets' && (
        <div>
          <h3 className="font-bold text-gray-800 mb-4">Packet Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Length
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Info
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packetSummary.map((packet, index) => (
                  <tr key={index} className={`hover:bg-gray-50 ${packet.flagged ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {packet.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {packet.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {packet.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {packet.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {packet.protocol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {packet.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {packet.info}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResults;
