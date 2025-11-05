import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    // Attempt login
    const result = login(username, password);
    
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setPassword(''); // Clear password on error
    }
  };

  const handleDemoLogin = () => {
    setUsername('demo');
    setPassword('demo123');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-logo">🎬 CineVerse</h1>
          <p className="login-subtitle">Your Universe of Cinema</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-demo">
          <p className="demo-text">Try demo account:</p>
          <button 
            className="btn btn-secondary btn-block"
            onClick={handleDemoLogin}
            type="button"
          >
            Fill Demo Credentials
          </button>
          <div className="credentials-hint">
            <small>
              <strong>Demo accounts:</strong><br />
              admin/admin123 • user/password • demo/demo123
            </small>
          </div>
        </div>
      </div>

      <div className="login-background">
        <div className="background-overlay"></div>
      </div>
    </div>
  );
};

export default LoginPage;

