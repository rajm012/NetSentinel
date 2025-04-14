import { useState } from 'react';

const PacketGenerator = ({ onGenerate, isLoading }) => {
  const [trafficType, setTrafficType] = useState('normal');
  const [customConfig, setCustomConfig] = useState({
    duration: 30,
    packetsPerSecond: 100,
    protocols: {
      tcp: true,
      udp: true,
      icmp: false,
      http: true,
      https: true,
      dns: true
    },
    includeMalicious: false,
    maliciousType: 'scan'
  });

  const handleProtocolToggle = (protocol) => {
    setCustomConfig({
      ...customConfig,
      protocols: {
        ...customConfig.protocols,
        [protocol]: !customConfig.protocols[protocol]
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setCustomConfig({
        ...customConfig,
        [name]: checked
      });
    } else if (name === 'duration' || name === 'packetsPerSecond') {
      setCustomConfig({
        ...customConfig,
        [name]: parseInt(value) || 0
      });
    } else {
      setCustomConfig({
        ...customConfig,
        [name]: value
      });
    }
  };

  const handleGenerate = () => {
    // Prepare configuration based on selected traffic type
    let config;
    
    if (trafficType === 'normal') {
      config = {
        type: 'normal',
        duration: 30,
        packetsPerSecond: 100
      };
    } else if (trafficType === 'malicious') {
      config = {
        type: 'malicious',
        duration: 30,
        packetsPerSecond: 100,
        attackType: 'mixed'
      };
    } else if (trafficType === 'custom') {
      config = {
        type: 'custom',
        ...customConfig
      };
    }
    
    onGenerate(config);
  };

  const predefinedScenarios = [
    { id: 'normal', name: 'Normal Traffic', description: 'Generate typical network traffic with mixed protocols' },
    { id: 'malicious', name: 'Malicious Traffic', description: 'Generate traffic with common attack patterns' },
    { id: 'custom', name: 'Custom Configuration', description: 'Configure your own traffic parameters' }
  ];

  return (
    <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Traffic Generator</h2>
      <p className="text-gray-300 mb-6">
        Generate synthetic network traffic to test your detection system. 
        Choose from predefined scenarios or create your own custom traffic pattern.
      </p>

      <div className="mb-6">
        <h3 className="font-medium text-gray-300 mb-3">Choose Traffic Scenario:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predefinedScenarios.map(scenario => (
            <div 
              key={scenario.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                trafficType === scenario.id 
                  ? 'border-blue-500 bg-blue-900/30 text-blue-100' 
                  : 'border-gray-700 bg-gray-900 hover:bg-gray-700 text-gray-300'
              }`}
              onClick={() => setTrafficType(scenario.id)}
            >
              <h4 className="font-medium">{scenario.name}</h4>
              <p className="text-sm text-gray-400 mt-1">{scenario.description}</p>
            </div>
          ))}
        </div>
      </div>

      {trafficType === 'custom' && (
        <div className="bg-gray-900 p-4 rounded-lg mb-6 border border-gray-700">
          <h3 className="font-medium text-gray-300 mb-4">Custom Traffic Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={customConfig.duration}
                  onChange={handleInputChange}
                  min="5"
                  max="300"
                  className="bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Packets Per Second
                </label>
                <input
                  type="number"
                  name="packetsPerSecond"
                  value={customConfig.packetsPerSecond}
                  onChange={handleInputChange}
                  min="10"
                  max="10000"
                  className="bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Include Malicious Traffic
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeMalicious"
                    checked={customConfig.includeMalicious}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-800"
                  />
                  <span className="ml-2 text-sm text-gray-400">Add attack patterns to the traffic</span>
                </div>
              </div>

              {customConfig.includeMalicious && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Attack Type
                  </label>
                  <select
                    name="maliciousType"
                    value={customConfig.maliciousType}
                    onChange={handleInputChange}
                    className="bg-gray-800 text-gray-100 border-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-md"
                  >
                    <option value="scan">Port Scan</option>
                    <option value="dos">DoS Simulation</option>
                    <option value="bruteforce">Brute Force Attempt</option>
                    <option value="injection">SQL Injection Patterns</option>
                    <option value="mixed">Mixed Attacks</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Protocols to Include
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(customConfig.protocols).map(protocol => (
                  <div key={protocol} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`protocol-${protocol}`}
                      checked={customConfig.protocols[protocol]}
                      onChange={() => handleProtocolToggle(protocol)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-800"
                    />
                    <label htmlFor={`protocol-${protocol}`} className="ml-2 text-sm text-gray-300 uppercase">
                      {protocol}
                    </label>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">Select at least one protocol</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || (trafficType === 'custom' && !Object.values(customConfig.protocols).some(v => v))}
          className={`px-5 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 ${
            isLoading || (trafficType === 'custom' && !Object.values(customConfig.protocols).some(v => v)) 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Traffic'}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-300 mb-2">Notes:</h3>
        <ul className="list-disc pl-5 text-gray-400 text-sm">
          <li>Generated traffic only exists for testing purposes</li>
          <li>No actual network connections will be created</li>
          <li>Traffic simulation may take up to 60 seconds to process</li>
          <li>Higher packet rates will increase processing time</li>
        </ul>
      </div>
    </div>
  );
};

export default PacketGenerator;
