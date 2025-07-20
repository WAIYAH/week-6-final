import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import UserList from './pages/UserList';
import CreateUser from './pages/CreateUser';
import { ErrorProvider } from './context/ErrorContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/create-user" element={<CreateUser />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </ErrorProvider>
  );
}

export default App;