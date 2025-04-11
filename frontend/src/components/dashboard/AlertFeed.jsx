import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'

export default function AlertFeed({ alerts }) {
  const [localAlerts, setLocalAlerts] = useState([])
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      setLocalAlerts(prev => [...alerts, ...prev].slice(0, 50))
      
      // Show notification for new high severity alerts
      alerts.forEach(alert => {
        if (alert.severity === 'high' || alert.severity === 'critical') {
          enqueueSnackbar(`${alert.type}: ${alert.message}`, { 
            variant: alert.severity === 'critical' ? 'error' : 'warning',
            autoHideDuration: 5000
          })
        }
      })
    }
  }, [alerts, enqueueSnackbar])

  const getAlertColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 dark:bg-red-900'
      case 'high': return 'bg-orange-100 dark:bg-orange-900'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900'
      case 'low': return 'bg-blue-100 dark:bg-blue-900'
      default: return 'bg-gray-100 dark:bg-gray-700'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">Alerts</h3>
      </div>
      <div className="overflow-y-auto max-h-64">
        {localAlerts.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No alerts to display
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {localAlerts.map((alert, index) => (
              <li key={index} className={`p-3 ${getAlertColor(alert.severity)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{alert.type}</p>
                    <p className="text-xs">{alert.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs capitalize">{alert.severity}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}