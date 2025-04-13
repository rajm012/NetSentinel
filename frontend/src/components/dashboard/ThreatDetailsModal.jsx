import { useEffect } from 'react';
import { SeverityBadge, ThreatTypeBadge } from './ThreatBadges';

export default function ThreatDetailsModal({ threat, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!threat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{threat.type || threat.source}</h2>
              <div className="mt-1 flex space-x-2">
                <SeverityBadge severity={threat.severity || 'medium'} />
                <ThreatTypeBadge type={threat.source} />
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Description</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {threat.message || threat.description || 'No description available'}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Details</h3>
              <div className="mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                  {JSON.stringify(threat, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Detected: {new Date(threat.timestamp || Date.now()).toLocaleString()}</span>
              {threat.source_ip && <span>Source: {threat.source_ip}</span>}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
