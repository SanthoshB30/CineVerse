import React, { createContext, useState, useEffect, useContext } from 'react';
import Personalize from '@contentstack/personalize-edge-sdk';
import { getPersonalizationParamsFromUrl } from '../personalize/urlHelpers';
import logger from '../utils/logger';

const PersonalizeContext = createContext(null);

let sdkInstance = null;

async function getPersonalizeInstance() {
  if (sdkInstance) {
    return sdkInstance;
  }

  if (!Personalize.getInitializationStatus()) {
    const projectUid = process.env.REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
    
    if (!projectUid) {
      logger.error('Personalize Project UID not configured');
      return null;
    }

    logger.group('Personalize SDK Initialization');
    logger.info(`Project UID: ${projectUid}`);

    try {
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

export function PersonalizeProvider({ children }) {
  const [sdk, setSdk] = useState(null);

  useEffect(() => {
    getPersonalizeInstance()
      .then(async (instance) => {
        setSdk(instance);
        if (instance) {
          window.csPersonalize = instance;
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

export function usePersonalize() {
  return useContext(PersonalizeContext);
}

export function getPersonalizeSdk() {
  return sdkInstance || window.csPersonalize || null;
}

export default PersonalizeContext;

