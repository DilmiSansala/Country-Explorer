// src/components/SearchBar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  test('calls onSearch with the entered text when form is submitted', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    // Get the input field and search button
    const input = screen.getByPlaceholderText('Search for a country...');
    const button = screen.getByRole('button');
    
    // Type in the search term
    fireEvent.change(input, { target: { value: 'Canada' } });
    
    // Submit the form
    fireEvent.click(button);
    
    // Check if onSearch was called with the correct value
    expect(mockOnSearch).toHaveBeenCalledWith('Canada');
  });
  
  test('does not call onSearch when form is submitted with empty input', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    // Get the search button
    const button = screen.getByRole('button');
    
    // Submit the form without entering any text
    fireEvent.click(button);
    
    // Check that onSearch was not called
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});