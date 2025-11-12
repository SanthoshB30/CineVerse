import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or sessionStorage)
    const savedUser = localStorage.getItem('cineverse_user') || sessionStorage.getItem('cineverse_user');
    const savedProfile = localStorage.getItem('cineverse_selected_profile') || sessionStorage.getItem('cineverse_selected_profile');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProfile) {
      setSelectedProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  const signup = (email, password) => {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
    
    if (existingUsers[email]) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const userData = {
      email,
      password, // In production, this should be hashed
      profiles: [],
      createdAt: new Date().toISOString()
    };

    // Save to "database" (localStorage)
    existingUsers[email] = userData;
    localStorage.setItem('cineverse_users', JSON.stringify(existingUsers));

    // Set as current user
    setUser(userData);
    sessionStorage.setItem('cineverse_user', JSON.stringify(userData));

    return { success: true, user: userData };
  };

  const login = (email, password, rememberMe = false) => {
    // Get all users from "database"
    const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
    
    // Check credentials
    const userData = existingUsers[email];
    if (!userData || userData.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Set current user
    setUser(userData);
    
    // Store based on remember me preference
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('cineverse_user', JSON.stringify(userData));

    return { success: true, user: userData };
  };

  const updateUserProfiles = (profiles) => {
    if (!user) return;

    const updatedUser = { ...user, profiles };
    setUser(updatedUser);

    // Update in storage
    const storage = localStorage.getItem('cineverse_user') ? localStorage : sessionStorage;
    storage.setItem('cineverse_user', JSON.stringify(updatedUser));

    // Update in "database"
    const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
    if (existingUsers[user.email]) {
      existingUsers[user.email] = updatedUser;
      localStorage.setItem('cineverse_users', JSON.stringify(existingUsers));
    }
  };

  const selectProfile = (profile) => {
    setSelectedProfile(profile);
    
    // Store selected profile
    const storage = localStorage.getItem('cineverse_user') ? localStorage : sessionStorage;
    storage.setItem('cineverse_selected_profile', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    setSelectedProfile(null);
    localStorage.removeItem('cineverse_user');
    localStorage.removeItem('cineverse_selected_profile');
    sessionStorage.removeItem('cineverse_user');
    sessionStorage.removeItem('cineverse_selected_profile');
  };

  const value = {
    user,
    selectedProfile,
    signup,
    login,
    logout,
    updateUserProfiles,
    selectProfile,
    loading,
    isAuthenticated: !!user && !!selectedProfile
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

