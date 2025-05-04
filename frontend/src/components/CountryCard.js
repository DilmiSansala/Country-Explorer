// src/components/CountryCard.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from '../contexts/SessionContext';

const CountryCard = ({ country }) => {
  const { isAuthenticated, isFavorite, toggleFavorite } = useContext(SessionContext);
  const [isHovered, setIsHovered] = useState(false);
  
  // Format population with commas
  const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get region-based gradient colors
  const getRegionColors = (region) => {
    switch(region) {
      case 'Africa':
        return 'from-amber-500 to-orange-500';
      case 'Americas':
        return 'from-blue-500 to-indigo-500';
      case 'Asia':
        return 'from-red-500 to-rose-500';
      case 'Europe':
        return 'from-emerald-500 to-teal-500';
      case 'Oceania':
        return 'from-purple-500 to-violet-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/country/${country.cca3}`} className="block relative">
        {/* Flag with overlay gradient */}
        <div className="h-48 overflow-hidden relative">
          <img 
            src={country.flags.png} 
            alt={`Flag of ${country.name.common}`} 
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-tr ${getRegionColors(country.region)} opacity-20`}></div>
          
          {/* Region badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${getRegionColors(country.region)}`}>
              {country.region}
            </span>
          </div>
        </div>
        
        {/* Country name with background blur for better readability */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white">{country.name.common}</h2>
        </div>
      </Link>
      
      {/* Country details */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-700">
              {country.capital ? country.capital.join(', ') : 'N/A'}
            </p>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-700">
              {formatPopulation(country.population)}
            </p>
          </div>
        </div>
        
        {isAuthenticated && (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(country.cca3);
            }}
            className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition-colors duration-300 ${
              isFavorite(country.cca3) 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 mr-2 ${isFavorite(country.cca3) ? 'text-white' : 'text-gray-700'}`} 
              fill={isFavorite(country.cca3) ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            {isFavorite(country.cca3) ? 'Remove Favorite' : 'Add to Favorites'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CountryCard;