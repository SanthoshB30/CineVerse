import React, { useState } from 'react';
import { refreshDataStore } from '../services/dataService';

/**
 * RefreshDataButton Component
 * 
 * Provides a button to manually refresh all data from Contentstack.
 * Useful during development when content is frequently updated.
 */
const RefreshDataButton = ({ onRefreshComplete }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage('');

    try {
      console.log('🔄 Manually refreshing data...');
      
      const result = await refreshDataStore();

      if (result.success) {
        setMessage(`✅ Refreshed! Loaded ${result.stats?.reviews || 0} reviews`);
        console.log('✅ Data refreshed successfully:', result.stats);
        
        // Dispatch custom event to notify components
        window.dispatchEvent(new CustomEvent('dataRefreshed', { 
          detail: result.stats 
        }));
        
        // Call parent callback if provided
        if (onRefreshComplete) {
          onRefreshComplete(result);
        }

        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to refresh data');
        console.error('Failed to refresh:', result.message);
      }
    } catch (error) {
      setMessage('❌ Error refreshing data');
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="refresh-data-button-container">
      <button
        className={`refresh-data-button ${isRefreshing ? 'refreshing' : ''}`}
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Refresh data from Contentstack"
      >
        {isRefreshing ? (
          <>
            <span className="spinner">↻</span>
            Refreshing...
          </>
        ) : (
          <>
            <span>🔄</span>
            Refresh Data
          </>
        )}
      </button>
      {message && (
        <span className="refresh-message">{message}</span>
      )}
    </div>
  );
};

export default RefreshDataButton;

