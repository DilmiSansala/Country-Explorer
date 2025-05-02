// src/contexts/SessionContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Add axios for API calls

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favoriteCountries, setFavoriteCountries] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      const storedFavorites = localStorage.getItem('favoriteCountries');
      if (storedFavorites) {
        setFavoriteCountries(JSON.parse(storedFavorites));
      }
    }
  }, []);

  // Register function
  const register = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });
      const { user: userData, token } = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token); // Store the token for authenticated requests
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      const { user: userData, token } = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Toggle favorite country
  const toggleFavorite = (countryCode) => {
    setFavoriteCountries((prevFavorites) => {
      let newFavorites;
      if (prevFavorites.includes(countryCode)) {
        newFavorites = prevFavorites.filter((code) => code !== countryCode);
      } else {
        newFavorites = [...prevFavorites, countryCode];
      }
      localStorage.setItem('favoriteCountries', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (countryCode) => {
    return favoriteCountries.includes(countryCode);
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register, 
        favoriteCountries,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};