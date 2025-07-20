import React, { useState } from 'react';
import { UserFormData } from '../pages/CreateUser';

interface UserFormProps {
  onSubmit: (userData: UserFormData) => void;
  loading?: boolean;
  initialData?: Partial<UserFormData>;
}

const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  loading = false, 
  initialData = {} 
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    age: initialData.age || 0,
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.age || formData.age < 1) {
      newErrors.age = 'Age must be a positive number';
    } else if (formData.age > 150) {
      newErrors.age = 'Age must be realistic';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof UserFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="user-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          data-testid="name-input"
          disabled={loading}
        />
        {errors.name && (
          <div className="error-message" data-testid="name-error">
            {errors.name}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          data-testid="email-input"
          disabled={loading}
        />
        {errors.email && (
          <div className="error-message" data-testid="email-error">
            {errors.email}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age || ''}
          onChange={handleChange}
          data-testid="age-input"
          disabled={loading}
          min="1"
          max="150"
        />
        {errors.age && (
          <div className="error-message" data-testid="age-error">
            {errors.age}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn"
        disabled={loading}
        data-testid="submit-button"
      >
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};

export default UserForm;