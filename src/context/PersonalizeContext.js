/**
 * Personalize Context - Provides SDK instance throughout the app
 * Following the pattern from Contentstack Personalize documentation
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import Personalize from '@contentstack/personalize-edge-sdk';
import { getPersonalizationParamsFromUrl } from '../personalize/urlHelpers';
import logger from '../utils/logger';

const PersonalizeContext = createContext(null);

let sdkInstance = null;

/**
 * Get or create Personalize SDK instance
 * @returns {Promise<Object>} SDK instance
 */
async function getPersonalizeInstance() {
  // If already initialized, return existing instance
  if (sdkInstance) {
    return sdkInstance;
  }

  // Check if SDK is already initialized
  if (!Personalize.getInitializationStatus()) {
    const projectUid = process.env.REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
    
    if (!projectUid) {
      logger.error('Personalize Project UID not configured');
      return null;
    }

    logger.group('Personalize SDK Initialization');
    logger.info(`Project UID: ${projectUid}`);

    try {
      // Initialize and store instance
      sdkInstance = await Personalize.init(projectUid);
      
      logger.success('Personalize SDK initialized');
      logger.groupEnd();
      
      return sdkInstance;
    } catch (error) {
      logger.error('Personalize SDK initialization failed:', error.message);
      logger.groupEnd();
      return null;
    }
  }

  return sdkInstance;
}

/**
 * PersonalizeProvider - Wraps the app to provide SDK instance
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function PersonalizeProvider({ children }) {
  const [sdk, setSdk] = useState(null);

  useEffect(() => {
    getPersonalizeInstance()
      .then(async (instance) => {
        setSdk(instance);
        
        // Make it globally available for non-React code
        if (instance) {
          window.csPersonalize = instance;
          
          // Initialize with URL parameters if present
          const urlParams = getPersonalizationParamsFromUrl();
          if (Object.keys(urlParams).length > 0) {
            logger.info('Applying URL parameters to Personalize');
            try {
              await instance.set(urlParams);
              logger.success('URL parameters applied');
            } catch (error) {
              logger.warn('Failed to apply URL parameters:', error.message);
            }
          }
        }
      });
  }, []);

  return (
    <PersonalizeContext.Provider value={sdk}>
      {children}
    </PersonalizeContext.Provider>
  );
}

/**
 * usePersonalize Hook - Access Personalize SDK in components
 * @returns {Object|null} Personalize SDK instance
 * 
 * @example
 * const personalizeSdk = usePersonalize();
 * await personalizeSdk.set({ age: 25 });
 * await personalizeSdk.triggerEvent('buttonClicked');
 */
export function usePersonalize() {
  return useContext(PersonalizeContext);
}

/**
 * Get SDK instance directly (for non-hook usage)
 * @returns {Object|null} Personalize SDK instance
 */
export function getPersonalizeSdk() {
  return sdkInstance || window.csPersonalize || null;
}

export default PersonalizeContext;

