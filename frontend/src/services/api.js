// src/services/api.js
import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

// Service object to handle all API calls
const countriesService = {
  // Get all countries
  getAllCountries: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all countries:', error);
      throw error;
    }
  },
 
  // Search countries by name
  getCountryByName: async (name) => {
    try {
      const response = await axios.get(`${BASE_URL}/name/${name}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country by name "${name}":`, error);
      if (error.response && error.response.status === 404) {
        return []; // Return empty array if country not found
      }
      throw error;
    }
  },

  // Get countries by region
  getCountriesByRegion: async (region) => {
    try {
      const response = await axios.get(`${BASE_URL}/region/${region}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching countries in region "${region}":`, error);
      throw error;
    }
  },

  // Get country details by code
  getCountryByCode: async (code) => {
    try {
      const response = await axios.get(`${BASE_URL}/alpha/${code}`);
      return response.data[0];
    } catch (error) {
      console.error(`Error fetching country with code "${code}":`, error);
      throw error;
    }
  }
};

export default countriesService;