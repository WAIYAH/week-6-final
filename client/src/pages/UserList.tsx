import React, { useState, useEffect } from 'react';
import { useError } from '../context/ErrorContext';
import { getUsers, deleteUser } from '../services/userService';
import UserCard from '../components/UserCard';

interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, setError, clearError } = useError();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      clearError();
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="container">
      <div className="header-section">
        <h1>Users</h1>
        <button 
          onClick={fetchUsers}
          className="btn btn-secondary"
          data-testid="refresh-button"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="text-center mt-3" data-testid="no-users-message">
          <p>No users found. Create your first user!</p>
        </div>
      ) : (
        <div className="grid grid-2 mt-3" data-testid="users-grid">
          {users.map(user => (
            <UserCard
              key={user._id}
              user={user}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;