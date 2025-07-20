import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useError } from '../context/ErrorContext';
import { createUser } from '../services/userService';
import UserForm from '../components/UserForm';

export interface UserFormData {
  name: string;
  email: string;
  age: number;
}

const CreateUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { error, setError, clearError } = useError();
  const navigate = useNavigate();

  const handleSubmit = async (userData: UserFormData) => {
    try {
      setLoading(true);
      clearError();
      await createUser(userData);
      navigate('/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Create New User</h1>
      
      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}

      <div className="card mt-3">
        <UserForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreateUser;