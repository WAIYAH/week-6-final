import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to MERN Testing Application')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Home />);
    expect(screen.getByText(/This application demonstrates testing and debugging practices/)).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<Home />);
    
    expect(screen.getByText('Frontend Testing')).toBeInTheDocument();
    expect(screen.getByText('Backend Testing')).toBeInTheDocument();
    expect(screen.getByText('Error Handling')).toBeInTheDocument();
    expect(screen.getByText('Debugging Tools')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<Home />);
    
    expect(screen.getByText(/React components tested with Jest/)).toBeInTheDocument();
    expect(screen.getByText(/Express API endpoints tested/)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive error handling/)).toBeInTheDocument();
    expect(screen.getByText(/Winston logging, error boundaries/)).toBeInTheDocument();
  });

  it('has proper structure with grid layout', () => {
    render(<Home />);
    
    const gridContainer = screen.getByText('Frontend Testing').closest('.grid');
    expect(gridContainer).toHaveClass('grid', 'grid-2');
  });
});