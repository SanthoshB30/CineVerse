import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoHeader from '../components/LogoHeader';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Load background image from app settings
  useEffect(() => {
    console.log('🎬 SignUpPage mounted');
    console.log('📊 Current error state:', error);
    const bgImage = window.__CINEVERSE_BG_IMAGE__;
    if (bgImage) {
      setBackgroundImage(bgImage);
    }
  }, []);

  // Log when error changes
  useEffect(() => {
    if (error) {
      console.log('⚠️ Error state changed to:', error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Validate username
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
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

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Attempt signup
      console.log('🔵 Starting signup process...');
      const result = await signup(username, email, password);
      console.log('🔵 Signup result:', result);
      
      if (result.success) {
        console.log('✅ Signup successful, navigating to profile creation...');
        navigate('/create-profile');
      } else {
        console.error('❌ Signup failed:', result.error);
        setError(result.error || 'Sign up failed');
      }
    } catch (err) {
      console.error('❌ Signup error caught:', err);
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <LogoHeader />
        <div className="signup-headline-section">
          <h2 className="signup-headline">Unlimited movies.</h2>
          <p className="signup-tagline">Ready to enter the multiverse of movies?</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              minLength={3}
              maxLength={30}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-large"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Next'}
          </button>

          <div className="signin-section">
            <p className="signin-text">
              Already have an account? <Link to="/login" className="signin-link">Sign in</Link>
            </p>
          </div>
        </form>
      </div>

      <div 
        className="signup-background" 
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

export default SignUpPage;

