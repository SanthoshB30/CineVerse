import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import logger from './utils/logger';

// Set Contentstack Analytics config BEFORE anything else runs
window.__CONTENTSTACK_CONFIG__ = {
  apiKey: process.env.REACT_APP_CONTENTSTACK_API_KEY,
  environment: process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'development'
};

logger.group('Application Initialization');
logger.info(`API Key: ${window.__CONTENTSTACK_CONFIG__.apiKey ? 'Configured' : 'Missing'}`);
logger.info(`Environment: ${window.__CONTENTSTACK_CONFIG__.environment}`);
logger.groupEnd();

// Render app immediately - PersonalizeProvider will handle SDK init
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

