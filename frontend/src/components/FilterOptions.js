// src/components/FilterOptions.js
import React from 'react';

const FilterOptions = ({ onRegionChange }) => {
  const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  return (
    <div className="mb-6">
      <select
        onChange={(e) => onRegionChange(e.target.value === 'All' ? null : e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {regions.map((region) => (
          <option key={region} value={region}>
            {region === 'All' ? 'Filter by Region' : region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterOptions;