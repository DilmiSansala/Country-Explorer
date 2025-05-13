import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from '../contexts/SessionContext';

const CountryCard = ({ country }) => {
  const { isAuthenticated, isFavorite, toggleFavorite } = useContext(SessionContext);
  const [isHovered, setIsHovered] = useState(false);

    // Helper function to format population numbers with commas
  const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  // Function to get region-specific colors for styling
  const getRegionColors = (region) => {
    switch(region) {
      case 'Africa': return {
        gradient: 'from-amber-500 to-orange-600',
        light: 'from-amber-400/20 to-orange-500/20',
        border: 'border-amber-200',
        text: 'text-amber-700',
        accent: 'bg-amber-500'
      };
      case 'Americas': return {
        gradient: 'from-blue-500 to-indigo-600',
        light: 'from-blue-400/20 to-indigo-500/20',
        border: 'border-blue-200',
        text: 'text-blue-700',
        accent: 'bg-blue-500'
      };
      case 'Asia': return {
        gradient: 'from-red-500 to-rose-600',
        light: 'from-red-400/20 to-rose-500/20',
        border: 'border-red-200',
        text: 'text-red-700',
        accent: 'bg-red-500'
      };
      case 'Europe': return {
        gradient: 'from-emerald-500 to-teal-600',
        light: 'from-emerald-400/20 to-teal-500/20',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        accent: 'bg-emerald-500'
      };
      case 'Oceania': return {
        gradient: 'from-purple-500 to-violet-600',
        light: 'from-purple-400/20 to-violet-500/20',
        border: 'border-purple-200',
        text: 'text-purple-700',
        accent: 'bg-purple-500'
      };
      default: return {
        gradient: 'from-gray-500 to-slate-600',
        light: 'from-gray-400/20 to-slate-500/20',
        border: 'border-gray-200',
        text: 'text-gray-700',
        accent: 'bg-gray-500'
      };
    }
  };

  const regionColors = getRegionColors(country.region);

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 transform ${isHovered ? '-translate-y-2 shadow-xl' : ''} bg-white border ${regionColors.border}`}>
        {/* Flag Container */}
        <Link to={`/country/${country.cca3}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Background with subtle gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${regionColors.light}`}></div>
            
            {/* Flag Image */}
            <img 
              src={country.flags.png} 
              alt={`Flag of ${country.name.common}`} 
              className={`w-full h-full object-contain p-1 transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
            />
            
            {/* Region Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r ${regionColors.gradient} shadow-md`}>
                {country.region}
              </span>
            </div>
          </div>
        </Link>

        {/* Country Info Container */}
        <div className="p-4">
          {/* Country Name */}
          <Link to={`/country/${country.cca3}`} className="block mb-4">
            <h2 className={`text-xl font-bold tracking-tight ${regionColors.text} transition-colors duration-300 group-hover:text-opacity-90 line-clamp-1`}>
              {country.name.common}
            </h2>
          </Link>
          
          {/* Country Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 ${regionColors.accent} rounded-lg shadow-sm flex items-center justify-center text-white`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-2">
                <div className="text-xs text-gray-500 font-medium">Capital</div>
                <div className="text-sm text-gray-700 font-medium truncate max-w-[120px]">
                  {country.capital ? country.capital.join(', ') : 'N/A'}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className={`w-8 h-8 ${regionColors.accent} rounded-lg shadow-sm flex items-center justify-center text-white`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-2">
                <div className="text-xs text-gray-500 font-medium">Population</div>
                <div className="text-sm text-gray-700 font-medium truncate max-w-[120px]">
                  {formatPopulation(country.population)}
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Button */}
          {isAuthenticated && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(country.cca3);
              }}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                isFavorite(country.cca3)
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-md hover:shadow-rose-200/50'
                  : `bg-white border ${regionColors.border} ${regionColors.text} hover:bg-gray-50 hover:shadow-md`
              }`}
            >
              <svg 
                className={`h-4 w-4 mr-1.5 ${isFavorite(country.cca3) ? 'text-white' : regionColors.text}`} 
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
        
        {/* Bottom accent bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${regionColors.gradient}`}></div>
      </div>
    </div>
  );
};

export default CountryCard;