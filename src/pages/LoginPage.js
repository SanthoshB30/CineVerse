import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoHeader from '../components/LogoHeader';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Load background image from app settings
  useEffect(() => {
    const bgImage = window.__CINEVERSE_BG_IMAGE__;
    if (bgImage) {
      setBackgroundImage(bgImage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Attempt login
    const result = login(email, password, rememberMe);
    
    setLoading(false);
    
    if (result.success) {
      // Check if user has profiles, otherwise redirect to profile creation
      if (result.user.profiles && result.user.profiles.length > 0) {
        navigate('/select-profile');
      } else {
        navigate('/create-profile');
      }
    } else {
      setError(result.error);
      setPassword(''); // Clear password on error
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <LogoHeader subtitle="Your Universe of Cinema" />

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Password"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="login-options">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>

          <div className="remember-me">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <div className="signup-section">
            <p className="signup-text">New to CineVerse?</p>
            <Link to="/signup" className="signup-link">
              Sign up now
            </Link>
          </div>
        </form>
      </div>

      <div 
        className="login-background" 
        style={backgroundImage ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
      >
        <div className="background-overlay"></div>
      </div>
    </div>
  );
};

export default LoginPage;

