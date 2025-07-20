import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container">
      <div className="text-center">
        <h1>Welcome to MERN Testing Application</h1>
        <p className="mt-3">
          This application demonstrates testing and debugging practices in a MERN stack application.
        </p>
        
        <div className="grid grid-2 mt-3">
          <div className="card">
            <h3>Frontend Testing</h3>
            <p>
              React components tested with Jest and React Testing Library.
              Includes unit tests, integration tests, and user interaction testing.
            </p>
          </div>
          
          <div className="card">
            <h3>Backend Testing</h3>
            <p>
              Express API endpoints tested with Jest and Supertest.
              Includes database testing with MongoDB Memory Server.
            </p>
          </div>
          
          <div className="card">
            <h3>Error Handling</h3>
            <p>
              Comprehensive error handling with custom error classes,
              global error middleware, and proper logging.
            </p>
          </div>
          
          <div className="card">
            <h3>Debugging Tools</h3>
            <p>
              Winston logging, error boundaries, and development tools
              for effective debugging and monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;