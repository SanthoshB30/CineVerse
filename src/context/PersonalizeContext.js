/**
 * Personalize Context
 * 
 * Provides Contentstack Personalize SDK access throughout the app.
 * Uses the personalizeService for all SDK operations.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import personalizeService from '../services/personalizeService';
import logger from '../utils/logger';

const PersonalizeContext = createContext(null);

export function PersonalizeProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sdk, setSdk] = useState(null);
  const [variantAlias, setVariantAlias] = useState('');
  const [userAttributes, setUserAttributes] = useState({});

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      
      try {
        // Initialize personalize service
        const result = await personalizeService.initializePersonalize();
        
        // Get SDK instance
        const sdkInstance = personalizeService.getSDK();
        setSdk(sdkInstance);
        setIsInitialized(!!sdkInstance);
        
        // Store variant alias
        setVariantAlias(result.variantAlias || '');
        
        // Store user attributes
        setUserAttributes({
          preferred_language: result.language,
          profile_type: result.profileType,
          favorite_genre: result.favoriteGenre
        });
        
        logger.success('Personalize context initialized');
        logger.info('Variant alias:', result.variantAlias || 'none');
        
      } catch (error) {
        logger.error('Failed to initialize personalize context:', error.message);
        setIsInitialized(false);
      }
      
      setIsLoading(false);
    };

    init();
  }, []);

  // Function to update attributes and refresh variants
  const updateAttributes = async (attributes) => {
    const result = await personalizeService.setUserAttributes(attributes);
    if (result) {
      setVariantAlias(result.variantAlias || '');
      setUserAttributes(prev => ({ ...prev, ...attributes }));
    }
    return result;
  };

  const contextValue = {
    isInitialized,
    isLoading,
    sdk,
    Personalize: sdk,  // Alias for backwards compatibility
    variantAlias,
    userAttributes,
    updateAttributes,
    // Expose service functions
    getVariantAlias: personalizeService.getVariantAlias,
    getRawVariantAliases: personalizeService.getRawVariantAliases,
    getVariantParam: personalizeService.getVariantParam,
    setUserLanguage: personalizeService.setUserLanguage,
    setUserProfileType: personalizeService.setUserProfileType,
    setUserFavoriteGenre: personalizeService.setUserFavoriteGenre,
    clearPersonalizationData: personalizeService.clearPersonalizationData
  };

  return (
    <PersonalizeContext.Provider value={contextValue}>
      {children}
    </PersonalizeContext.Provider>
  );
}

/**
 * Hook to access Personalize context
 */
export function usePersonalize() {
  const context = useContext(PersonalizeContext);
  if (!context) {
    return { 
      isInitialized: false, 
      isLoading: false, 
      sdk: null, 
      Personalize: null,
      variantAlias: '',
      userAttributes: {}
    };
  }
  return context;
}

/**
 * Get Personalize SDK instance directly (for use outside React components)
 */
export function getPersonalizeSdk() {
  return personalizeService.getSDK();
}

/**
 * Check if Personalize SDK is initialized
 */
export function isPersonalizeInitialized() {
  return personalizeService.isSDKInitialized();
}

/**
 * Set User Attributes
 */
export async function setPersonalizeUserAttributes(attributes) {
  return personalizeService.setUserAttributes(attributes);
}

/**
 * Get current variant param
 */
export function getVariantParam() {
  return personalizeService.getVariantParam();
}

/**
 * Get variant aliases object
 */
export function getVariantAliases() {
  return personalizeService.getRawVariantAliases();
}

/**
 * Get variant aliases as comma-separated string
 */
export function getVariantAliasesString() {
  return personalizeService.getVariantAlias();
}

export default PersonalizeContext;
