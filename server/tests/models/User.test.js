const User = require('../../models/User');
const mongoose = require('mongoose');

describe('User Model', () => {
  describe('Validation', () => {
    it('should create a valid user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.age).toBe(userData.age);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should require name field', async () => {
      const userData = {
        email: 'john@example.com',
        age: 30
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow('Name is required');
    });

    it('should require email field', async () => {
      const userData = {
        name: 'John Doe',
        age: 30
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow('Email is required');
    });

    it('should require age field', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow('Age is required');
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        age: 30
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow('Please provide a valid email address');
    });

    it('should validate name length', async () => {
      const userData = {
        name: 'J',
        email: 'john@example.com',
        age: 30
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow('Name must be at least 2 characters long');
    });

    it('should validate age range', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 0
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow('Age must be at least 1');
    });

    it('should enforce unique email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const user1 = new User(userData);
      await user1.save();

      const user2 = new User(userData);
      
      await expect(user2.save()).rejects.toThrow();
    });

    it('should convert email to lowercase', async () => {
      const userData = {
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        age: 30
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.email).toBe('john@example.com');
    });

    it('should trim whitespace from name and email', async () => {
      const userData = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        age: 30
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.name).toBe('John Doe');
      expect(savedUser.email).toBe('john@example.com');
    });
  });

  describe('Methods', () => {
    it('should find user by email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const user = new User(userData);
      await user.save();

      const foundUser = await User.findByEmail('john@example.com');
      expect(foundUser).toBeTruthy();
      expect(foundUser.email).toBe('john@example.com');
    });

    it('should find user by email case insensitive', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const user = new User(userData);
      await user.save();

      const foundUser = await User.findByEmail('JOHN@EXAMPLE.COM');
      expect(foundUser).toBeTruthy();
      expect(foundUser.email).toBe('john@example.com');
    });

    it('should return null for non-existent email', async () => {
      const foundUser = await User.findByEmail('nonexistent@example.com');
      expect(foundUser).toBeNull();
    });
  });

  describe('JSON transformation', () => {
    it('should exclude password and __v from JSON output', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        password: 'password123'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      const userJSON = savedUser.toJSON();

      expect(userJSON.password).toBeUndefined();
      expect(userJSON.__v).toBeUndefined();
      expect(userJSON.name).toBe('John Doe');
      expect(userJSON.email).toBe('john@example.com');
    });
  });
});