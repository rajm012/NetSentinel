export function SeverityBadge({ severity }) {
    const severityClasses = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
  
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${severityClasses[severity] || severityClasses.info}`}>
        {severity || 'info'}
      </span>
    );
  }
  
  export function ThreatTypeBadge({ type }) {
    const typeClasses = {
      alerts: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      behavior: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      known_threats: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      fingerprints: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    };
  
    const typeLabels = {
      alerts: 'Alert',
      behavior: 'Behavior',
      known_threats: 'Known Threat',
      fingerprints: 'Fingerprint'
    };
  
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${typeClasses[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
        {typeLabels[type] || type}
      </span>
    );
  }
  