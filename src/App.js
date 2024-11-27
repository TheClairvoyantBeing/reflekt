// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './component/Dashboard'; // Import the Dashboard component
import Entry from './entry/Entry';
import Entries from './entries/Entries';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // React Router hook for navigation

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (username === '22a43.evion@sjec.ac.in' && password === '2004') {
      setIsLoggedIn(true);
      navigate('/dashboard'); // Redirect to the dashboard page after successful login
    }
  };

  const handleSignUp = () => {
    alert('Sign up functionality not implemented yet!');
  };

  const handleOptionChange = (option) => {
    setIsLogin(option === 'login');
  };

  if (isLoggedIn) {
    return <div>Welcome, you are now logged in!</div>;
  }

  return (
    <div className="App">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <div>
            <button type="button" onClick={handleLogin}>Login</button>
            <button type="button" onClick={handleSignUp}>Sign Up</button>
          </div>
          <div>
            <input
              type="radio"
              name="option"
              value="login"
              checked={isLogin}
              onChange={() => handleOptionChange('login')}
            />
            <label>Login</label>
            <input
              type="radio"
              name="option"
              value="signup"
              checked={!isLogin}
              onChange={() => handleOptionChange('signup')}
            />
            <label>Sign Up</label>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/entries" element={<Entries />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
