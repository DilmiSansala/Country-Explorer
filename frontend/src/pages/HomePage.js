import React, { useState, useEffect, useContext } from 'react';
import SearchBar from '../components/SearchBar';
import FilterOptions from '../components/FilterOptions';
import CountryList from '../components/CountryList';
import countriesService from '../services/api';
import { SessionContext } from '../contexts/SessionContext';

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isAuthenticated, favoriteCountries } = useContext(SessionContext);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await countriesService.getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch countries. Please try again later.');
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleRegionChange = async (region) => {
    setSelectedRegion(region);
    setShowFavorites(false);
    
    if (!region) {
      setFilteredCountries(countries);
      return;
    }
    
    try {
      setLoading(true);
      const data = await countriesService.getCountriesByRegion(region);
      setFilteredCountries(data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch countries in ${region}. Please try again later.`);
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    setShowFavorites(false);
    
    try {
      setLoading(true);
      if (term.trim() === '') {
        setFilteredCountries(countries);
      } else {
        const data = await countriesService.getCountryByName(term);
        setFilteredCountries(data);
      }
      setLoading(false);
    } catch (err) {
      setError('No countries found with that name.');
      setFilteredCountries([]);
      setLoading(false);
    }
  };

  const handleToggleFavorites = () => {
    if (showFavorites) {
      if (selectedRegion) {
        handleRegionChange(selectedRegion);
      } else if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setFilteredCountries(countries);
      }
      setShowFavorites(false);
    } else {
       // Filter to show only favorite countries
      const favorites = countries.filter(country => 
        favoriteCountries.includes(country.cca3)
      );
      setFilteredCountries(favorites);
      setShowFavorites(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="w-full py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-4">
              Discover the World
            </h1>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-rose-400 via-amber-400 to-teal-400 rounded-full mb-6"></div>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Explore countries, learn about their cultures, and save your favorites
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 mb-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
              <div className="w-full md:w-1/2">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <FilterOptions onRegionChange={handleRegionChange} />
                {isAuthenticated && (
                  <button
                    onClick={handleToggleFavorites}
                    className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                      showFavorites
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-rose-500/30'
                        : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:shadow-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center">
                      <svg 
                        className="h-5 w-5 mr-2" 
                        fill={showFavorites ? "currentColor" : "none"} 
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
                      {showFavorites ? 'All Countries' : 'My Favorites'}
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          <CountryList 
            countries={filteredCountries} 
            loading={loading} 
            error={error} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;