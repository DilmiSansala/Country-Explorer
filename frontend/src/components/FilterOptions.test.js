// src/components/FilterOptions.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterOptions from './FilterOptions';

describe('FilterOptions Component', () => {
  test('calls onRegionChange with the selected region', () => {
    const mockOnRegionChange = jest.fn();
    render(<FilterOptions onRegionChange={mockOnRegionChange} />);
    
    // Get the select dropdown
    const selectElement = screen.getByRole('combobox');
    
    // Change the selection to Europe
    fireEvent.change(selectElement, { target: { value: 'Europe' } });
    
    // Check if onRegionChange was called with 'Europe'
    expect(mockOnRegionChange).toHaveBeenCalledWith('Europe');
  });
  
  test('calls onRegionChange with null when "All" is selected', () => {
    const mockOnRegionChange = jest.fn();
    render(<FilterOptions onRegionChange={mockOnRegionChange} />);
    
    // Get the select dropdown
    const selectElement = screen.getByRole('combobox');
    
    // Change the selection to All
    fireEvent.change(selectElement, { target: { value: 'All' } });
    
    // Check if onRegionChange was called with null
    expect(mockOnRegionChange).toHaveBeenCalledWith(null);
  });
});