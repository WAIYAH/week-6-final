import axios from 'axios';
import { getUsers, createUser, deleteUser, getUserById } from '../../services/userService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [
        { _id: '1', name: 'John', email: 'john@example.com', age: 30 }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: mockUsers });

      const result = await getUsers();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });

    it('should handle errors when fetching users', async () => {
      const errorMessage = 'Network error';
      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

      await expect(getUsers()).rejects.toThrow(errorMessage);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = { name: 'John', email: 'john@example.com', age: 30 };
      const mockResponse = { _id: '1', ...userData };
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await createUser(userData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', userData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating user', async () => {
      const userData = { name: 'John', email: 'john@example.com', age: 30 };
      const errorMessage = 'Validation error';
      mockAxiosInstance.post.mockRejectedValue(new Error(errorMessage));

      await expect(createUser(userData)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = '123';
      const mockResponse = { message: 'User deleted successfully' };
      mockAxiosInstance.delete.mockResolvedValue({ data: mockResponse });

      const result = await deleteUser(userId);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when deleting user', async () => {
      const userId = '123';
      const errorMessage = 'User not found';
      mockAxiosInstance.delete.mockRejectedValue(new Error(errorMessage));

      await expect(deleteUser(userId)).rejects.toThrow(errorMessage);
    });
  });

  describe('getUserById', () => {
    it('should fetch user by id successfully', async () => {
      const userId = '123';
      const mockUser = { _id: userId, name: 'John', email: 'john@example.com', age: 30 };
      mockAxiosInstance.get.mockResolvedValue({ data: mockUser });

      const result = await getUserById(userId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockUser);
    });

    it('should handle errors when fetching user by id', async () => {
      const userId = '123';
      const errorMessage = 'User not found';
      mockAxiosInstance.get.mockRejectedValue(new Error(errorMessage));

      await expect(getUserById(userId)).rejects.toThrow(errorMessage);
    });
  });
});