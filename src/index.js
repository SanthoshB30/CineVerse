import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Set Contentstack Analytics config BEFORE anything else runs
window.__CONTENTSTACK_CONFIG__ = {
  apiKey: process.env.REACT_APP_CONTENTSTACK_API_KEY,
  environment: process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'development'
};

console.log('🔧 Contentstack config loaded:', {
  apiKey: window.__CONTENTSTACK_CONFIG__.apiKey ? '✅ Set' : '❌ Missing',
  environment: window.__CONTENTSTACK_CONFIG__.environment
});

// Render app immediately - PersonalizeProvider will handle SDK init
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

