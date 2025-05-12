// src/components/FilterOptions.js
import React from 'react';

const FilterOptions = ({ onRegionChange }) => {
  const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg 
          className="h-5 w-5 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
          />
        </svg>
      </div>
      <select
        onChange={(e) => onRegionChange(e.target.value === 'All' ? null : e.target.value)}
        className="appearance-none pl-12 px-4 py-3 bg-white border border-gray-200 rounded-xl w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer shadow-sm transition-all duration-300"
      >
        {regions.map((region) => (
          <option key={region} value={region}>
            {region === 'All' ? 'Filter by Region' : region}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default FilterOptions;