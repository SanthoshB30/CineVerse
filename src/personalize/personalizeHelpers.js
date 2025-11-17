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
    console.warn('⚠️ Not in browser environment');
    return;
  }

  // Get SDK instance from context or global
  const sdk = getPersonalizeSdk();

  if (!sdk) {
    console.error('❌ Personalize SDK instance not available');
    console.error('   Make sure PersonalizeProvider is wrapping your app');
    console.error('   Check REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID is set');
    return;
  }

  try {
    console.log('🎯 Setting Personalize traits for profile:', profile.profile_name || 'Unknown');

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
      console.log('  🔗 Using preferred_language from URL:', traits.preferred_language);
    } else if (profile.preferred_language) {
      traits.preferred_language = String(profile.preferred_language).toLowerCase();
    }

    // Add genre preference (URL takes precedence)
    if (urlParams.favorite_genre) {
      traits.favorite_genre = String(urlParams.favorite_genre).toLowerCase();
      console.log('  🔗 Using favorite_genre from URL:', traits.favorite_genre);
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
      console.error('❌ set() method not available on SDK instance');
      console.log('   Available methods:', Object.keys(sdk));
      return;
    }

    await sdk.set(traits);
    console.log('  ✓ All traits set via instance.set():', traits);

    console.log('✅ Personalize traits set successfully:', traits);

  } catch (err) {
    console.error('❌ Error setting Personalize traits:', err);
    console.error('   Error details:', err.message);
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
      console.log('ℹ️ No profile selected - returning default headers');
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

    console.log('🔖 Generated personalize headers:', headers);
    return headers;

  } catch (err) {
    console.warn('⚠️ Error creating personalize headers:', err);
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
    console.log('🧹 Clearing Personalize traits');

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

    console.log('✅ Personalize traits reset to defaults');
  } catch (err) {
    console.warn('⚠️ Error clearing Personalize traits:', err);
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
    console.warn('Error getting current traits:', err);
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
    console.warn('Error getting variant aliases:', err);
    return [];
  }
}

