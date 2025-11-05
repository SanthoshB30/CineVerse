import React, { useState, useEffect } from 'react';
import { initializeData } from '../api/contentstack';

/**
 * DataInitializer Component
 * 
 * This component initializes the data store on app startup.
 * It shows a loading screen while fetching all data from Contentstack.
 * 
 * Only used when USE_MOCK_DATA is false in contentstack.js
 */
const DataInitializer = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize data store
      const result = await initializeData();

      if (result.success) {
        setStats(result.stats);
        setIsLoading(false);
      } else {
        setError(result.message || 'Failed to load data');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error initializing data:', err);
      setError('Failed to connect to Contentstack. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div className="data-initializer-screen">
        <div className="data-initializer-content">
          <div className="loader-large"></div>
          <h2 className="init-title">Loading CineVerse</h2>
          <p className="init-subtitle">Preparing your cinematic experience...</p>
          <div className="init-progress">
            <div className="progress-bar">
              <div className="progress-bar-fill"></div>
            </div>
            <p className="init-text">This may take a few moments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-initializer-screen">
        <div className="data-initializer-content error">
          <div className="error-icon">⚠️</div>
          <h2 className="init-title">Failed to Load Data</h2>
          <p className="init-subtitle error-message">{error}</p>
          <div className="init-actions">
            <button className="btn btn-primary" onClick={handleRetry}>
              Retry
            </button>
            <div className="error-help">
              <p>Make sure you have:</p>
              <ul>
                <li>Valid Contentstack credentials in .env</li>
                <li>Content published in Contentstack</li>
                <li>Network connection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data loaded successfully - show stats briefly then render children
  if (stats) {
    return (
      <div className="data-initializer-success">
        {children}
      </div>
    );
  }

  return children;
};

export default DataInitializer;

