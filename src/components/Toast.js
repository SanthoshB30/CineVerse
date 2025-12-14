import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';

const Toast = () => {
  const { toast } = useWatchlist();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
};

export default Toast;

