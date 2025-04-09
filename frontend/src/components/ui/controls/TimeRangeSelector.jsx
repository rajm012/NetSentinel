// frontend/src/components/controls/TimeRangeSelector.js
import React, { useState } from 'react';

const TimeRangeSelector = ({ onRangeChange }) => {
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handlePredefinedRange = (minutes) => {
    const end = new Date();
    const start = new Date(end.getTime() - minutes * 60000);
    onRangeChange({ start: start.toISOString(), end: end.toISOString() });
  };

  const handleCustomSubmit = () => {
    if (customStart && customEnd) {
      onRangeChange({ start: customStart, end: customEnd });
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded mb-4">
      <h2 className="text-lg font-semibold mb-2">📅 Time Range</h2>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button onClick={() => handlePredefinedRange(15)} className="btn">Last 15 min</button>
        <button onClick={() => handlePredefinedRange(60)} className="btn">Last 1 hour</button>
        <button onClick={() => handlePredefinedRange(1440)} className="btn">Last 24 hours</button>
      </div>
      <div className="grid grid-cols-2 gap-2 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start:</label>
          <input
            type="datetime-local"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End:</label>
          <input
            type="datetime-local"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="input"
          />
        </div>
        <div className="col-span-2">
          <button onClick={handleCustomSubmit} className="btn w-full">Apply Custom Range</button>
        </div>
      </div>
    </div>
  );
};

export default TimeRangeSelector;
