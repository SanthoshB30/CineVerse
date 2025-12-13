/**
 * Contentstack Personalize Helper Functions
 * 
 * Helper functions for setting traits and triggering events
 * Following official Contentstack Personalize patterns
 */

import { getPersonalizeSdk } from '../context/PersonalizeContext';
import { 
  getUrlParams, 
  getPreferredLanguageFromUrl, 
  getPersonalizationParamsFromUrl,
  updateUrlWithPersonalizationParams 
} from './urlHelpers';
import logger from '../utils/logger';

// Re-export URL helpers for convenience
export { 
  getUrlParams, 
  getPreferredLanguageFromUrl, 
  getPersonalizationParamsFromUrl,
  updateUrlWithPersonalizationParams 
};

/**
 * Set Profile Traits in Personalize SDK
 * 
 * Call this when:
 * - User creates a profile
 * - User selects a profile
 * - User logs in with an existing profile
 * 
 * @param {Object} profile - Profile object with preferences
 * @param {string} profile.profile_name - Profile name
 * @param {boolean} profile.is_kid - Whether this is a kids profile
 * @param {string} profile.preferred_language - Preferred language (tamil, hindi, english, etc.)
 * @param {string} profile.favorite_genre - Favorite genre (action, comedy, drama, etc.)
 * @param {string} profile.avatar - Profile avatar emoji
 * 
 * @param {Object} user - User object (optional)
 * @param {string} user.uid - User unique ID
 * @param {string} user.email - User email
 * @param {string} user.username - Username
 */
export async function setProfileTraits(profile = {}, user = {}) {
  // Skip if not in browser
  if (typeof window === 'undefined') {
    logger.warn('Not in browser environment');
    return;
  }

  // Get SDK instance from context or global
  const sdk = getPersonalizeSdk();

  if (!sdk) {
    logger.error('Personalize SDK not available. Verify PersonalizeProvider configuration.');
    return;
  }

  try {
    logger.info('Setting profile traits:', profile.profile_name || 'Unknown');

    // Build traits object
    const traits = {
      // Profile-level traits
      is_kid: !!profile.is_kid,
      profile_type: profile.is_kid ? 'kid' : 'adult',
      profile_name: profile.profile_name || 'guest'
    };

    // Read URL parameters for personalization (priority)
    const urlParams = getPersonalizationParamsFromUrl();
    
    // Add language preference (URL takes precedence over profile)
    if (urlParams.preferred_language) {
      traits.preferred_language = String(urlParams.preferred_language).toLowerCase();
    } else if (profile.preferred_language) {
      traits.preferred_language = String(profile.preferred_language).toLowerCase();
    }

    // Add genre preference (URL takes precedence)
    if (urlParams.favorite_genre) {
      traits.favorite_genre = String(urlParams.favorite_genre).toLowerCase();
    } else if (profile.favorite_genre) {
      traits.favorite_genre = String(profile.favorite_genre).toLowerCase();
    }

    // Add user-level traits (optional)
    if (user?.uid) {
      traits.user_uid = String(user.uid);
    }
    if (user?.email) {
      traits.email = String(user.email);
    }
    if (user?.username) {
      traits.username = String(user.username);
    }

    // Use instance method .set() to set all traits at once
    // Instance-based approach (v1.0.9+)
    if (typeof sdk.set !== 'function') {
      logger.error('SDK set() method not available');
      return;
    }

    await sdk.set(traits);
    logger.success('Profile traits applied');

  } catch (err) {
    logger.error('Failed to set profile traits:', err.message);
  }
}

/**
 * Get Personalization Headers for Contentstack Delivery API
 * 
 * Returns headers object to be merged with your API call headers.
 * These headers tell Contentstack to return personalized content.
 * 
 * @returns {Object} Headers object with personalization data
 */
export function getPersonalizeHeaders() {
  // Skip if not in browser or SDK not available
  if (typeof window === 'undefined' || !window.csPersonalize) {
    return {};
  }

  try {
    // Get current profile from storage
    const profileData = localStorage.getItem('cineverse_selected_profile') || 
                       sessionStorage.getItem('cineverse_selected_profile');
    
    if (!profileData) {
      return {};
    }

    const profile = JSON.parse(profileData);

    // Build traits object for headers
    const traits = {
      is_kid: !!profile.is_kid,
      profile_type: profile.is_kid ? 'kid' : 'adult',
    };

    if (profile.preferred_language) {
      traits.preferred_language = String(profile.preferred_language).toLowerCase();
    }

    if (profile.favorite_genre) {
      traits.favorite_genre = String(profile.favorite_genre).toLowerCase();
    }

    // Get variant aliases if available
    const variantAliases = window.__PERSONALIZE_VARIANTS__ || [];

    const headers = {
      'X-CS-Personalize-Enabled': 'true',
      'X-CS-Personalize-Traits': JSON.stringify(traits)
    };

    // Add variant aliases if available
    if (variantAliases && variantAliases.length > 0) {
      headers['X-CS-Personalize-Variants'] = JSON.stringify(variantAliases);
    }

    return headers;

  } catch (err) {
    logger.warn('Failed to create personalize headers:', err.message);
    return {};
  }
}

/**
 * Clear All Personalization Traits
 * 
 * Call this when user logs out to reset personalization state
 * Note: With instance-based approach, we set traits to default values
 */
export async function clearPersonalizeTraits() {
  if (typeof window === 'undefined' || !window.csPersonalize) {
    return;
  }

  try {
    logger.info('Clearing personalize traits...');

    // Reset traits to guest defaults using instance method
    await window.csPersonalize.set({
      is_kid: false,
      profile_type: 'adult',
      preferred_language: 'english',
      favorite_genre: null,
      profile_name: 'guest',
      user_uid: null,
      email: null,
      username: null
    });

    logger.success('Personalize traits reset');
  } catch (err) {
    logger.warn('Failed to clear personalize traits:', err.message);
  }
}

/**
 * Get Current Traits
 * 
 * Returns the current personalization traits if available
 * 
 * @returns {Object} Current traits or empty object
 */
export function getCurrentTraits() {
  if (typeof window === 'undefined' || !window.csPersonalize) {
    return {};
  }

  try {
    // Try to get profile from storage
    const profileData = localStorage.getItem('cineverse_selected_profile') || 
                       sessionStorage.getItem('cineverse_selected_profile');
    
    if (!profileData) return {};

    const profile = JSON.parse(profileData);

    return {
      is_kid: !!profile.is_kid,
      profile_type: profile.is_kid ? 'kid' : 'adult',
      preferred_language: profile.preferred_language || 'english',
      favorite_genre: profile.favorite_genre || null,
      profile_name: profile.profile_name || 'guest'
    };
  } catch (err) {
    logger.warn('Failed to get current traits:', err.message);
    return {};
  }
}

/**
 * Get Variant Aliases
 * 
 * Returns the current variant aliases from the Personalize SDK instance
 * 
 * @returns {Array} Array of variant alias strings
 */
export function getVariantAliases() {
  if (typeof window === 'undefined' || !window.csPersonalize) {
    return [];
  }

  try {
    // Use instance method (v1.0.9+)
    if (typeof window.csPersonalize.getVariantAliases === 'function') {
      return window.csPersonalize.getVariantAliases() || [];
    }

    return [];
  } catch (err) {
    logger.warn('Failed to get variant aliases:', err.message);
    return [];
  }
}

