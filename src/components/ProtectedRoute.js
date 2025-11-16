import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireProfile = true }) => {
  const { isAuthenticated, hasUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If requireProfile is false, only check if user exists
  if (!requireProfile) {
    if (!hasUser) {
      return <Navigate to="/login" replace />;
    }
  } else {
    // Default behavior: require both user and selected profile
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

