import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '../../components/dashboard/ConfigTabs';
import ThresholdConfig from '../../components/dashboard/ThresholdConfig';
import DetectorConfig from '../../components/dashboard/DetectorConfig';
import CaptureConfig from '../../components/dashboard/CaptureConfig';
import AlertConfig from '../../components/dashboard/AlertConfig';
import LoggingConfig from '../../components/dashboard/LoggingConfig';
import { getThresholds, getSettings, getRules } from '../../utils/configAPI';

const ConfigurationView = () => {
  const [activeTab, setActiveTab] = useState('thresholds');
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState({
    thresholds: {},
    detectors: [],
    settings: {},
    captureSettings: {}
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfigData = async () => {
      setLoading(true);
      try {
        const [thresholdsData, rulesData, settingsData] = await Promise.all([
          getThresholds().catch(err => {
            console.warn('Thresholds fetch failed, using fallback data', err);
            return {};
          }),
          getRules().catch(err => {
            console.warn('Rules fetch failed, using fallback data', err);
            return [];
          }),
          getSettings().catch(err => {
            console.warn('Settings fetch failed, using fallback data', err);
            return {};
          })
        ]);
  
        setConfigData({
          thresholds: thresholdsData,
          detectors: rulesData,
          settings: settingsData,
          captureSettings: settingsData?.capture || {}
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching configuration data:', err);
        setError('Failed to load configuration data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchConfigData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="mt-4 text-gray-600">Loading configuration data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
          <div className="flex items-start">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-lg font-bold mb-2">Configuration Error</h3>
              <p className="mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Configuration Panel</h1>
        <p className="text-gray-600 mt-2">
          Configure system settings, detection thresholds, and alerting preferences
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Tabs activeTab={activeTab} onChange={handleTabChange}>
          <Tab id="thresholds" label="Detection Thresholds">
            <div className="p-6">
              <ThresholdConfig thresholds={configData.thresholds} />
            </div>
          </Tab>
          <Tab id="detectors" label="Detectors">
            <div className="p-6">
              <DetectorConfig detectors={configData.detectors} />
            </div>
          </Tab>
          <Tab id="capture" label="Capture Settings">
            <div className="p-6">
              <CaptureConfig captureSettings={configData.captureSettings} />
            </div>
          </Tab>
          <Tab id="alerts" label="Alert Configuration">
            <div className="p-6">
              <AlertConfig alertSettings={configData.settings.alerts || {}} />
            </div>
          </Tab>
          <Tab id="logging" label="Logging Settings">
            <div className="p-6">
              <LoggingConfig loggingSettings={configData.settings.logging || {}} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ConfigurationView;
