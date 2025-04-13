import React, { useState } from 'react';
import { updateLoggingSettings } from '../../utils/configAPI';

const LoggingConfig = ({ loggingSettings }) => {
  const [settings, setSettings] = useState({
    logDir: loggingSettings.logDir || './logs',
    logLevel: loggingSettings.logLevel || 'info',
    logRotation: loggingSettings.logRotation || true,
    logMaxSize: loggingSettings.logMaxSize || 10,
    logMaxFiles: loggingSettings.logMaxFiles || 5,
    logFormat: loggingSettings.logFormat || 'json',
    enableConsole: loggingSettings.enableConsole || true,
    enableSyslog: loggingSettings.enableSyslog || false,
    syslogHost: loggingSettings.syslogHost || 'localhost',
    syslogPort: loggingSettings.syslogPort || 514,
    syslogProtocol: loggingSettings.syslogProtocol || 'udp',
    enablePcapLogging: loggingSettings.enablePcapLogging || true,
    pcapDir: loggingSettings.pcapDir || './pcaps',
    enablePacketLogging: loggingSettings.enablePacketLogging || true
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      await updateLoggingSettings(settings);
      setMessage({
        type: 'success',
        text: 'Logging settings saved successfully'
      });
    } catch (err) {
      console.error('Error saving logging settings:', err);
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Logging Settings</h2>
        <p className="text-gray-600">Configure how the application logs events and packets</p>
      </div>
      
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
      
      {/* Application Logging Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Application Logging</h3>
        
        <div className="space-y-5">
          {/* Log Directory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Log Directory
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                Path:
              </span>
              <input
                type="text"
                value={settings.logDir}
                onChange={(e) => handleChange('logDir', e.target.value)}
                className="focus:ring-blue-500 text-gray-600 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md border-gray-300"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Log Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Log Level
              </label>
              <select
                value={settings.logLevel}
                onChange={(e) => handleChange('logLevel', e.target.value)}
                className="block w-full rounded-lg text-gray-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              >
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
                <option value="trace">Trace</option>
              </select>
            </div>
            
            {/* Log Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Log Format
              </label>
              <select
                value={settings.logFormat}
                onChange={(e) => handleChange('logFormat', e.target.value)}
                className="block w-full rounded-lg text-gray-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              >
                <option value="json">JSON</option>
                <option value="text">Plain Text</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
          
          {/* Log Rotation */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="logRotation"
                type="checkbox"
                checked={settings.logRotation}
                onChange={(e) => handleChange('logRotation', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="logRotation" className="font-medium text-gray-700">
                Enable log rotation
              </label>
            </div>
          </div>
          
          {/* Log Rotation Settings */}
          {settings.logRotation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Log Size
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={settings.logMaxSize}
                    onChange={(e) => handleChange('logMaxSize', parseInt(e.target.value, 10))}
                    className="block w-full rounded-lg text-gray-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">MB</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Log Files
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.logMaxFiles}
                  onChange={(e) => handleChange('logMaxFiles', parseInt(e.target.value, 10))}
                  className="block w-full rounded-lg text-gray-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                />
              </div>
            </div>
          )}
          
          {/* Console Output */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enableConsole"
                type="checkbox"
                checked={settings.enableConsole}
                onChange={(e) => handleChange('enableConsole', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enableConsole" className="font-medium text-gray-700">
                Enable console output
              </label>
              <p className="text-gray-500 mt-1">
                Show logs in the application console
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Syslog Configuration Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <input
            id="enableSyslog"
            type="checkbox"
            checked={settings.enableSyslog}
            onChange={(e) => handleChange('enableSyslog', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableSyslog" className="ml-2 text-lg font-semibold text-gray-800">
            Syslog Integration
          </label>
        </div>
        
        {settings.enableSyslog && (
          <div className="mt-4 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Syslog Host
                </label>
                <input
                  type="text"
                  value={settings.syslogHost}
                  onChange={(e) => handleChange('syslogHost', e.target.value)}
                  className="block w-full rounded-lg text-gray-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Syslog Port
                </label>
                <input
                  type="number"
                  min="1"
                  max="65535"
                  value={settings.syslogPort}
                  onChange={(e) => handleChange('syslogPort', parseInt(e.target.value, 10))}
                  className="block w-full rounded-lg text-gray-600 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Syslog Protocol
              </label>
              <select
                value={settings.syslogProtocol}
                onChange={(e) => handleChange('syslogProtocol', e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              >
                <option value="udp">UDP</option>
                <option value="tcp">TCP</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* PCAP Logging Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Packet Capture Logging</h3>
        
        <div className="space-y-5">
          {/* PCAP Logging */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enablePcapLogging"
                type="checkbox"
                checked={settings.enablePcapLogging}
                onChange={(e) => handleChange('enablePcapLogging', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enablePcapLogging" className="font-medium text-gray-700">
                Save packet captures (PCAP files)
              </label>
            </div>
          </div>
          
          {settings.enablePcapLogging && (
            <div className="pl-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PCAP Directory
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  Path:
                </span>
                <input
                  type="text"
                  value={settings.pcapDir}
                  onChange={(e) => handleChange('pcapDir', e.target.value)}
                  className="focus:ring-blue-500 text-gray-600 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md border-gray-300"
                />
              </div>
            </div>
          )}
          
          {/* Packet Logging */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enablePacketLogging"
                type="checkbox"
                checked={settings.enablePacketLogging}
                onChange={(e) => handleChange('enablePacketLogging', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enablePacketLogging" className="font-medium text-gray-700">
                Log individual packet details
              </label>
              <p className="text-gray-500 mt-1">
                Increases log size significantly
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${
            saving
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
              Save Logging Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoggingConfig;
