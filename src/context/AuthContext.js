import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// Simple authentication - in production, this should use a real backend
const VALID_USERS = {
  'admin': 'admin123',
  'user': 'password',
  'demo': 'demo123'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('moviehub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Validate credentials
    if (VALID_USERS[username] && VALID_USERS[username] === password) {
      const userData = { username, loginTime: new Date().toISOString() };
      setUser(userData);
      localStorage.setItem('moviehub_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('moviehub_user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

