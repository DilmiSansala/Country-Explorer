// src/pages/HomePage.js
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

  // Fetch all countries on component mount
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

  // Handle region filter change
  const handleRegionChange = async (region) => {
    setSelectedRegion(region);
    setShowFavorites(false);
    
    if (!region) {
      // If "All" is selected, show all countries
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

  // Handle search
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

  // Handle showing favorites
  const handleToggleFavorites = () => {
    if (showFavorites) {
      // If already showing favorites, go back to all countries or previous filter
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div className="mb-4 md:mb-0 md:w-1/2">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <FilterOptions onRegionChange={handleRegionChange} />
          
          {isAuthenticated && (
            <button
              onClick={handleToggleFavorites}
              className={`px-4 py-2 rounded-md ${
                showFavorites 
                  ? 'bg-red-500 text-white' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {showFavorites ? 'Show All Countries' : 'Show Favorites'}
            </button>
          )}
        </div>
      </div>

      <CountryList 
        countries={filteredCountries} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};

export default HomePage;