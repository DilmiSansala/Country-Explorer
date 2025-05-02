// src/pages/HomePage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from '../contexts/SessionContext';
import HomePage from './HomePage';
import countriesService from '../services/api';

// Mock the API service
jest.mock('../services/api');

describe('HomePage Integration', () => {
  beforeEach(() => {
    // Mock API responses
    countriesService.getAllCountries.mockResolvedValue([
      {
        cca3: 'USA',
        name: { common: 'United States' },
        flags: { png: 'usa-flag.png' },
        capital: ['Washington D.C.'],
        population: 331002651,
        region: 'Americas'
      },
      {
        cca3: 'CAN',
        name: { common: 'Canada' },
        flags: { png: 'canada-flag.png' },
        capital: ['Ottawa'],
        population: 38005238,
        region: 'Americas'
      },
      {
        cca3: 'FRA',
        name: { common: 'France' },
        flags: { png: 'france-flag.png' },
        capital: ['Paris'],
        population: 67391582,
        region: 'Europe'
      }
    ]);
    
    countriesService.getCountryByName.mockResolvedValue([
      {
        cca3: 'CAN',
        name: { common: 'Canada' },
        flags: { png: 'canada-flag.png' },
        capital: ['Ottawa'],
        population: 38005238,
        region: 'Americas'
      }
    ]);
    
    countriesService.getCountriesByRegion.mockImplementation((region) => {
      if (region === 'Europe') {
        return Promise.resolve([
          {
            cca3: 'FRA',
            name: { common: 'France' },
            flags: { png: 'france-flag.png' },
            capital: ['Paris'],
            population: 67391582,
            region: 'Europe'
          }
        ]);
      }
      return Promise.resolve([]);
    });
  });

  test('displays countries and filters them when search is performed', async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <HomePage />
        </SessionProvider>
      </BrowserRouter>
    );
    
    // Verify API was called
    expect(countriesService.getAllCountries).toHaveBeenCalled();
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('France')).toBeInTheDocument();
    });
    
    // Find search input and button
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    // Perform search
    fireEvent.change(searchInput, { target: { value: 'Canada' } });
    fireEvent.click(searchButton);
    
    // Verify search API was called
    expect(countriesService.getCountryByName).toHaveBeenCalledWith('Canada');
    
    // Wait for filtered results
    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.queryByText('France')).not.toBeInTheDocument();
    });
  });

  test('filters countries by region', async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <HomePage />
        </SessionProvider>
      </BrowserRouter>
    );
    
    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
    
    // Find region filter dropdown
    const regionSelect = screen.getByRole('combobox');
    
    // Select Europe region
    fireEvent.change(regionSelect, { target: { value: 'Europe' } });
    
    // Verify region API was called
    expect(countriesService.getCountriesByRegion).toHaveBeenCalledWith('Europe');
    
    // Wait for filtered results
    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.queryByText('Canada')).not.toBeInTheDocument();
      expect(screen.getByText('France')).toBeInTheDocument();
    });
  });
});