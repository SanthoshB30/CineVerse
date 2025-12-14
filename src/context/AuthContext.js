import React, { createContext, useState, useContext, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { signUpUser, signInUser, updateUserProfiles as updateProfilesAPI } from '../api/auth';
import { setProfileTraits, clearPersonalizeTraits, updateUrlWithPersonalizationParams } from '../personalize/personalizeHelpers';
import logger from '../utils/logger';

const AuthContext = createContext(null);

/**
 * Hash password with SHA-256 and salt for secure storage
 * Note: For production, consider using a backend with bcrypt
 */
const hashPassword = (password, salt) => {
  const saltedPassword = salt + password;
  return CryptoJS.SHA256(saltedPassword).toString(CryptoJS.enc.Hex);
};

/**
 * Generate a random salt for password hashing
 */
const generateSalt = () => {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
};

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

  const signupLocal = (username, email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
    
    if (existingUsers[email]) {
      return { success: false, error: 'Email already registered' };
    }

    // Generate salt and hash password - NEVER store plaintext password
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    // Store user with hashed password (not plaintext)
    const storedUserData = {
      uid: Date.now().toString(),
      username,
      email,
      passwordHash,  // Store hash, not password
      salt,          // Store salt for verification
      profiles: [],
      created_on: new Date().toISOString()
    };

    existingUsers[email] = storedUserData;
    localStorage.setItem('cineverse_users', JSON.stringify(existingUsers));

    // User object for state/session (without sensitive data)
    const userData = {
      uid: storedUserData.uid,
      username,
      email,
      profiles: [],
      created_on: storedUserData.created_on
    };

    setUser(userData);
    sessionStorage.setItem('cineverse_user', JSON.stringify(userData));

    return { success: true, user: userData };
  };

  const loginLocal = (email, password, rememberMe = false) => {
    const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
    const storedUser = existingUsers[email];
    
    if (!storedUser) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify password by comparing hashes
    const passwordHash = hashPassword(password, storedUser.salt);
    if (passwordHash !== storedUser.passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create user object for state/session (without sensitive data)
    const userData = {
      uid: storedUser.uid,
      username: storedUser.username,
      email: storedUser.email,
      profiles: storedUser.profiles || [],
      created_on: storedUser.created_on
    };

    setUser(userData);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('cineverse_user', JSON.stringify(userData));

    return { success: true, user: userData };
  };

  const updateProfilesLocal = (profiles) => {
    if (!user) return;

    // Update user state (without sensitive data)
    const updatedUser = { ...user, profiles };
    setUser(updatedUser);

    const storage = localStorage.getItem('cineverse_user') ? localStorage : sessionStorage;
    storage.setItem('cineverse_user', JSON.stringify(updatedUser));

    // Update stored user (preserving passwordHash and salt)
    const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
    if (existingUsers[user.email]) {
      existingUsers[user.email] = {
        ...existingUsers[user.email],  // Keep passwordHash, salt
        profiles                        // Update profiles only
      };
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
      logger.error('Signup failed:', error.message);
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
      logger.error('Login failed:', error.message);
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
        // Update stored user (preserving passwordHash and salt)
        const existingUsers = JSON.parse(localStorage.getItem('cineverse_users') || '{}');
        if (existingUsers[user.email]) {
          existingUsers[user.email] = {
            ...existingUsers[user.email],  // Keep passwordHash, salt
            profiles                        // Update profiles only
          };
          localStorage.setItem('cineverse_users', JSON.stringify(existingUsers));
        }
      }
    } catch (error) {
      logger.error('Profile update failed:', error.message);
      updateProfilesLocal(profiles);
    }
  };

  const selectProfile = (profile) => {
    setSelectedProfile(profile);
    const storage = localStorage.getItem('cineverse_user') ? localStorage : sessionStorage;
    storage.setItem('cineverse_selected_profile', JSON.stringify(profile));
    
    const urlParams = {};
    if (profile.preferred_language) {
      urlParams.preferred_language = profile.preferred_language;
    }
    if (profile.favorite_genre) {
      urlParams.favorite_genre = profile.favorite_genre;
    }
    if (profile.is_kid) {
      urlParams.is_kid = 'true';
    }
    updateUrlWithPersonalizationParams(urlParams);
    setProfileTraits(profile, user);
  };

  const logout = () => {
    setUser(null);
    setSelectedProfile(null);
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

