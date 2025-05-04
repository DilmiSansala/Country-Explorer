import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favoriteCountries, setFavoriteCountries] = useState([]);

  const fetchFavorites = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavoriteCountries(response.data.favoriteCountries || []);
      localStorage.setItem('favoriteCountries', JSON.stringify(response.data.favoriteCountries || []));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavoriteCountries([]);
      localStorage.setItem('favoriteCountries', JSON.stringify([]));
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && storedUser !== 'undefined' && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        fetchFavorites(token);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    const storedFavorites = localStorage.getItem('favoriteCountries');
    if (storedFavorites && storedFavorites !== 'undefined') {
      try {
        setFavoriteCountries(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Error parsing stored favorites:', e);
        localStorage.removeItem('favoriteCountries');
      }
    }
  }, []);

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
      localStorage.setItem('token', token);
      await fetchFavorites(token);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to the server. Please ensure the backend is running on http://localhost:5000';
      } else if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      return { success: false, error: errorMessage };
    }
  };

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
      await fetchFavorites(token);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to the server. Please ensure the backend is running on http://localhost:5000';
      } else if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setFavoriteCountries([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('favoriteCountries');
  };

  const toggleFavorite = async (countryCode) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, cannot toggle favorite');
      return;
    }

    try {
      if (favoriteCountries.includes(countryCode)) {
        await axios.delete(`http://localhost:5000/api/favorites/${countryCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(
          'http://localhost:5000/api/favorites',
          { countryCode },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      await fetchFavorites(token);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
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