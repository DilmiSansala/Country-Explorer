// src/pages/DetailPage.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '../contexts/SessionContext';
import DetailPage from './DetailPage';
import countriesService from '../services/api';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ code: 'USA' }),
}));

// Mock the API service
jest.mock('../services/api');

describe('DetailPage Integration', () => {
  beforeEach(() => {
    // Mock API responses
    countriesService.getCountryByCode.mockResolvedValue({
      cca3: 'USA',
      name: {
        common: 'United States',
        nativeName: {
          eng: {
            common: 'United States of America'
          }
        }
      },
      flags: {
        svg: 'usa-flag.svg',
        png: 'usa-flag.png'
      },
      capital: ['Washington D.C.'],
      population: 331002651,
      region: 'Americas',
      subregion: 'North America',
      tld: ['.us'],
      currencies: {
        USD: {
          name: 'United States Dollar',
          symbol: '$'
        }
      },
      languages: {
        eng: 'English'
      },
      borders: ['CAN', 'MEX']
    });

    // Mock border countries
    const mockBorderCountries = [
      {
        cca3: 'CAN',
        name: { common: 'Canada' },
        flags: { png: 'canada-flag.png' }
      },
      {
        cca3: 'MEX',
        name: { common: 'Mexico' },
        flags: { png: 'mexico-flag.png' }
      }
    ];

    // First call returns first border country, second call returns second border
    countriesService.getCountryByCode
      .mockResolvedValueOnce({
        cca3: 'USA',
        name: {
          common: 'United States',
          nativeName: {
            eng: {
              common: 'United States of America'
            }
          }
        },
        flags: {
          svg: 'usa-flag.svg',
          png: 'usa-flag.png'
        },
        capital: ['Washington D.C.'],
        population: 331002651,
        region: 'Americas',
        subregion: 'North America',
        tld: ['.us'],
        currencies: {
          USD: {
            name: 'United States Dollar',
            symbol: '$'
          }
        },
        languages: {
          eng: 'English'
        },
        borders: ['CAN', 'MEX']
      })
      .mockResolvedValueOnce(mockBorderCountries[0])
      .mockResolvedValueOnce(mockBorderCountries[1]);
  });

  test('renders country details and border countries', async () => {
    render(
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            <Route path="*" element={<DetailPage />} />
          </Routes>
        </SessionProvider>
      </BrowserRouter>
    );
    
    // Verify API was called with correct country code
    expect(countriesService.getCountryByCode).toHaveBeenCalledWith('USA');
    
    // Wait for country details to load
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText(/331,002,651/)).toBeInTheDocument();
      expect(screen.getByText('Americas')).toBeInTheDocument();
      expect(screen.getByText('Washington D.C.')).toBeInTheDocument();
      expect(screen.getByText('North America')).toBeInTheDocument();
      expect(screen.getByText('.us')).toBeInTheDocument();
      expect(screen.getByText(/United States Dollar/)).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });
    
    // Wait for border countries to load
    await waitFor(() => {
      expect(screen.getByText('Border Countries:')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });
  });
});