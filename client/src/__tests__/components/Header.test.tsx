import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('renders the application title', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('MERN Testing App')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Create User')).toBeInTheDocument();
  });

  it('has correct href attributes for navigation links', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Users').closest('a')).toHaveAttribute('href', '/users');
    expect(screen.getByText('Create User').closest('a')).toHaveAttribute('href', '/create-user');
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('header');
    
    const logo = screen.getByText('MERN Testing App').closest('a');
    expect(logo).toHaveClass('logo');
  });
});