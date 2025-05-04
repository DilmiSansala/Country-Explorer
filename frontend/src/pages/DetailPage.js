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
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500 flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading country details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-500 bg-red-50 p-6 rounded-lg shadow-md border border-red-100">
            <svg className="w-8 h-8 text-red-500 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
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

  // Create a pill component for consistent styling
  const InfoPill = ({ label, value }) => (
    <div className="flex items-center mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
      <div className="font-semibold text-gray-700 w-1/3">{label}:</div>
      <div className="text-gray-800 w-2/3">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link 
            to="/" 
            className="px-6 py-3 bg-white shadow-md rounded-md inline-flex items-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Back to All Countries</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 lg:p-12 flex items-center justify-center bg-gray-800">
              <div className="relative w-full h-full max-h-96 overflow-hidden rounded-lg shadow-2xl">
                <img 
                  src={country.flags.svg || country.flags.png} 
                  alt={`Flag of ${country.name.common}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-6 lg:p-12">
              <div className="flex justify-between items-start mb-8">
                <h1 className="text-4xl font-bold text-gray-800">{country.name.common}</h1>
                
                {isAuthenticated && (
                  <button
                    onClick={() => toggleFavorite(country.cca3)}
                    className={`px-4 py-2 rounded-full flex items-center ${
                      isFavorite(country.cca3) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors duration-200`}
                  >
                    <svg className="w-5 h-5 mr-1" fill={isFavorite(country.cca3) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    {isFavorite(country.cca3) ? 'Favorited' : 'Add to Favorites'}
                  </button>
                )}
              </div>

              {country.name.nativeName && (
                <div className="mb-6 text-lg text-gray-600">
                  Native name: {Object.values(country.name.nativeName)[0].common}
                </div>
              )}

              <div className="bg-blue-50 p-6 rounded-xl mb-10">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div className="text-2xl font-semibold text-gray-800">
                    Quick Facts
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoPill 
                    label="Population" 
                    value={formatNumber(country.population)} 
                  />
                  <InfoPill 
                    label="Region" 
                    value={country.region} 
                  />
                  <InfoPill 
                    label="Sub Region" 
                    value={country.subregion || 'N/A'} 
                  />
                  <InfoPill 
                    label="Capital" 
                    value={country.capital ? country.capital.join(', ') : 'N/A'} 
                  />
                  <InfoPill 
                    label="Top Level Domain" 
                    value={country.tld ? country.tld.join(', ') : 'N/A'} 
                  />
                  <InfoPill 
                    label="Currencies" 
                    value={getCurrencies()} 
                  />
                  <InfoPill 
                    label="Languages" 
                    value={getLanguages()} 
                  />
                  {country.area && (
                    <InfoPill 
                      label="Area" 
                      value={`${formatNumber(country.area)} km²`} 
                    />
                  )}
                </div>
              </div>

              {borderCountries.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Border Countries
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {borderCountries.map(border => (
                      <Link 
                        key={border.cca3} 
                        to={`/country/${border.cca3}`}
                        className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
                      >
                        <div className="w-12 h-8 mb-2 overflow-hidden rounded shadow-sm">
                          <img 
                            src={border.flags.png} 
                            alt={`Flag of ${border.name.common}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{border.name.common}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;