const request = require('supertest');
const express = require('express');
const errorHandler = require('../../middleware/errorHandler');
const AppError = require('../../utils/AppError');

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Test routes that throw different types of errors
  app.get('/app-error', (req, res, next) => {
    next(new AppError('Custom app error', 400));
  });
  
  app.get('/generic-error', (req, res, next) => {
    next(new Error('Generic error'));
  });
  
  app.get('/validation-error', (req, res, next) => {
    const error = new Error('Validation failed');
    error.name = 'ValidationError';
    error.errors = {
      name: { message: 'Name is required' },
      email: { message: 'Email is invalid' }
    };
    next(error);
  });
  
  app.get('/cast-error', (req, res, next) => {
    const error = new Error('Cast failed');
    error.name = 'CastError';
    error.path = '_id';
    error.value = 'invalid-id';
    next(error);
  });
  
  app.get('/duplicate-error', (req, res, next) => {
    const error = new Error('Duplicate key error');
    error.code = 11000;
    error.errmsg = 'duplicate key error: { email: "test@example.com" }';
    next(error);
  });
  
  app.use(errorHandler);
  return app;
};

describe('Error Handler Middleware', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
  });

  describe('Development Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should return detailed error information in development', async () => {
      const response = await request(app)
        .get('/app-error')
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Custom app error');
      expect(response.body.stack).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should handle generic errors in development', async () => {
      const response = await request(app)
        .get('/generic-error')
        .expect(500);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Generic error');
      expect(response.body.stack).toBeDefined();
    });
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should return minimal error information for operational errors', async () => {
      const response = await request(app)
        .get('/app-error')
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Custom app error');
      expect(response.body.stack).toBeUndefined();
      expect(response.body.error).toBeUndefined();
    });

    it('should return generic message for non-operational errors', async () => {
      const response = await request(app)
        .get('/generic-error')
        .expect(500);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Something went wrong!');
      expect(response.body.stack).toBeUndefined();
    });

    it('should handle validation errors', async () => {
      const response = await request(app)
        .get('/validation-error')
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Invalid input data');
      expect(response.body.message).toContain('Name is required');
      expect(response.body.message).toContain('Email is invalid');
    });

    it('should handle cast errors', async () => {
      const response = await request(app)
        .get('/cast-error')
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Invalid _id: invalid-id');
    });

    it('should handle duplicate field errors', async () => {
      const response = await request(app)
        .get('/duplicate-error')
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Duplicate field value');
    });
  });

  describe('AppError Class', () => {
    it('should create operational error with correct properties', () => {
      const error = new AppError('Test error', 400);
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('fail');
      expect(error.isOperational).toBe(true);
    });

    it('should set status to error for 5xx codes', () => {
      const error = new AppError('Server error', 500);
      
      expect(error.status).toBe('error');
    });

    it('should set status to fail for 4xx codes', () => {
      const error = new AppError('Client error', 404);
      
      expect(error.status).toBe('fail');
    });
  });
});