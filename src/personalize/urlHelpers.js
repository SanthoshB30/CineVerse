/**
 * URL Helper Functions for Personalization
 * 
 * Utility functions to read personalization parameters from URL
 */

/**
 * Get URL Parameters
 * 
 * Reads query parameters from the current URL
 * @returns {URLSearchParams} URL search params object
 */
export function getUrlParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}

/**
 * Get Preferred Language from URL
 * 
 * Extracts the preferred_language parameter from the URL
 * @returns {string|null} Preferred language or null
 */
export function getPreferredLanguageFromUrl() {
  const params = getUrlParams();
  return params.get('preferred_language');
}

/**
 * Get All Personalization Params from URL
 * 
 * Extracts all relevant personalization parameters from URL
 * @returns {Object} Object with personalization params
 */
export function getPersonalizationParamsFromUrl() {
  const params = getUrlParams();
  const personalizeParams = {};
  
  // Read preferred_language
  const language = params.get('preferred_language');
  if (language) {
    personalizeParams.preferred_language = language;
  }
  
  // Read other potential params
  const genre = params.get('favorite_genre');
  if (genre) {
    personalizeParams.favorite_genre = genre;
  }
  
  const profileType = params.get('profile_type');
  if (profileType) {
    personalizeParams.profile_type = profileType;
  }
  
  const isKid = params.get('is_kid');
  if (isKid) {
    personalizeParams.is_kid = isKid === 'true';
  }
  
  return personalizeParams;
}

/**
 * Update URL with Personalization Parameters
 * 
 * Adds personalization parameters to the URL without page reload
 * @param {Object} params - Parameters to add to URL
 */
export function updateUrlWithPersonalizationParams(params) {
  if (typeof window === 'undefined' || !window.history) {
    return;
  }

  const currentUrl = new URL(window.location.href);
  
  // Add/update parameters
  Object.keys(params).forEach(key => {
    if (params[key]) {
      currentUrl.searchParams.set(key, params[key]);
    }
  });

  // Update URL without reload
  window.history.replaceState({}, '', currentUrl.toString());
}

