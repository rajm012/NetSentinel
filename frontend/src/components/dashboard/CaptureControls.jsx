import { useState } from 'react'
import { Button, Select, Switch } from '@mui/material'

export default function CaptureControls({ 
  isCapturing, 
  onStart, 
  onStop, 
  viewMode, 
  onViewModeChange 
}) {
  const [interfaceName, setInterfaceName] = useState('Wi-Fi')
  const [filters, setFilters] = useState('')
  const [name, setName] = useState('')

  const handleStart = () => {
    onStart({
      iface: interfaceName,
      filters: filters.split(',').filter(f => f.trim()),
      name: name || undefined
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Interface
          </label>
          <Select
            native
            fullWidth
            size="small"
            value={interfaceName}
            onChange={(e) => setInterfaceName(e.target.value)}
            className="bg-white dark:bg-gray-700"
          > 
            <option value="any">Wi-Fi</option>
            <option value="eth0">eth0</option>
            <option value="wlan0">wlan0</option>
            <option value="lo">lo</option>
          </Select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            BPF Filters (comma separated)
          </label>
          <input
            type="text"
            value={filters}
            onChange={(e) => setFilters(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="tcp, port 80, ..."
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Capture Name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="My Capture"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {isCapturing ? (
            <Button 
              variant="contained" 
              color="error"
              onClick={onStop}
            >
              Stop Capture
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleStart}
            >
              Start Capture
            </Button>
          )}
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
              Packet View
            </span>
            <Switch
              checked={viewMode === 'flows'}
              onChange={() => onViewModeChange(viewMode === 'packets' ? 'flows' : 'packets')}
              color="primary"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Flow View
            </span>
          </div>
        </div>
        
        {isCapturing && (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Capturing...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
