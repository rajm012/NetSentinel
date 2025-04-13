import { useState, useRef } from 'react';
import { useApi, threatApi } from '../../utils/tapi';
import { SeverityBadge, ThreatTypeBadge } from '../../components/dashboard/ThreatBadges';
import ThreatDetailsModal from '../../components/dashboard/ThreatDetailsModal';
import ThreatIntelSummary from '../../components/dashboard/ThreatIntelSummary';

const TAB_OPTIONS = {
  ANOMALIES: 'anomalies',
  BEHAVIOR: 'behavior',
  FINGERPRINTS: 'fingerprints',
  THREATS: 'threats',
  CUSTOM: 'custom'
};

export default function ThreatIntelView() {
  const { get, postFormData, isLoading: apiLoading, error: apiError } = useApi();
  const [threats, setThreats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [activeTab, setActiveTab] = useState(TAB_OPTIONS.ANOMALIES);
  const [customOptions, setCustomOptions] = useState({
    runAnomalies: true,
    runBehavior: true,
    runFingerprints: true,
    runThreats: true,
    anomaliesParams: { synThreshold: 100, portThreshold: 20, dnsMinSubdomains: 5, dnsMinLength: 50},
    behaviorParams: {connLimit: 100, window: 10, bwThreshold: 1000000, timingThreshold: 0.001}
  });
  const fileInputRef = useRef(null);

  const processPcapFile = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setThreats([]);

    try {
      let results = [];
      
      if (activeTab === TAB_OPTIONS.CUSTOM) {
        // Run selected custom analyses
        const promises = [];
        
        if (customOptions.runAnomalies) {
          promises.push(
            threatApi.detectAnomalies(file, customOptions.anomaliesParams)
              .then(res => transformAnomalies(res))
          );
        }
        
        if (customOptions.runBehavior) {
          promises.push(
            threatApi.detectBehavior(file, customOptions.behaviorParams)
              .then(res => transformBehavior(res))
          );
        }
        
        if (customOptions.runFingerprints) {
          promises.push(
            threatApi.detectFingerprints(file)
              .then(res => transformFingerprints(res))
          );
        }
        
        if (customOptions.runThreats) {
          promises.push(
            threatApi.detectThreats(file)
              .then(res => transformThreats(res))
          );
        }

        const allResults = await Promise.all(promises);
        results = allResults.flat();
      } else {
        // Run single analysis based on active tab
        let response;
        switch (activeTab) {
          case TAB_OPTIONS.ANOMALIES:
            response = await threatApi.detectAnomalies(file, customOptions.anomaliesParams);
            results = transformAnomalies(response);
            break;
          case TAB_OPTIONS.BEHAVIOR:
            response = await threatApi.detectBehavior(file, customOptions.behaviorParams);
            results = transformBehavior(response);
            break;
          case TAB_OPTIONS.FINGERPRINTS:
            response = await threatApi.detectFingerprints(file);
            results = transformFingerprints(response);
            break;
          case TAB_OPTIONS.THREATS:
            response = await threatApi.detectThreats(file);
            results = transformThreats(response);
            break;
          default:
            break;
        }
      }

      setThreats(results);
    } catch (err) {
      console.error('Error processing PCAP:', err);
      setError(err.message || 'Failed to process PCAP file');
    } finally {
      setIsLoading(false);
    }
  };

  // Transformation functions remain the same as previous implementation

  const transformAnomalies = (anomalies) => {
    if (!anomalies) return [];
    const threats = [];
    
    // SYN Flood threats
    if (anomalies.syn_flood?.threshold_exceeded?.length > 0) {
      anomalies.syn_flood.threshold_exceeded.forEach(ip => {
        threats.push({
          type: 'SYN Flood',
          message: `SYN Flood detected from ${ip} (${anomalies.syn_flood.counts[ip]} SYN packets)`,
          severity: 'high',
          source: 'anomalies',
          timestamp: new Date().toISOString(),
          source_ip: ip,
          details: anomalies.syn_flood
        });
      });
    }

    // Port Scan threats
    if (anomalies.port_scan?.threshold_exceeded?.length > 0) {
      anomalies.port_scan.threshold_exceeded.forEach(ip => {
        threats.push({
          type: 'Port Scan',
          message: `Port scan detected from ${ip} (${anomalies.port_scan.ports_scanned[ip]} ports scanned)`,
          severity: 'medium',
          source: 'anomalies',
          timestamp: new Date().toISOString(),
          source_ip: ip,
          details: anomalies.port_scan
        });
      });
    }

    // DNS Tunneling threats
    if (anomalies.dns_tunneling?.suspicious_queries?.length > 0) {
      anomalies.dns_tunneling.suspicious_queries.forEach(query => {
        threats.push({
          type: 'DNS Tunneling',
          message: `Suspicious DNS query: ${query}`,
          severity: 'medium',
          source: 'anomalies',
          timestamp: new Date().toISOString(),
          details: anomalies.dns_tunneling
        });
      });
    }

    // ARP Spoofing threats
    if (anomalies.arp_spoofing?.potential_spoofs?.length > 0) {
      anomalies.arp_spoofing.potential_spoofs.forEach(ip => {
        threats.push({
          type: 'ARP Spoofing',
          message: `ARP spoofing detected for IP ${ip}`,
          severity: 'critical',
          source: 'anomalies',
          timestamp: new Date().toISOString(),
          source_ip: ip,
          details: anomalies.arp_spoofing
        });
      });
    }

    return threats;
  };

  const transformBehavior = (behavior) => {
    if (!behavior) return [];
    const threats = [];
    
    // Timing anomalies
    if (behavior.timing_anomalies?.total_detected > 0) {
      threats.push({
        type: 'Timing Anomaly',
        message: `${behavior.timing_anomalies.total_detected} timing anomalies detected`,
        severity: 'medium',
        source: 'behavior',
        timestamp: new Date().toISOString(),
        details: behavior.timing_anomalies
      });
    }

    // Connection rate
    if (behavior.connection_rate?.threshold_exceeded) {
      threats.push({
        type: 'High Connection Rate',
        message: `Connection rate threshold exceeded (${behavior.connection_rate.current_rate} connections)`,
        severity: 'high',
        source: 'behavior',
        timestamp: new Date().toISOString(),
        details: behavior.connection_rate
      });
    }

    // Bandwidth
    if (behavior.bandwidth?.threshold_exceeded) {
      threats.push({
        type: 'High Bandwidth Usage',
        message: `Bandwidth threshold exceeded (${(behavior.bandwidth.bytes_consumed / 1e6).toFixed(2)} MB)`,
        severity: 'medium',
        source: 'behavior',
        timestamp: new Date().toISOString(),
        details: behavior.bandwidth
      });
    }

    return threats;
  };

  const transformFingerprints = (fingerprints) => {
    if (!fingerprints) return [];
    const threats = [];
    
    // TLS fingerprints
    if (fingerprints.tls_fingerprints?.ja3_hashes?.length > 0) {
      fingerprints.tls_fingerprints.ja3_hashes.forEach(hash => {
        threats.push({
          type: 'TLS Fingerprint',
          message: `JA3 hash detected: ${hash}`,
          severity: 'low',
          source: 'fingerprints',
          timestamp: new Date().toISOString(),
          details: fingerprints.tls_fingerprints
        });
      });
    }

    // HTTP fingerprints
    if (fingerprints.http_fingerprints?.user_agents?.length > 0) {
      fingerprints.http_fingerprints.user_agents.forEach(ua => {
        threats.push({
          type: 'HTTP Fingerprint',
          message: `User agent detected: ${ua}`,
          severity: 'low',
          source: 'fingerprints',
          timestamp: new Date().toISOString(),
          details: fingerprints.http_fingerprints
        });
      });
    }

    return threats;
  };

  const transformThreats = (threatsData) => {
    if (!threatsData) return [];
    const threats = [];
    
    // TOR traffic
    if (threatsData.tor_traffic?.detected) {
      threats.push({
        type: 'TOR Traffic',
        message: `TOR traffic detected (${threatsData.tor_traffic.packet_count} packets)`,
        severity: 'high',
        source: 'threats',
        timestamp: new Date().toISOString(),
        details: threatsData.tor_traffic
      });
    }

    // Metasploit
    if (threatsData.metasploit?.detected) {
      threats.push({
        type: 'Metasploit',
        message: `Metasploit traffic detected (${threatsData.metasploit.packet_count} packets)`,
        severity: 'critical',
        source: 'threats',
        timestamp: new Date().toISOString(),
        details: threatsData.metasploit
      });
    }

    // Cobalt Strike
    if (threatsData.cobalt_strike?.detected) {
      threats.push({
        type: 'Cobalt Strike',
        message: `Cobalt Strike traffic detected (${threatsData.cobalt_strike.packet_count} packets)`,
        severity: 'critical',
        source: 'threats',
        timestamp: new Date().toISOString(),
        details: threatsData.cobalt_strike
      });
    }

    return threats;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processPcapFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleCustomOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomOptions(prev => {
      if (name.startsWith('anomaliesParams.') || name.startsWith('behaviorParams.')) {
        const [paramType, paramKey] = name.split('.');
        return {
          ...prev,
          [paramType]: {
            ...prev[paramType],
            [paramKey]: type === 'checkbox' ? checked : Number(value)
          }
        };
      } else {
        return {
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        };
      }
    });
  };

  if (apiError) {
    return <div className="p-4 text-red-500">API Error: {apiError}</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Threat Intelligence</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4">
          {Object.entries({
            [TAB_OPTIONS.ANOMALIES]: 'Anomalies',
            [TAB_OPTIONS.BEHAVIOR]: 'Behavior',
            [TAB_OPTIONS.FINGERPRINTS]: 'Fingerprints',
            [TAB_OPTIONS.THREATS]: 'Known Threats',
            [TAB_OPTIONS.CUSTOM]: 'Custom Analysis'
          }).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Custom Analysis Options */}
      {activeTab === TAB_OPTIONS.CUSTOM && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Custom Analysis Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="runAnomalies"
                  name="runAnomalies"
                  checked={customOptions.runAnomalies}
                  onChange={handleCustomOptionChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="runAnomalies" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Detect Anomalies
                </label>
              </div>

              {customOptions.runAnomalies && (
                <div className="ml-6 space-y-2">
                  <div>
                    <label htmlFor="synThreshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      SYN Threshold
                    </label>
                    <input
                      type="number"
                      id="synThreshold"
                      name="anomaliesParams.synThreshold"
                      value={customOptions.anomaliesParams.synThreshold}
                      onChange={handleCustomOptionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="portThreshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Port Scan Threshold
                    </label>
                    <input
                      type="number"
                      id="portThreshold"
                      name="anomaliesParams.portThreshold"
                      value={customOptions.anomaliesParams.portThreshold}
                      onChange={handleCustomOptionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="runBehavior"
                  name="runBehavior"
                  checked={customOptions.runBehavior}
                  onChange={handleCustomOptionChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="runBehavior" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Detect Behavior
                </label>
              </div>

              {customOptions.runBehavior && (
                <div className="ml-6 space-y-2">
                  <div>
                    <label htmlFor="connLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Connection Limit
                    </label>
                    <input
                      type="number"
                      id="connLimit"
                      name="behaviorParams.connLimit"
                      value={customOptions.behaviorParams.connLimit}
                      onChange={handleCustomOptionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="window" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Time Window (seconds)
                    </label>
                    <input
                      type="number"
                      id="window"
                      name="behaviorParams.window"
                      value={customOptions.behaviorParams.window}
                      onChange={handleCustomOptionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="runFingerprints"
                name="runFingerprints"
                checked={customOptions.runFingerprints}
                onChange={handleCustomOptionChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="runFingerprints" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Detect Fingerprints
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="runThreats"
                name="runThreats"
                checked={customOptions.runThreats}
                onChange={handleCustomOptionChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="runThreats" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Detect Known Threats
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={handleUploadClick}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Upload PCAP for Analysis'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pcap,.pcapng"
          className="hidden"
          disabled={isLoading}
        />
      </div>
      
      <ThreatIntelSummary threats={threats} isLoading={isLoading} />
      
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : threats.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {threats.map((threat, index) => (
              <ThreatCard 
                key={`${threat.source}-${index}`} 
                threat={threat} 
                onClick={() => setSelectedThreat(threat)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            {threats.length === 0 && !isLoading && 'No threats detected. Upload a PCAP file to analyze.'}
          </div>
        )}
      </div>

      {selectedThreat && (
        <ThreatDetailsModal 
          threat={selectedThreat} 
          onClose={() => setSelectedThreat(null)}
        />
      )}
    </div>
  );
}

function ThreatCard({ threat, onClick }) {
  return (
    <div 
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900 dark:text-white">{threat.type || threat.source}</h3>
        <SeverityBadge severity={threat.severity || 'medium'} />
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {threat.message || threat.description || 'No description available'}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <ThreatTypeBadge type={threat.source} />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(threat.timestamp || Date.now()).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
