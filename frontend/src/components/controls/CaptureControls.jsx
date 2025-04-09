import React, { useState } from 'react';

const CaptureControls = ({ onStart, onStop, isCapturing }) => {
  const [interfaceName, setInterfaceName] = useState('Wi-Fi');

  const handleStart = () => {
    if (interfaceName.trim() !== '') {
      onStart(interfaceName);
    } else {
      alert('Please enter a valid interface name.');
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Capture Controls</h2>
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={interfaceName}
          onChange={(e) => setInterfaceName(e.target.value)}
          className="border px-2 py-1 rounded w-40"
          placeholder="e.g., Wi-Fi, eth0"
        />
        <button
          className={`px-4 py-2 text-white rounded ${
            isCapturing ? 'bg-red-500' : 'bg-green-500'
          }`}
          onClick={isCapturing ? onStop : handleStart}
        >
          {isCapturing ? 'Stop Capture' : 'Start Capture'}
        </button>
      </div>
    </div>
  );
};

export default CaptureControls;
