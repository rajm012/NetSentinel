import React from 'react';
import { FlagIcon, GlobeAltIcon, ShieldExclamationIcon, CodeIcon, CubeIcon } from '@heroicons/react/outline';

const PacketDetailPage = ({ packet }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Packet Inspection: {packet.id}
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            packet.threatLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
            packet.threatLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}>
            {packet.threatLevel} risk
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Captured at {new Date(packet.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Left Column - Overview */}
        <div className="md:col-span-1 space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="flex items-center text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              <CubeIcon className="h-5 w-5 mr-2 text-blue-500" />
              Packet Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Protocol:</span>
                <span className="font-mono">{packet.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Length:</span>
                <span className="font-mono">{packet.length} bytes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Source:</span>
                <span className="font-mono">{packet.sourceIp}:{packet.sourcePort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Destination:</span>
                <span className="font-mono">{packet.destinationIp}:{packet.destinationPort}</span>
              </div>
            </div>
          </div>

          {/* Threat Info */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="flex items-center text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              <ShieldExclamationIcon className="h-5 w-5 mr-2 text-red-500" />
              Threat Analysis
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</h4>
                <p className="text-sm text-gray-800 dark:text-gray-200">{packet.threatType}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Anomalies Detected:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                  {packet.anomalies.map((anomaly, index) => (
                    <li key={index} className="text-gray-800 dark:text-gray-200">{anomaly}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Geo Info */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="flex items-center text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-green-500" />
              Geographic Data
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Source:</h4>
                <p className="text-sm">
                  {packet.geoData.source.city}, {packet.geoData.source.country}<br />
                  <span className="text-gray-500 dark:text-gray-400">{packet.geoData.source.isp}</span>
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Destination:</h4>
                <p className="text-sm">
                  {packet.geoData.destination.city}, {packet.geoData.destination.country}<br />
                  <span className="text-gray-500 dark:text-gray-400">{packet.geoData.destination.isp}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Packet Layers */}
        <div className="md:col-span-2 space-y-6">
          {/* Layer Navigation */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {Object.keys(packet.layers).map((layer) => (
              <button
                key={layer}
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
              >
                {layer.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Layer Details */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="flex items-center text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              <CodeIcon className="h-5 w-5 mr-2 text-purple-500" />
              Protocol Layers
            </h3>
            <div className="space-y-4">
              {Object.entries(packet.layers).map(([layerName, layerData]) => (
                <div key={layerName} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-0 last:pb-0">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{layerName.toUpperCase()}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(layerData).map(([field, value]) => (
                      <div key={field} className="col-span-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{field}:</span>
                        <div className="font-mono text-sm break-all">
                          {typeof value === 'object' ? JSON.stringify(value) : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Hex */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="flex items-center text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              <FlagIcon className="h-5 w-5 mr-2 text-orange-500" />
              Raw Packet Data
            </h3>
            <div className="bg-black text-green-400 font-mono text-xs p-3 rounded overflow-x-auto">
              <pre>{packet.rawHex.match(/.{1,32}/g).join('\n')}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
          Export PCAP
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Create Alert Rule
        </button>
      </div>
    </div>
  );
};

export default PacketDetailPage;
