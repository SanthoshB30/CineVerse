import React, { createContext, useState, useContext, useEffect } from 'react';
import { signUpUser, signInUser, updateUserProfiles as updateProfilesAPI } from '../api/auth';
import { setProfileTraits, clearPersonalizeTraits } from '../personalize/personalizeHelpers';

const AuthContext = createContext(null);

// Check if Contentstack is configured
const isContentstackConfigured = () => {
  return !!(
    process.env.REACT_APP_CONTENTSTACK_API_KEY &&
    process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useContentstack, setUseContentstack] = useState(false);

  useEffect(() => {
    const csConfigured = isContentstackConfigured();
    setUseContentstack(csConfigured);
    
    const savedUser = localStorage.getItem('cineverse_user') || sessionStorage.getItem('cineverse_user');
    const savedProfile = localStorage.getItem('cineverse_selected_profile') || sessionStorage.getItem('cineverse_selected_profile');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setSelectedProfile(parsedProfile);
      
      setTimeout(() => {
        const savedUser = localStorage.getItem('cineverse_user') || sessionStorage.getItem('cineverse_user');
        const parsedUser = savedUser ? JSON.parse(savedUser) : null;
        setProfileTraits(parsedProfile, parsedUser);
      }, 100);
    }
    setLoading(false);
  }, []);

  // LOCAL STORAGE FALLBACK FUNCTIONS
  const signupLocal = (username, email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
    
    if (existingUsers[email]) {
      return { success: false, error: 'Email already registered' };
    }

    const userData = {
      uid: Date.now().toString(),
      username,
      email,
      password,
      profiles: [],
      created_on: new Date().toISOString()
    };

    existingUsers[email] = userData;
    localStorage.setItem('cineverse_users', JSON.stringify(existingUsers));

    setUser(userData);
    sessionStorage.setItem('cineverse_user', JSON.stringify(userData));

    return { success: true, user: userData };
  };

  const loginLocal = (email, password, rememberMe = false) => {
    const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
    const userData = existingUsers[email];
    
    if (!userData || userData.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    setUser(userData);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('cineverse_user', JSON.stringify(userData));

    return { success: true, user: userData };
  };

  const updateProfilesLocal = (profiles) => {
    if (!user) return;

    const updatedUser = { ...user, profiles };
    setUser(updatedUser);

    const storage = localStorage.getItem('cineverse_user') ? localStorage : sessionStorage;
    storage.setItem('cineverse_user', JSON.stringify(updatedUser));

    const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
    if (existingUsers[user.email]) {
      existingUsers[user.email] = updatedUser;
      localStorage.setItem('cineverse_users', JSON.stringify(existingUsers));
    }
  };

  // CONTENTSTACK API FUNCTIONS
  const signup = async (username, email, password) => {
    try {
      if (useContentstack) {
        const userData = await signUpUser(username, email, password);
        setUser(userData);
        sessionStorage.setItem('cineverse_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        const result = signupLocal(username, email, password);
        return result;
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      if (useContentstack) {
        const userData = await signInUser(email, password);
        setUser(userData);
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('cineverse_user', JSON.stringify(userData));
        
        return { success: true, user: userData };
      } else {
        const result = loginLocal(email, password, rememberMe);
        return result;
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const updateUserProfiles = async (profiles) => {
    if (!user) return;

    try {
      if (useContentstack && user.uid) {
        await updateProfilesAPI(user.uid, profiles);
      }
      
      const updatedUser = { ...user, profiles };
      setUser(updatedUser);

      const storage = localStorage.getItem('cineverse_user') ? localStorage : sessionStorage;
      storage.setItem('cineverse_user', JSON.stringify(updatedUser));
      
      if (storage === localStorage) {
        sessionStorage.setItem('cineverse_user', JSON.stringify(updatedUser));
      } else {
        localStorage.setItem('cineverse_user', JSON.stringify(updatedUser));
      }

      if (!useContentstack) {
        const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
        if (existingUsers[user.email]) {
          existingUsers[user.email] = updatedUser;
          localStorage.setItem('cineverse_users', JSON.stringify(existingUsers));
        }
      }
    } catch (error) {
      console.error('Error updating profiles:', error);
      updateProfilesLocal(profiles);
    }
  };

  const selectProfile = (profile) => {
    setSelectedProfile(profile);
    
    // Store selected profile
    const storage = localStorage.getItem('cineverse_user') ? localStorage : sessionStorage;
    storage.setItem('cineverse_selected_profile', JSON.stringify(profile));
    
    // Set Personalize traits globally
    setProfileTraits(profile, user);
  };

  const logout = () => {
    setUser(null);
    setSelectedProfile(null);
    
    // Clear personalization traits
    clearPersonalizeTraits();
    
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
    isAuthenticated: !!user && !!selectedProfile,
    // Helper for routes that only need user (not profile)
    hasUser: !!user
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

