import React, { useState } from 'react';
import { updateThreshold } from '../../utils/configAPI';

const ThresholdConfig = ({ thresholds }) => {
  const [values, setValues] = useState(thresholds || {});
  const [saving, setSaving] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (key, value) => {
    setValues(prev => ({
      ...prev,
      [key]: parseInt(value, 10) || 0
    }));
  };

  const handleSave = async (key) => {
    setSaving(prev => ({ ...prev, [key]: true }));
    setMessage({ type: '', text: '' });
    
    try {
      await updateThreshold(key, values[key]);
      setMessage({ 
        type: 'success', 
        text: `Successfully updated "${key.replace(/_/g, ' ')}" threshold` 
      });
    } catch (error) {
      console.error('Error updating threshold:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to update threshold: ${error.message}` 
      });
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-200">Detection Thresholds</h2>
        <p className="text-gray-400">Adjust threshold values to control sensitivity of threat detection</p>
      </div>
      
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-200 border-green-400 text-green-700' 
            : 'bg-red-200 border-red-400 text-red-700'
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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="bg-gray-700 p-5 rounded-xl shadow-sm border border-gray-600 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col h-full">
              <div className="mb-3">
                <h3 className="font-medium text-gray-200 text-lg capitalize">
                  {key.replace(/_/g, ' ')}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {getThresholdDescription(key)}
                </p>
              </div>
              
              <div className="mt-auto">
                <div className="flex items-center">
                  <div className="flex-1 mr-3">
                    <label className="sr-only">Threshold value</label>
                    <input
                      type="number"
                      min="0"
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="block w-full rounded-lg text-gray-950 border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                    />
                  </div>
                  <button
                    onClick={() => handleSave(key)}
                    disabled={saving[key]}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                      saving[key]
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    } transition duration-150`}
                  >
                    {saving[key] ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to provide descriptions for different threshold types
const getThresholdDescription = (key) => {
  const descriptions = {
    PORT_SCAN: 'Number of ports scanned within time window to trigger alert',
    ARP_SPOOF: 'Number of MAC-IP mapping changes to detect spoofing',
    DOS_ATTACK: 'Connections per second to identify denial of service',
    DNS_TUNNELING: 'Suspicious DNS queries count to detect tunneling',
    BRUTE_FORCE: 'Failed login attempts before triggering alert',
    NETWORK_SWEEP: 'IP addresses scanned to detect network reconnaissance',
    HTTP_FLOOD: 'HTTP requests per second to detect flood attacks',
    SSL_STRIP: 'SSL downgrade attempts to detect MITM attacks',
    ICMP_FLOOD: 'ICMP packets per second to detect ping floods',
    SQL_INJECTION: 'Pattern matches to detect SQL injection attempts',
    XSS_ATTACK: 'Pattern matches to detect cross-site scripting attempts',
    MALWARE_CALLBACK: 'Connections to known malicious domains',
    DATA_EXFIL: 'Unusual data transfer patterns indicating exfiltration'
  };
  
  return descriptions[key] || 'Adjust threshold value to control detection sensitivity';
};

export default ThresholdConfig;
