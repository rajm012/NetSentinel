import React, { useState, useEffect } from 'react';
import { getInterfaces, updateCaptureSettings } from '../../utils/configAPI';

const CaptureConfig = ({ captureSettings }) => {
  const [settings, setSettings] = useState({
    interface: captureSettings.interface || '',
    promiscuousMode: captureSettings.promiscuousMode || false,
    captureFilter: captureSettings.captureFilter || '',
    packetBuffer: captureSettings.packetBuffer || 1024,
    maxCapSize: captureSettings.maxCapSize || 65535,
    rotationSize: captureSettings.rotationSize || 100,
    rotationTime: captureSettings.rotationTime || 3600,
    autoStart: captureSettings.autoStart || false
  });
  
  const [availableInterfaces, setAvailableInterfaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchInterfaces();
  }, []);

  const fetchInterfaces = async () => {
    setLoading(true);
    try {
      const interfaces = await getInterfaces();
      setAvailableInterfaces(interfaces);
    } catch (err) {
      console.error('Error fetching network interfaces:', err);
      setMessage({
        type: 'error',
        text: 'Failed to load network interfaces'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await updateCaptureSettings(settings);
      setMessage({
        type: 'success',
        text: 'Capture settings saved successfully'
      });
    } catch (err) {
      console.error('Error saving capture settings:', err);
      setMessage({
        type: 'error',
        text: `Failed to save settings: ${err.message}`
      });
    } finally {
      setSaving(false);
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="mt-2 text-sm text-gray-600">Loading network interfaces...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Capture Settings</h2>
        <p className="text-gray-600">Configure packet capture options and network interface settings</p>
      </div>
      
      {/* Status Message */}
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="space-y-6">
          {/* Network Interface */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Network Interface
            </label>
            <select
              value={settings.interface}
              onChange={(e) => handleChange('interface', e.target.value)}
              className="block w-full rounded-lg text-gray-950 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
            >
              <option value="">Select Interface</option>
              {availableInterfaces.map((iface) => (
                <option key={iface.name} value={iface.name}>
                  {iface.name} {iface.description ? `- ${iface.description}` : ''}
                </option>
              ))}
            </select>
          </div>
          
          {/* Promiscuous Mode */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="promiscuousMode"
                type="checkbox"
                checked={settings.promiscuousMode}
                onChange={(e) => handleChange('promiscuousMode', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="promiscuousMode" className="font-medium text-gray-700">
                Enable promiscuous mode
              </label>
              <p className="text-gray-500 mt-1">
                Capture all packets on the network, not just those addressed to this host
              </p>
            </div>
          </div>
          
          {/* Capture Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BPF Capture Filter
            </label>
            <input
              type="text"
              value={settings.captureFilter}
              onChange={(e) => handleChange('captureFilter', e.target.value)}
              placeholder="e.g., tcp port 80 or udp port 53"
              className="block w-full rounded-lg text-gray-950 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm transition duration-150"
            />
            <p className="mt-1 text-xs text-gray-500">
              Berkeley Packet Filter syntax for filtering captured packets
            </p>
          </div>
          
          {/* Packet Buffer Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Packet Buffer Size (KB)
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                min="64"
                max="1048576"
                value={settings.packetBuffer}
                onChange={(e) => handleChange('packetBuffer', parseInt(e.target.value, 10))}
                className="block w-full rounded-lg text-gray-950 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">KB</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Memory allocated for packet buffering (higher values reduce packet loss)
            </p>
          </div>
          
          {/* Max Capture Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Capture Size
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                min="68"
                max="65535"
                value={settings.maxCapSize}
                onChange={(e) => handleChange('maxCapSize', parseInt(e.target.value, 10))}
                className="block w-full rounded-lg text-gray-950 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">bytes</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Maximum number of bytes to capture from each packet (65535 for full packets)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* PCAP Rotation Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PCAP Rotation Size
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={settings.rotationSize}
                  onChange={(e) => handleChange('rotationSize', parseInt(e.target.value, 10))}
                  className="block w-full rounded-lg text-gray-950 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">MB</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Create new PCAP file when current file reaches this size
              </p>
            </div>
            
            {/* PCAP Rotation Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PCAP Rotation Time
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  min="60"
                  max="86400"
                  value={settings.rotationTime}
                  onChange={(e) => handleChange('rotationTime', parseInt(e.target.value, 10))}
                  className="block w-full rounded-lg text-gray-950 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">seconds</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Create new PCAP file after this time period
              </p>
            </div>
          </div>
          
          {/* Auto-start Capture */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="autoStart"
                type="checkbox"
                checked={settings.autoStart}
                onChange={(e) => handleChange('autoStart', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="autoStart" className="font-medium text-gray-700">
                Automatically start capture
              </label>
              <p className="text-gray-500 mt-1">
                Begin packet capture immediately when the application launches
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !settings.interface}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${
              saving || !settings.interface
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            } transition duration-150`}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save Capture Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptureConfig;
