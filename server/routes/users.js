const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Validation rules
const userValidationRules = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('age')
      .isInt({ min: 1, max: 150 })
      .withMessage('Age must be between 1 and 150')
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  next();
};

// GET /api/users - Get all users
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
  
  const users = await User.find()
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-password');

  const total = await User.countDocuments();
  
  logger.info(`Retrieved ${users.length} users`);
  
  res.json({
    users,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  logger.info(`Retrieved user: ${user.email}`);
  res.json(user);
}));

// POST /api/users - Create new user
router.post('/', userValidationRules(), validate, asyncHandler(async (req, res, next) => {
  const { name, email, age } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('User with this email already exists', 409));
  }
  
  const user = new User({ name, email, age });
  await user.save();
  
  logger.info(`Created new user: ${user.email}`);
  res.status(201).json(user);
}));

// PUT /api/users/:id - Update user
router.put('/:id', userValidationRules(), validate, asyncHandler(async (req, res, next) => {
  const { name, email, age } = req.body;
  
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Check if email is being changed and if it's already taken
  if (email !== user.email) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('User with this email already exists', 409));
    }
  }
  
  user.name = name;
  user.email = email;
  user.age = age;
  
  await user.save();
  
  logger.info(`Updated user: ${user.email}`);
  res.json(user);
}));

// DELETE /api/users/:id - Delete user
router.delete('/:id', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  await User.findByIdAndDelete(req.params.id);
  
  logger.info(`Deleted user: ${user.email}`);
  res.json({ message: 'User deleted successfully' });
}));

module.exports = router;