// src/components/CountryCard.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from '../contexts/SessionContext';

const CountryCard = ({ country }) => {
  const { isAuthenticated, isFavorite, toggleFavorite } = useContext(SessionContext);
  
  // Format population with commas
  const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link to={`/country/${country.cca3}`} className="block">
        <div className="h-40 overflow-hidden">
          <img 
            src={country.flags.png} 
            alt={`Flag of ${country.name.common}`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">{country.name.common}</h2>
          <div className="text-sm">
            <p><strong>Population:</strong> {formatPopulation(country.population)}</p>
            <p><strong>Region:</strong> {country.region}</p>
            <p><strong>Capital:</strong> {country.capital ? country.capital.join(', ') : 'N/A'}</p>
          </div>
        </div>
      </Link>
      
      {isAuthenticated && (
        <div className="px-4 pb-4">
          <button
            onClick={() => toggleFavorite(country.cca3)}
            className={`text-sm px-3 py-1 rounded-md ${
              isFavorite(country.cca3) 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isFavorite(country.cca3) ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CountryCard;
