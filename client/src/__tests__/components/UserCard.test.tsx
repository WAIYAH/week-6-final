import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from '../../components/UserCard';

const mockUser = {
  _id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  createdAt: '2023-01-01T00:00:00.000Z'
};

const mockOnDelete = jest.fn();

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: mockConfirm,
});

describe('UserCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);
    
    expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
    expect(screen.getByTestId('user-age')).toHaveTextContent('30');
    expect(screen.getByTestId('user-created')).toHaveTextContent('1/1/2023');
  });

  it('calls onDelete when delete button is clicked and confirmed', () => {
    mockConfirm.mockReturnValue(true);
    
    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this user?');
    expect(mockOnDelete).toHaveBeenCalledWith('123');
  });

  it('does not call onDelete when delete is cancelled', () => {
    mockConfirm.mockReturnValue(false);
    
    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('formats date correctly', () => {
    const userWithDifferentDate = {
      ...mockUser,
      createdAt: '2023-12-25T15:30:00.000Z'
    };
    
    render(<UserCard user={userWithDifferentDate} onDelete={mockOnDelete} />);
    
    expect(screen.getByTestId('user-created')).toHaveTextContent('12/25/2023');
  });

  it('has correct test ids for all elements', () => {
    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);
    
    expect(screen.getByTestId(`user-card-${mockUser._id}`)).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toBeInTheDocument();
    expect(screen.getByTestId('user-email')).toBeInTheDocument();
    expect(screen.getByTestId('user-age')).toBeInTheDocument();
    expect(screen.getByTestId('user-created')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });
});