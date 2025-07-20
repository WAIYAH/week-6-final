const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');

describe('User Routes', () => {
  describe('GET /api/users', () => {
    it('should get all users', async () => {
      // Create test users
      const users = [
        { name: 'John Doe', email: 'john@example.com', age: 30 },
        { name: 'Jane Smith', email: 'jane@example.com', age: 25 }
      ];

      await User.insertMany(users);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.users).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.users[0].name).toBe('Jane Smith'); // Most recent first
    });

    it('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.users).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should support pagination', async () => {
      // Create 5 test users
      const users = Array.from({ length: 5 }, (_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + i
      }));

      await User.insertMany(users);

      const response = await request(app)
        .get('/api/users?page=1&limit=2')
        .expect(200);

      expect(response.body.users).toHaveLength(2);
      expect(response.body.currentPage).toBe('1');
      expect(response.body.totalPages).toBe(3);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
      await user.save();

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');
      expect(response.body.password).toBeUndefined();
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    it('should return 400 for invalid user id', async () => {
      const response = await request(app)
        .get('/api/users/invalid-id')
        .expect(400);

      expect(response.body.message).toContain('Invalid');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.age).toBe(userData.age);
      expect(response.body._id).toBeDefined();

      // Verify user was saved to database
      const savedUser = await User.findById(response.body._id);
      expect(savedUser).toBeTruthy();
    });

    it('should return 400 for invalid user data', async () => {
      const userData = {
        name: 'J', // Too short
        email: 'invalid-email',
        age: 0 // Too low
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('Name must be between 2 and 50 characters');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      // Create first user
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      expect(response.body.message).toBe('User with this email already exists');
    });

    it('should normalize email to lowercase', async () => {
      const userData = {
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        age: 30
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.email).toBe('john@example.com');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
      await user.save();

      const updateData = {
        name: 'John Smith',
        email: 'johnsmith@example.com',
        age: 31
      };

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(updateData.email);
      expect(response.body.age).toBe(updateData.age);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'John Smith',
        email: 'johnsmith@example.com',
        age: 31
      };

      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });

    it('should return 409 when updating to existing email', async () => {
      // Create two users
      const user1 = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
      await user1.save();

      const user2 = new User({
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25
      });
      await user2.save();

      // Try to update user2 with user1's email
      const updateData = {
        name: 'Jane Smith',
        email: 'john@example.com',
        age: 25
      };

      const response = await request(app)
        .put(`/api/users/${user2._id}`)
        .send(updateData)
        .expect(409);

      expect(response.body.message).toBe('User with this email already exists');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete an existing user', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
      await user.save();

      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body.message).toBe('User deleted successfully');

      // Verify user was deleted from database
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/users/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });
});