import { useState } from 'react';
import { apiService } from '../../../services/api';

export const CaptureControls = ({ onStartCapture }) => {
  const [iface, setIface] = useState('Wi-Fi');
  const [filters, setFilters] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState('');

  const handleStartCapture = async () => {
    try {
      setIsCapturing(true);
      setError('');
      const filterList = filters.split(',').map(f => f.trim()).filter(f => f);
      
      await apiService.startLiveCapture({
        iface,
        filters: filterList
      });
      
      onStartCapture();
    } catch (err) {
      setError('Failed to start capture. Check console for details.');
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleManualAlert = async () => {
    try {
      await apiService.postManualAlert({
        type: "manual",
        message: "Manual alert triggered from UI",
        severity: "medium"
      });
      alert('Manual alert sent successfully');
    } catch (err) {
      console.error('Error sending manual alert:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-lg mb-4">Capture Controls</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Interface</label>
          <select
            value={iface}
            onChange={(e) => setIface(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Wi-Fi">Wi-Fi</option>
            <option value="wlan0">wlan0</option>
            <option value="lo">lo</option>
            <option value="eth0">eth0</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filters (comma separated)</label>
          <input
            type="text"
            value={filters}
            onChange={(e) => setFilters(e.target.value)}
            placeholder="tcp port 80, udp port 53"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleStartCapture}
            disabled={isCapturing}
            className={`px-4 py-2 rounded-md text-white ${isCapturing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isCapturing ? 'Starting...' : 'Start Capture'}
          </button>

          <button
            onClick={handleManualAlert}
            className="px-4 py-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700"
          >
            Test Alert
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};
