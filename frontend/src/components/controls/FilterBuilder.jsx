// frontend/src/components/controls/FilterBuilder.js
import React, { useState } from 'react';

const FilterBuilder = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    tcp: true,
    udp: false,
    dns: true,
    http: true,
    tls: false
  });

  const handleCheckboxChange = (protocol) => {
    const updated = { ...selectedFilters, [protocol]: !selectedFilters[protocol] };
    setSelectedFilters(updated);

    // Build BPF-style filter string (e.g., "tcp or dns or http")
    const filterString = Object.entries(updated)
      .filter(([, val]) => val)
      .map(([proto]) => proto)
      .join(' or ');

    onFilterChange(filterString);
  };

  return (
    <div className="bg-white p-4 shadow rounded mb-4">
      <h2 className="text-lg font-semibold mb-2">🔧 Protocol Filters</h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(selectedFilters).map(([protocol, checked]) => (
          <label key={protocol} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleCheckboxChange(protocol)}
              className="form-checkbox text-blue-500"
            />
            <span className="capitalize">{protocol}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterBuilder;
