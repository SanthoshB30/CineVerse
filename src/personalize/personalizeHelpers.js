import { getPersonalizeSdk } from '../context/PersonalizeContext';
import { 
  getUrlParams, 
  getPreferredLanguageFromUrl, 
  getPersonalizationParamsFromUrl,
  updateUrlWithPersonalizationParams 
} from './urlHelpers';
import logger from '../utils/logger';

export { 
  getUrlParams, 
  getPreferredLanguageFromUrl, 
  getPersonalizationParamsFromUrl,
  updateUrlWithPersonalizationParams 
};

export async function setProfileTraits(profile = {}, user = {}) {
  if (typeof window === 'undefined') {
    logger.warn('Not in browser environment');
    return;
  }

  const sdk = getPersonalizeSdk();

  if (!sdk) {
    logger.error('Personalize SDK not available. Verify PersonalizeProvider configuration.');
    return;
  }

  try {
    logger.info('Setting profile traits:', profile.profile_name || 'Unknown');

    const traits = {
      is_kid: !!profile.is_kid,
      profile_type: profile.is_kid ? 'kid' : 'adult',
      profile_name: profile.profile_name || 'guest'
    };

    const urlParams = getPersonalizationParamsFromUrl();
    
    if (urlParams.preferred_language) {
      traits.preferred_language = String(urlParams.preferred_language).toLowerCase();
    } else if (profile.preferred_language) {
      traits.preferred_language = String(profile.preferred_language).toLowerCase();
    }

    if (urlParams.favorite_genre) {
      traits.favorite_genre = String(urlParams.favorite_genre).toLowerCase();
    } else if (profile.favorite_genre) {
      traits.favorite_genre = String(profile.favorite_genre).toLowerCase();
    }

    if (user?.uid) {
      traits.user_uid = String(user.uid);
    }
    if (user?.email) {
      traits.email = String(user.email);
    }
    if (user?.username) {
      traits.username = String(user.username);
    }

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

export function getPersonalizeHeaders() {
  if (typeof window === 'undefined' || !window.csPersonalize) {
    return {};
  }

  try {
    const profileData = localStorage.getItem('cineverse_selected_profile') || 
                       sessionStorage.getItem('cineverse_selected_profile');
    
    if (!profileData) {
      return {};
    }

    const profile = JSON.parse(profileData);

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

    const variantAliases = window.__PERSONALIZE_VARIANTS__ || [];

    const headers = {
      'X-CS-Personalize-Enabled': 'true',
      'X-CS-Personalize-Traits': JSON.stringify(traits)
    };

    if (variantAliases && variantAliases.length > 0) {
      headers['X-CS-Personalize-Variants'] = JSON.stringify(variantAliases);
    }

    return headers;

  } catch (err) {
    logger.warn('Failed to create personalize headers:', err.message);
    return {};
  }
}

export async function clearPersonalizeTraits() {
  if (typeof window === 'undefined' || !window.csPersonalize) {
    return;
  }

  try {
    logger.info('Clearing personalize traits...');
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

export function getCurrentTraits() {
  if (typeof window === 'undefined' || !window.csPersonalize) {
    return {};
  }

  try {
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

export function getVariantAliases() {
  if (typeof window === 'undefined' || !window.csPersonalize) {
    return [];
  }

  try {
    if (typeof window.csPersonalize.getVariantAliases === 'function') {
      return window.csPersonalize.getVariantAliases() || [];
    }

    return [];
  } catch (err) {
    logger.warn('Failed to get variant aliases:', err.message);
    return [];
  }
}

