import React, { useState, useEffect } from 'react';
import { getRuleConfig, updateRuleConfig } from '../../utils/configAPI';

const DetectorConfig = ({ detectors }) => {
  const [selectedDetector, setSelectedDetector] = useState(detectors[0] || '');
  const [ruleConfig, setRuleConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (selectedDetector) {
      fetchRuleConfig(selectedDetector);
    }
  }, [selectedDetector]);

  const fetchRuleConfig = async (ruleName) => {
    setLoading(true);
    try {
      const config = await getRuleConfig(ruleName);
      setRuleConfig(config);
      setError(null);
    } catch (err) {
      console.error('Error fetching rule config:', err);
      setError('Failed to load rule configuration');
      setRuleConfig(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    if (!ruleConfig || !ruleConfig.content) return;
    
    const mainKey = Object.keys(ruleConfig.content)[0];
    if (!mainKey) return;
    
    setRuleConfig({
      ...ruleConfig,
      content: {
        [mainKey]: {
          ...ruleConfig.content[mainKey],
          [key]: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value
        }
      }
    });
  };

  const handleSave = async () => {
    if (!ruleConfig) return;
    
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await updateRuleConfig(selectedDetector, ruleConfig.content);
      setMessage({ 
        type: 'success', 
        text: `Successfully updated ${selectedDetector} configuration` 
      });
    } catch (err) {
      console.error('Error saving rule config:', err);
      setMessage({ 
        type: 'error', 
        text: `Failed to save: ${err.message}` 
      });
    } finally {
      setSaving(false);
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  const handleToggleDetector = async (enabled) => {
    setSaving(true);
    
    try {
      await updateRuleConfig(selectedDetector, {
        ...ruleConfig.content,
        enabled
      });
      
      const mainKey = Object.keys(ruleConfig.content)[0];
      setRuleConfig({
        ...ruleConfig,
        content: {
          [mainKey]: {
            ...ruleConfig.content[mainKey],
            enabled
          }
        }
      });
      
      setMessage({ 
        type: 'success', 
        text: `${selectedDetector} is now ${enabled ? 'enabled' : 'disabled'}` 
      });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: `Failed to update status: ${err.message}` 
      });
    } finally {
      setSaving(false);
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  if (detectors.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>No detectors available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-100">Detector Configuration</h2>
        <p className="text-gray-400">Configure individual detectors and their rules</p>
      </div>
      
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-200 border-green-400 text-green-700' 
            : 'bg-red-30 border-red-400 text-red-700'
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
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Detector List */}
        <div className="w-full md:w-1/3">
          <div className="bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-600">
            <h3 className="font-medium text-lg mb-4 text-gray-200">Available Detectors</h3>
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
              {detectors.map((detector) => (
                <button
                  key={detector}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedDetector === detector
                      ? 'bg-gray-900 text-blue-700 border-l-4 border-blue-600 font-medium'
                      : 'bg-gray-800 hover:bg-gray-700 text-blue-400'
                  }`}
                  onClick={() => setSelectedDetector(detector)}
                >
                  <div className="capitalize">{detector.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{detector}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Detector Configuration */}
        <div className="w-full md:w-2/3">
          <div className="bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-600">
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="mt-2 text-sm text-gray-300">Loading detector configuration...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            ) : ruleConfig ? (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-medium text-xl text-gray-200 capitalize mb-2 sm:mb-0">
                    {selectedDetector.replace(/_/g, ' ')}
                  </h3>
                  
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-300">Detector Status:</span>
                    <button
                      onClick={() => handleToggleDetector(!(ruleConfig.content[Object.keys(ruleConfig.content)[0]]?.enabled))}
                      disabled={saving}
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        ruleConfig.content[Object.keys(ruleConfig.content)[0]]?.enabled 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      }`}
                    >
                      <span 
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200 ${
                          ruleConfig.content[Object.keys(ruleConfig.content)[0]]?.enabled 
                            ? 'translate-x-5' 
                            : 'translate-x-0'
                        }`} 
                      />
                    </button>
                    <span className="ml-2 text-sm font-medium text-gray-200">
                      {ruleConfig.content[Object.keys(ruleConfig.content)[0]]?.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                
                {Object.keys(ruleConfig.content).length > 0 && (
                  <div className="space-y-5">
                    {Object.entries(ruleConfig.content[Object.keys(ruleConfig.content)[0]] || {}).map(([key, value]) => {
                      if (key === 'enabled') return null;
                      
                      return (
                        <div key={key} className="relative">
                          <label className="block text-sm font-medium text-gray-200 mb-1 capitalize">
                            {key.replace(/_/g, ' ')}
                          </label>
                          <input
                            type={typeof value === 'number' ? 'number' : 'text'}
                            value={value}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="block w-full rounded-lg text-gray-100 bg-gray-800 border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                          />
                        </div>
                      );
                    })}
                    
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
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
                            Save Configuration
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-700 rounded-lg border border-gray-600 text-gray-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Select a detector to view its configuration</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectorConfig;
