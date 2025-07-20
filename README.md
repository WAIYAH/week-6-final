# Week 6: Testing and Debugging MERN Applications

A comprehensive MERN stack application demonstrating testing strategies, debugging techniques, and error handling best practices.

## 🚀 Features

- **Frontend Testing**: React components tested with Jest and React Testing Library
- **Backend Testing**: Express API endpoints tested with Jest and Supertest
- **Error Handling**: Global error middleware with custom error classes
- **Logging**: Winston-based logging system with file and console outputs
- **Validation**: Input validation and sanitization
- **Security**: Helmet, rate limiting, and CORS configuration

## 📁 Project Structure

```
week-6-final/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Header.tsx
│   │   │   ├── UserCard.tsx
│   │   │   ├── UserForm.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── UserList.tsx
│   │   │   └── CreateUser.tsx
│   │   ├── services/           # API service functions
│   │   │   └── userService.ts
│   │   ├── context/            # React context providers
│   │   │   └── ErrorContext.tsx
│   │   └── __tests__/          # Frontend tests
│   │       ├── components/
│   │       ├── pages/
│   │       └── services/
│   ├── jest.config.js          # Jest configuration
│   └── package.json
├── server/                     # Express backend
│   ├── models/                 # Mongoose models
│   │   └── User.js
│   ├── routes/                 # Express routes
│   │   └── users.js
│   ├── middleware/             # Custom middleware
│   │   └── errorHandler.js
│   ├── utils/                  # Utility functions
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │   └── logger.js
│   ├── tests/                  # Backend tests
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── setup.js
│   ├── logs/                   # Log files (auto-generated)
│   ├── jest.config.js          # Jest configuration
│   └── package.json
└── package.json                # Root package.json
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd week-6-final
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running locally or provide a MongoDB Atlas connection string

## 🚀 Running the Application

### Development Mode
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
npm run client    # Frontend only (http://localhost:3000)
npm run server    # Backend only (http://localhost:5000)
```

### Production Mode
```bash
npm run build     # Build frontend
npm start         # Start production server
```

## 🧪 Testing

### Run All Tests
```bash
npm test                    # Run all tests
npm run test:coverage       # Run tests with coverage report
```

### Frontend Tests Only
```bash
npm run test:client         # Run React tests
cd client && npm run test:watch  # Watch mode
```

### Backend Tests Only
```bash
npm run test:server         # Run API tests
cd server && npm run test:watch  # Watch mode
```

## 📊 Test Coverage

The project maintains **80%+ test coverage** across:

### Frontend Testing
- **Component Tests**: All React components tested for rendering and user interactions
- **Service Tests**: API service functions with mocked HTTP requests
- **Integration Tests**: User workflows and form submissions
- **Error Boundary Tests**: Error handling and recovery

### Backend Testing
- **Model Tests**: Mongoose model validation and methods
- **Route Tests**: API endpoints with various scenarios
- **Middleware Tests**: Error handling and validation middleware
- **Utility Tests**: Helper functions and custom classes

## 🔧 Testing Tools & Technologies

### Frontend
- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers

### Backend
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library
- **MongoDB Memory Server**: In-memory MongoDB for testing
- **Test Database**: Isolated test environment

## 🛡️ Error Handling & Debugging

### Error Handling Features
- **Global Error Middleware**: Centralized error processing
- **Custom Error Classes**: Operational vs programming errors
- **Validation Errors**: Input validation with express-validator
- **Database Errors**: MongoDB error handling and transformation
- **HTTP Error Responses**: Consistent error response format

### Logging System
- **Winston Logger**: Structured logging with multiple transports
- **Log Levels**: Error, warn, info, debug levels
- **File Logging**: Separate error and combined log files
- **Console Logging**: Development-friendly console output
- **Log Rotation**: Automatic log file rotation and cleanup

### Debugging Tools
- **Error Boundaries**: React error boundary components
- **Request Logging**: HTTP request/response logging
- **Development Tools**: Enhanced error messages in development
- **Health Check**: Server health monitoring endpoint

## 🔒 Security Features

- **Helmet**: Security headers middleware
- **Rate Limiting**: Request rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Server-side validation and sanitization
- **Error Information**: Secure error responses in production

## 📝 API Endpoints

### Users API
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /health` - Server health status

## 🎯 Testing Best Practices Implemented

1. **AAA Pattern**: Arrange, Act, Assert structure
2. **Descriptive Test Names**: Clear test descriptions
3. **Test Isolation**: Independent test cases
4. **Mock External Dependencies**: API calls and database operations
5. **Edge Case Testing**: Error conditions and boundary values
6. **Integration Testing**: End-to-end user workflows
7. **Test Data Management**: Proper setup and cleanup
8. **Coverage Goals**: Minimum 80% coverage requirement

## 🐛 Known Issues & Limitations

- **Test Database**: Requires MongoDB Memory Server for backend tests
- **File Uploads**: Not implemented in current version
- **Authentication**: Basic user model without JWT implementation
- **Real-time Features**: No WebSocket or real-time functionality
- **Caching**: No Redis or caching layer implemented

## 📚 Learning Outcomes

This project demonstrates:
- Comprehensive testing strategies for MERN applications
- Error handling and debugging best practices
- Test-driven development approach
- Production-ready logging and monitoring
- Security considerations for web applications
- Code organization and maintainability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This is an educational project for the PLP MERN Stack course Week 6 assignment focusing on testing and debugging practices.