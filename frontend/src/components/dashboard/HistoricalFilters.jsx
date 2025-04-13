import { useState } from 'react';

export default function HistoricalFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    timeRange: 'all',
    severity: 'all',
    protocol: 'all',
    sourceIp: '',
    destinationIp: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      timeRange: 'all',
      severity: 'all',
      protocol: 'all',
      sourceIp: '',
      destinationIp: ''
    });
    onFilter({
      timeRange: 'all',
      severity: 'all',
      protocol: 'all',
      sourceIp: '',
      destinationIp: ''
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Filters</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Range
            </label>
            <select
              name="timeRange"
              value={filters.timeRange}
              onChange={handleChange}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-2 text-sm"
            >
              <option value="all">All Time</option>
              <option value="1h">Last 1 hour</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Severity
            </label>
            <select
              name="severity"
              value={filters.severity}
              onChange={handleChange}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-2 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Protocol
            </label>
            <select
              name="protocol"
              value={filters.protocol}
              onChange={handleChange}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-2 text-sm"
            >
              <option value="all">All Protocols</option>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
              <option value="icmp">ICMP</option>
              <option value="http">HTTP</option>
              <option value="dns">DNS</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source IP
            </label>
            <input
              type="text"
              name="sourceIp"
              value={filters.sourceIp}
              onChange={handleChange}
              placeholder="192.168.1.1"
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Destination IP
            </label>
            <input
              type="text"
              name="destinationIp"
              value={filters.destinationIp}
              onChange={handleChange}
              placeholder="10.0.0.1"
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}

