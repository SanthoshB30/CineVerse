/**
 * Personalize Helpers
 * 
 * Utility functions for Contentstack Personalize integration.
 * Uses the personalizeService for all SDK operations.
 */

import { 
  getUrlParams, 
  getPreferredLanguageFromUrl, 
  getPersonalizationParamsFromUrl,
  updateUrlWithPersonalizationParams 
} from './urlHelpers';
import personalizeService from '../services/personalizeService';
import logger from '../utils/logger';

export { 
  getUrlParams, 
  getPreferredLanguageFromUrl, 
  getPersonalizationParamsFromUrl,
  updateUrlWithPersonalizationParams 
};

/**
 * Set User Attributes - triggers audience evaluation
 */
export async function setProfileTraits(profile = {}, user = {}) {
  if (typeof window === 'undefined') {
    logger.warn('Not in browser environment');
    return;
  }

  try {
    logger.info('Setting profile traits for:', profile.profile_name || 'Unknown');

    // Build attributes object for Personalize
    const attributes = {};

    // Set profile type for kids mode
    if (profile.is_kid) {
      attributes.profile_type = 'kids';
    } else {
      attributes.profile_type = 'adult';
    }

    // Set preferred language if available
    const urlParams = getPersonalizationParamsFromUrl();
    
    if (urlParams.preferred_language) {
      attributes.preferred_language = String(urlParams.preferred_language).toLowerCase();
    } else if (profile.preferred_language) {
      attributes.preferred_language = String(profile.preferred_language).toLowerCase();
    }

    // Set favorite genre if available
    if (urlParams.favorite_genre) {
      attributes.favorite_genre = String(urlParams.favorite_genre).toLowerCase();
    } else if (profile.favorite_genre) {
      attributes.favorite_genre = String(profile.favorite_genre).toLowerCase();
    }

    // Use personalizeService
    const result = await personalizeService.setUserAttributes(attributes);
    
    logger.success('Profile traits applied');
    logger.data('Attributes set', attributes);
    
    return result;

  } catch (err) {
    logger.error('Failed to set profile traits:', err.message);
  }
}

/**
 * Set preferred language for personalization
 */
export async function setPreferredLanguage(language) {
  try {
    logger.info('Setting preferred language:', language);
    
    const result = await personalizeService.setUserLanguage(language);
    
    if (result) {
      logger.success(`Language set to ${language}`);
    }
    
    return {
      variantParam: personalizeService.getVariantParam(),
      aliases: personalizeService.getRawVariantAliases()
    };
    
  } catch (err) {
    logger.error('Failed to set preferred language:', err.message);
  }
}

/**
 * Set profile type (kids/adult) for personalization
 */
export async function setProfileType(profileType) {
  try {
    logger.info('Setting profile type:', profileType);
    
    const result = await personalizeService.setUserProfileType(profileType);
    
    if (result) {
      logger.success(`Profile type set to ${profileType}`);
    }
    
    return {
      variantParam: personalizeService.getVariantParam(),
      aliases: personalizeService.getRawVariantAliases()
    };
    
  } catch (err) {
    logger.error('Failed to set profile type:', err.message);
  }
}

/**
 * Set favorite genre for personalization
 */
export async function setFavoriteGenre(genre) {
  try {
    logger.info('Setting favorite genre:', genre);
    
    const result = await personalizeService.setUserFavoriteGenre(genre);
    
    if (result) {
      logger.success(`Favorite genre set to ${genre}`);
    }
    
    return {
      variantParam: personalizeService.getVariantParam(),
      aliases: personalizeService.getRawVariantAliases()
    };
    
  } catch (err) {
    logger.error('Failed to set favorite genre:', err.message);
  }
}

/**
 * Clear/reset user attributes
 */
export async function clearPersonalizeTraits() {
  try {
    logger.info('Clearing personalize traits...');
    
    personalizeService.clearPersonalizationData();
    
    logger.success('Personalize traits cleared');
    
  } catch (err) {
    logger.warn('Failed to clear personalize traits:', err.message);
  }
}

/**
 * Get current variant param
 */
export function getCurrentVariantParam() {
  return personalizeService.getVariantParam();
}

/**
 * Get variant aliases object from SDK
 */
export function getVariantAliases() {
  return personalizeService.getRawVariantAliases();
}

/**
 * Get variant aliases as comma-separated string for .variants() API
 */
export function getVariantAliasesString() {
  return personalizeService.getVariantAlias();
}

/**
 * Convert variant param to aliases array
 */
export function getVariantAliasesFromParam() {
  const sdk = personalizeService.getSDK();
  if (!sdk) return [];

  try {
    const variantParam = sdk.getVariantParam();
    if (!variantParam) {
      return [];
    }
    return sdk.variantParamToVariantAliases(variantParam);
  } catch (err) {
    logger.warn('Failed to convert variant param:', err.message);
    return [];
  }
}

/**
 * Get current traits from stored profile (for UI display)
 */
export function getCurrentTraits() {
  try {
    const profileData = localStorage.getItem('cineverse_selected_profile') || 
                       sessionStorage.getItem('cineverse_selected_profile');
    
    if (!profileData) return {};

    const profile = JSON.parse(profileData);

    return {
      is_kid: !!profile.is_kid,
      profile_type: profile.is_kid ? 'kids' : 'adult',
      preferred_language: profile.preferred_language || null,
      favorite_genre: profile.favorite_genre || null,
      profile_name: profile.profile_name || 'guest'
    };
  } catch (err) {
    logger.warn('Failed to get current traits:', err.message);
    return {};
  }
}

/**
 * Get x-cs-variant-uid header value for direct API calls
 */
export function getVariantHeader() {
  return getVariantAliasesString();
}

/**
 * Creates headers for API requests with variant info
 */
export function getPersonalizeHeaders() {
  try {
    const variantAliases = getVariantAliasesString();

    const headers = {};

    if (variantAliases) {
      headers['x-cs-variant-uid'] = variantAliases;
    }

    return headers;

  } catch (err) {
    logger.warn('Failed to create personalize headers:', err.message);
    return {};
  }
}
