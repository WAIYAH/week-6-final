import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from '../../components/UserForm';

const mockOnSubmit = jest.fn();

describe('UserForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('age-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
      expect(screen.getByTestId('age-error')).toHaveTextContent('Age must be a positive number');
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByTestId('email-input');
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is invalid');
    });
  });

  it('validates name length', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByTestId('name-input');
    await user.type(nameInput, 'a');
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name must be at least 2 characters');
    });
  });

  it('validates age range', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    const ageInput = screen.getByTestId('age-input');
    await user.clear(ageInput);
    await user.type(ageInput, '200');
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('age-error')).toHaveTextContent('Age must be realistic');
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByTestId('name-input'), 'John Doe');
    await user.type(screen.getByTestId('email-input'), 'john@example.com');
    await user.clear(screen.getByTestId('age-input'));
    await user.type(screen.getByTestId('age-input'), '30');
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
    });
  });

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    // Trigger validation errors
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
    });
    
    // Start typing in name field
    const nameInput = screen.getByTestId('name-input');
    await user.type(nameInput, 'J');
    
    await waitFor(() => {
      expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
    });
  });

  it('disables form when loading', () => {
    render(<UserForm onSubmit={mockOnSubmit} loading={true} />);
    
    expect(screen.getByTestId('name-input')).toBeDisabled();
    expect(screen.getByTestId('email-input')).toBeDisabled();
    expect(screen.getByTestId('age-input')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Creating...');
  });

  it('populates form with initial data', () => {
    const initialData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 25
    };
    
    render(<UserForm onSubmit={mockOnSubmit} initialData={initialData} />);
    
    expect(screen.getByTestId('name-input')).toHaveValue('Jane Doe');
    expect(screen.getByTestId('email-input')).toHaveValue('jane@example.com');
    expect(screen.getByTestId('age-input')).toHaveValue(25);
  });
});