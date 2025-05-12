// src/components/CountryList.js
import React from 'react';
import CountryCard from './CountryCard';

const CountryList = ({ countries, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center p-8">
          <div className="inline-block animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
          <div className="text-xl text-gray-600 font-medium">Loading countries...</div>
          <p className="text-gray-500 mt-2">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-8 rounded-2xl max-w-md text-center shadow-lg">
          <svg className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 p-8 rounded-2xl max-w-md text-center shadow-lg">
          <svg className="w-12 h-12 text-indigo-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-bold mb-2">No countries found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {countries.map((country) => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </div>
  );
};

export default CountryList;