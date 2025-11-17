/**
 * Personalize Context - Provides SDK instance throughout the app
 * Following the pattern from Contentstack Personalize documentation
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import Personalize from '@contentstack/personalize-edge-sdk';
import { getPersonalizationParamsFromUrl } from '../personalize/urlHelpers';

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
      console.error('❌ REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID not set');
      return null;
    }

    console.log('🎯 Initializing Personalize SDK in Context...');
    console.log('   Project UID:', projectUid);

    try {
      // Initialize and store instance
      sdkInstance = await Personalize.init(projectUid);
      
      console.log('✅ Personalize SDK initialized via Context');
      console.log('   Available methods:', Object.keys(sdkInstance).filter(k => typeof sdkInstance[k] === 'function'));
      
      return sdkInstance;
    } catch (error) {
      console.error('❌ Failed to initialize Personalize SDK:', error);
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
            console.log('🔗 Initializing Personalize with URL parameters:', urlParams);
            try {
              await instance.set(urlParams);
              console.log('✅ URL parameters applied to Personalize SDK');
            } catch (error) {
              console.warn('⚠️ Failed to apply URL parameters:', error);
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

