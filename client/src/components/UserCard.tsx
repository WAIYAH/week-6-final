import React from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
}

interface UserCardProps {
  user: User;
  onDelete: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="card" data-testid={`user-card-${user._id}`}>
      <h3 data-testid="user-name">{user.name}</h3>
      <p data-testid="user-email">
        <strong>Email:</strong> {user.email}
      </p>
      <p data-testid="user-age">
        <strong>Age:</strong> {user.age}
      </p>
      <p data-testid="user-created">
        <strong>Created:</strong> {formatDate(user.createdAt)}
      </p>
      <button
        onClick={() => onDelete(user._id)}
        className="btn btn-danger mt-2"
        data-testid="delete-button"
      >
        Delete
      </button>
    </div>
  );
};

export default UserCard;