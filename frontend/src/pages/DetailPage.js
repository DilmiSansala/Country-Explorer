// src/pages/DetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import countriesService from '../services/api';
import { SessionContext } from '../contexts/SessionContext';

const DetailPage = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  
  const { isAuthenticated, isFavorite, toggleFavorite } = useContext(SessionContext);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        const data = await countriesService.getCountryByCode(code);
        setCountry(data);
        
        // Fetch border countries if they exist
        if (data.borders && data.borders.length > 0) {
          const borderPromises = data.borders.map(border => 
            countriesService.getCountryByCode(border)
          );
          const borderData = await Promise.all(borderPromises);
          setBorderCountries(borderData);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch country details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [code]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">Loading country details...</div>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-500">
            {error || 'Country not found.'}
          </div>
        </div>
      </div>
    );
  }

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle languages (which could be an object)
  const getLanguages = () => {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
  };

  // Handle currencies (which could be an object)
  const getCurrencies = () => {
    if (!country.currencies) return 'N/A';
    return Object.values(country.currencies)
      .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
      .join(', ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to="/" 
          className="px-6 py-2 bg-white shadow-md rounded-md inline-flex items-center"
        >
          <span>← Back</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img 
            src={country.flags.svg || country.flags.png} 
            alt={`Flag of ${country.name.common}`} 
            className="w-full h-auto shadow-md"
          />
        </div>

        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-6">{country.name.common}</h1>
            
            {isAuthenticated && (
              <button
                onClick={() => toggleFavorite(country.cca3)}
                className={`px-4 py-2 rounded-md ${
                  isFavorite(country.cca3) 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isFavorite(country.cca3) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="mb-2"><strong>Native Name:</strong> {country.name.nativeName ? 
                Object.values(country.name.nativeName)[0].common : country.name.common}</p>
              <p className="mb-2"><strong>Population:</strong> {formatNumber(country.population)}</p>
              <p className="mb-2"><strong>Region:</strong> {country.region}</p>
              <p className="mb-2"><strong>Sub Region:</strong> {country.subregion || 'N/A'}</p>
              <p className="mb-2"><strong>Capital:</strong> {country.capital ? country.capital.join(', ') : 'N/A'}</p>
            </div>

            <div>
              <p className="mb-2"><strong>Top Level Domain:</strong> {country.tld ? country.tld.join(', ') : 'N/A'}</p>
              <p className="mb-2"><strong>Currencies:</strong> {getCurrencies()}</p>
              <p className="mb-2"><strong>Languages:</strong> {getLanguages()}</p>
            </div>
          </div>

          {borderCountries.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Border Countries:</h3>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map(border => (
                  <Link 
                    key={border.cca3} 
                    to={`/country/${border.cca3}`}
                    className="px-4 py-1 bg-white shadow-md rounded-sm text-sm"
                  >
                    {border.name.common}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
