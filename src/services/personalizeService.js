/**
 * Contentstack Personalize Service for CineVerse
 * 
 * Integrates with Contentstack Personalize Edge SDK for movie personalization.
 * Reference: https://www.contentstack.com/docs/developers/sdks/personalize-edge-sdk/javascript
 * 
 * SDK v1.0.9+ Instance Pattern:
 * - const sdk = await Personalize.init(projectUid, options)
 * - sdk.set(attributes) - Set user attributes
 * - sdk.getVariantAliases() - Get variant aliases object
 * - sdk.getVariantParam() - Get variant parameter string
 * - sdk.triggerImpression(experienceShortUid) - Track impressions
 * - sdk.triggerEvent(eventKey, properties) - Track events
 */

import Personalize from '@contentstack/personalize-edge-sdk';

// Personalize configuration
const PERSONALIZE_PROJECT_UID = process.env.REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID;
const PERSONALIZE_EDGE_API_URL = process.env.REACT_APP_PERSONALIZE_EDGE_API_URL || 'https://personalize-edge.contentstack.com';

// Supported languages for movie personalization
const SUPPORTED_LANGUAGES = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam'];
const DEFAULT_LANGUAGE = 'English';

// Profile types
const PROFILE_TYPES = ['adult', 'kids'];
const DEFAULT_PROFILE_TYPE = 'adult';

// Language code shortcuts for URL query params
const LANGUAGE_CODE_MAP = {
  'tamil': 'Tamil',
  'ta': 'Tamil',
  'english': 'English',
  'en': 'English',
  'hindi': 'Hindi',
  'hi': 'Hindi',
  'telugu': 'Telugu',
  'te': 'Telugu',
  'malayalam': 'Malayalam',
  'ml': 'Malayalam'
};

// SDK instance and state
let personalizeSDK = null;
let userLanguage = null;
let userProfileType = null;
let userFavoriteGenre = null;
let variantAlias = null;
let isInitialized = false;
let activeVariants = [];
let isQueryParamBased = false;

/**
 * Initialize the Personalize Edge SDK
 * Returns the SDK instance (v1.0.9+ pattern)
 */
async function initializeEdgeSDK() {
  if (personalizeSDK) {
    console.log('[Personalize] SDK already initialized');
    return personalizeSDK;
  }
  
  if (!PERSONALIZE_PROJECT_UID) {
    console.warn('[Personalize] ⚠️ REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID not configured in .env');
    console.warn('[Personalize] SDK will not be initialized - variants will be empty');
    return null;
  }

  try {
    console.log(`[Personalize] Initializing SDK with Project UID: ${PERSONALIZE_PROJECT_UID}`);
    console.log(`[Personalize] Edge API URL: ${PERSONALIZE_EDGE_API_URL}`);
    
    // v1.0.9+ pattern: init() returns the SDK instance
    personalizeSDK = await Personalize.init(PERSONALIZE_PROJECT_UID, {
      edgeApiUrl: PERSONALIZE_EDGE_API_URL
    });
    
    // Store globally for debugging
    window.csPersonalize = personalizeSDK;
    
    console.log('[Personalize] ✅ Edge SDK initialized successfully');
    return personalizeSDK;
  } catch (error) {
    console.error('[Personalize] ❌ Failed to initialize Edge SDK:', error);
    return null;
  }
}

/**
 * Get the SDK instance
 */
export function getSDK() {
  return personalizeSDK || window.csPersonalize || null;
}

/**
 * Get personalization params from URL query
 * Supports: ?preferred_language=tamil, ?profile_type=kids, ?favorite_genre=action
 */
function getParamsFromQueryString() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const result = {};
    
    // Check for preferred_language
    const langParam = urlParams.get('preferred_language') || urlParams.get('lang');
    if (langParam) {
      const lowerLangParam = langParam.toLowerCase();
      const language = LANGUAGE_CODE_MAP[lowerLangParam] || 
        (SUPPORTED_LANGUAGES.find(l => l.toLowerCase() === lowerLangParam)) ||
        null;
      
      if (language) {
        result.preferred_language = language.toLowerCase();
        console.log(`[Personalize] Language from URL: ${language}`);
      }
    }
    
    // Check for profile_type
    const profileParam = urlParams.get('profile_type') || urlParams.get('profile');
    if (profileParam) {
      const profileType = profileParam.toLowerCase();
      if (PROFILE_TYPES.includes(profileType)) {
        result.profile_type = profileType;
        console.log(`[Personalize] Profile type from URL: ${profileType}`);
      }
    }
    
    // Check for is_kid (alternative to profile_type)
    const isKidParam = urlParams.get('is_kid');
    if (isKidParam === 'true' || isKidParam === '1') {
      result.profile_type = 'kids';
      console.log(`[Personalize] Kids mode from URL: true`);
    }
    
    // Check for favorite_genre
    const genreParam = urlParams.get('favorite_genre') || urlParams.get('genre');
    if (genreParam) {
      result.favorite_genre = genreParam.toLowerCase();
      console.log(`[Personalize] Favorite genre from URL: ${genreParam}`);
    }
    
    return Object.keys(result).length > 0 ? result : null;
  } catch (error) {
    console.warn('[Personalize] Error reading query params:', error);
    return null;
  }
}

/**
 * Set User Attributes via Personalize Edge SDK instance
 * This triggers audience evaluation and updates active variants
 */
async function setUserAttributesOnEdge(attributes) {
  const sdk = getSDK();
  
  if (!sdk) {
    const initialized = await initializeEdgeSDK();
    if (!initialized) {
      console.warn('[Personalize] ⚠️ SDK not initialized, skipping attribute setting');
      return null;
    }
  }

  try {
    const sdkInstance = getSDK();
    
    console.log('[Personalize] Setting user attributes:', attributes);
    
    // Use SDK instance method: sdk.set()
    await sdkInstance.set(attributes);
    
    console.log('[Personalize] ✅ User attributes set successfully');
    
    // Log what the SDK evaluates after setting attributes
    const aliases = sdkInstance.getVariantAliases();
    const variantParam = sdkInstance.getVariantParam();
    
    console.log('[Personalize] sdk.getVariantAliases():', aliases);
    console.log('[Personalize] sdk.getVariantParam():', variantParam);
    
    return { aliases, variantParam };
  } catch (error) {
    console.warn('[Personalize] ❌ Failed to set user attributes:', error.message);
    return null;
  }
}

/**
 * Get active variant aliases from the Edge SDK instance
 * These aliases can be used with .variants() API or x-cs-variant-uid header
 */
function getActiveVariantAliases() {
  const sdk = getSDK();
  
  if (!sdk) {
    console.warn('[Personalize] ⚠️ SDK not initialized, returning empty variants');
    return {};
  }

  try {
    const aliases = sdk.getVariantAliases();
    const aliasCount = Object.keys(aliases).length;
    
    if (aliasCount > 0) {
      console.log('[Personalize] ✅ Active variant aliases:', aliases);
    } else {
      console.warn('[Personalize] ⚠️ No variant aliases returned from SDK');
      console.warn('[Personalize] This means either:');
      console.warn('[Personalize]   1. No experiences are configured in Personalize');
      console.warn('[Personalize]   2. User does not match any audience criteria');
      console.warn('[Personalize]   3. Experiences are not published/active');
    }
    
    return aliases;
  } catch (error) {
    console.warn('[Personalize] ❌ Failed to get variant aliases:', error.message);
    return {};
  }
}

/**
 * Get variant alias string for .variants() API (comma-separated)
 */
function getVariantAliasString() {
  const aliases = getActiveVariantAliases();
  
  // Convert the aliases object to a comma-separated string
  // Format: { "experience_uid": "variant_alias" } -> "variant_alias1,variant_alias2"
  const aliasValues = Object.values(aliases);
  
  if (aliasValues.length > 0) {
    const result = aliasValues.join(',');
    console.log('[Personalize] Variant string for API:', result);
    return result;
  }
  
  // Fallback to the stored variant alias
  return variantAlias || '';
}

/**
 * Get variant param from SDK
 */
function getVariantParam() {
  const sdk = getSDK();
  if (!sdk) return null;
  
  try {
    return sdk.getVariantParam();
  } catch (error) {
    console.warn('[Personalize] Failed to get variant param:', error.message);
    return null;
  }
}

/**
 * Track Impression Event via Edge SDK instance
 */
async function trackImpression(experienceShortUid) {
  const sdk = getSDK();
  
  if (!sdk) {
    console.warn('[Personalize] SDK not initialized, skipping impression tracking');
    return;
  }

  try {
    await sdk.triggerImpression(experienceShortUid);
    console.log(`[Personalize] ✅ Impression tracked for ${experienceShortUid}`);
  } catch (error) {
    console.warn('[Personalize] Failed to track impression:', error.message);
  }
}

/**
 * Track Custom Event via Edge SDK instance
 */
async function trackEvent(eventKey, eventProperties = {}) {
  const sdk = getSDK();
  
  if (!sdk) {
    console.warn('[Personalize] SDK not initialized, skipping event tracking');
    return;
  }

  try {
    await sdk.triggerEvent(eventKey, eventProperties);
    console.log(`[Personalize] ✅ Event tracked: ${eventKey}`);
  } catch (error) {
    console.warn('[Personalize] Failed to track event:', error.message);
  }
}

/**
 * Initialize Personalize service
 * Priority: 1. URL query params 2. Saved preferences 3. Default values
 * Variant aliases come ONLY from Personalize Edge SDK
 */
export async function initializePersonalize() {
  // Initialize the Edge SDK first
  await initializeEdgeSDK();

  // Check URL query params first (for testing/deep links)
  const queryParams = getParamsFromQueryString();
  if (queryParams) {
    isQueryParamBased = true;
    
    // Set attributes from URL
    if (queryParams.preferred_language) {
      userLanguage = queryParams.preferred_language;
    }
    if (queryParams.profile_type) {
      userProfileType = queryParams.profile_type;
    }
    if (queryParams.favorite_genre) {
      userFavoriteGenre = queryParams.favorite_genre;
    }
    
    // Set attributes on Edge SDK - triggers audience evaluation
    await setUserAttributesOnEdge(queryParams);
    
    // Get variant aliases from Edge SDK
    const sdkAliases = getActiveVariantAliases();
    variantAlias = Object.values(sdkAliases).join(',') || '';
    activeVariants = Object.entries(sdkAliases).map(([expUid, varUid]) => ({
      experienceUid: expUid,
      variantUid: varUid
    }));
    
    isInitialized = true;
    
    console.log(`[Personalize] ✅ Initialized from URL params`);
    console.log(`[Personalize] Language: ${userLanguage || 'default'}`);
    console.log(`[Personalize] Profile: ${userProfileType || 'default'}`);
    console.log(`[Personalize] Variant: ${variantAlias || '(none)'}`);
    
    return {
      language: userLanguage,
      profileType: userProfileType,
      favoriteGenre: userFavoriteGenre,
      variantAlias,
      fromQueryParam: true,
      sdkAliases
    };
  }
  
  // If already initialized without query params, return current state
  if (isInitialized && !isQueryParamBased) {
    return {
      language: userLanguage,
      profileType: userProfileType,
      favoriteGenre: userFavoriteGenre,
      variantAlias,
      activeVariants
    };
  }
  
  try {
    // Load saved preferences from localStorage
    const savedPrefs = JSON.parse(localStorage.getItem('cineverse_personalize_prefs') || '{}');
    
    userLanguage = savedPrefs.preferred_language || DEFAULT_LANGUAGE.toLowerCase();
    userProfileType = savedPrefs.profile_type || DEFAULT_PROFILE_TYPE;
    userFavoriteGenre = savedPrefs.favorite_genre || null;
    
    // Set user attributes on Edge SDK - triggers audience evaluation
    const attributes = {
      preferred_language: userLanguage,
      profile_type: userProfileType
    };
    if (userFavoriteGenre) {
      attributes.favorite_genre = userFavoriteGenre;
    }
    
    await setUserAttributesOnEdge(attributes);
    
    // Get active variant aliases from Edge SDK
    const sdkAliases = getActiveVariantAliases();
    activeVariants = Object.entries(sdkAliases).map(([expUid, varUid]) => ({
      experienceUid: expUid,
      variantUid: varUid
    }));
    
    // Use ONLY SDK variant aliases
    variantAlias = Object.values(sdkAliases).join(',') || '';
    
    isInitialized = true;
    isQueryParamBased = false;
    
    console.log(`[Personalize] ✅ Initialized from saved preferences`);
    console.log(`[Personalize] Language: ${userLanguage}`);
    console.log(`[Personalize] Profile: ${userProfileType}`);
    console.log(`[Personalize] Variant: ${variantAlias || '(none)'}`);
    
    return {
      language: userLanguage,
      profileType: userProfileType,
      favoriteGenre: userFavoriteGenre,
      variantAlias,
      activeVariants,
      sdkAliases
    };
  } catch (error) {
    console.error('[Personalize] Initialization failed:', error);
    userLanguage = DEFAULT_LANGUAGE.toLowerCase();
    userProfileType = DEFAULT_PROFILE_TYPE;
    variantAlias = '';
    isInitialized = true;
    return {
      language: userLanguage,
      profileType: userProfileType,
      variantAlias
    };
  }
}

/**
 * Get the current user's preferred language
 */
export function getUserLanguage() {
  return userLanguage || 
    JSON.parse(localStorage.getItem('cineverse_personalize_prefs') || '{}').preferred_language ||
    DEFAULT_LANGUAGE.toLowerCase();
}

/**
 * Get the current user's profile type
 */
export function getUserProfileType() {
  return userProfileType || 
    JSON.parse(localStorage.getItem('cineverse_personalize_prefs') || '{}').profile_type ||
    DEFAULT_PROFILE_TYPE;
}

/**
 * Set user's preferred language
 * Variant aliases come from Edge SDK after setting attribute
 */
export async function setUserLanguage(language) {
  const normalizedLang = language.toLowerCase();
  const matchedLang = SUPPORTED_LANGUAGES.find(l => l.toLowerCase() === normalizedLang);
  
  if (!matchedLang) {
    console.warn(`[Personalize] Invalid language: ${language}`);
    return false;
  }
  
  userLanguage = normalizedLang;
  isQueryParamBased = false;
  
  // Save to localStorage
  const prefs = JSON.parse(localStorage.getItem('cineverse_personalize_prefs') || '{}');
  prefs.preferred_language = normalizedLang;
  localStorage.setItem('cineverse_personalize_prefs', JSON.stringify(prefs));
  
  // Update Edge SDK - triggers audience re-evaluation
  await setUserAttributesOnEdge({ preferred_language: normalizedLang });
  
  // Get updated variant aliases from Edge SDK
  const sdkAliases = getActiveVariantAliases();
  variantAlias = Object.values(sdkAliases).join(',') || '';
  
  console.log(`[Personalize] ✅ Language changed to: ${language}`);
  console.log(`[Personalize] Variant from SDK: ${variantAlias || '(none)'}`);
  
  return true;
}

/**
 * Set user's profile type (adult/kids)
 */
export async function setUserProfileType(profileType) {
  if (!PROFILE_TYPES.includes(profileType)) {
    console.warn(`[Personalize] Invalid profile type: ${profileType}`);
    return false;
  }
  
  userProfileType = profileType;
  isQueryParamBased = false;
  
  // Save to localStorage
  const prefs = JSON.parse(localStorage.getItem('cineverse_personalize_prefs') || '{}');
  prefs.profile_type = profileType;
  localStorage.setItem('cineverse_personalize_prefs', JSON.stringify(prefs));
  
  // Update Edge SDK
  await setUserAttributesOnEdge({ profile_type: profileType });
  
  // Get updated variant aliases
  const sdkAliases = getActiveVariantAliases();
  variantAlias = Object.values(sdkAliases).join(',') || '';
  
  console.log(`[Personalize] ✅ Profile type changed to: ${profileType}`);
  console.log(`[Personalize] Variant from SDK: ${variantAlias || '(none)'}`);
  
  return true;
}

/**
 * Set user's favorite genre
 */
export async function setUserFavoriteGenre(genre) {
  userFavoriteGenre = genre?.toLowerCase() || null;
  isQueryParamBased = false;
  
  // Save to localStorage
  const prefs = JSON.parse(localStorage.getItem('cineverse_personalize_prefs') || '{}');
  prefs.favorite_genre = userFavoriteGenre;
  localStorage.setItem('cineverse_personalize_prefs', JSON.stringify(prefs));
  
  // Update Edge SDK
  if (userFavoriteGenre) {
    await setUserAttributesOnEdge({ favorite_genre: userFavoriteGenre });
  }
  
  // Get updated variant aliases
  const sdkAliases = getActiveVariantAliases();
  variantAlias = Object.values(sdkAliases).join(',') || '';
  
  console.log(`[Personalize] ✅ Favorite genre changed to: ${genre || 'none'}`);
  console.log(`[Personalize] Variant from SDK: ${variantAlias || '(none)'}`);
  
  return true;
}

/**
 * Set multiple user attributes at once
 */
export async function setUserAttributes(attributes) {
  // Update local state
  if (attributes.preferred_language) {
    userLanguage = attributes.preferred_language.toLowerCase();
  }
  if (attributes.profile_type) {
    userProfileType = attributes.profile_type;
  }
  if (attributes.favorite_genre) {
    userFavoriteGenre = attributes.favorite_genre.toLowerCase();
  }
  
  isQueryParamBased = false;
  
  // Save to localStorage
  const prefs = JSON.parse(localStorage.getItem('cineverse_personalize_prefs') || '{}');
  Object.assign(prefs, attributes);
  localStorage.setItem('cineverse_personalize_prefs', JSON.stringify(prefs));
  
  // Update Edge SDK
  await setUserAttributesOnEdge(attributes);
  
  // Get updated variant aliases
  const sdkAliases = getActiveVariantAliases();
  variantAlias = Object.values(sdkAliases).join(',') || '';
  activeVariants = Object.entries(sdkAliases).map(([expUid, varUid]) => ({
    experienceUid: expUid,
    variantUid: varUid
  }));
  
  console.log(`[Personalize] ✅ Attributes updated:`, attributes);
  console.log(`[Personalize] Variant from SDK: ${variantAlias || '(none)'}`);
  
  return { variantAlias, activeVariants, sdkAliases };
}

/**
 * Get the variant alias for current user
 * Returns comma-separated string for .variants() API
 */
export function getVariantAlias() {
  const sdkVariantString = getVariantAliasString();
  if (sdkVariantString) {
    return sdkVariantString;
  }
  return variantAlias || '';
}

/**
 * Get raw variant aliases object from SDK
 */
export function getRawVariantAliases() {
  return getActiveVariantAliases();
}

/**
 * Check if personalization is driven by URL query param
 */
export function isFromQueryParam() {
  return isQueryParamBased;
}

/**
 * Get all active variants from SDK
 */
export function getActiveVariants() {
  return [...activeVariants];
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages() {
  return [...SUPPORTED_LANGUAGES];
}

/**
 * Get language code map
 */
export function getLanguageCodeMap() {
  return { ...LANGUAGE_CODE_MAP };
}

/**
 * Check if personalize is properly configured
 */
export function isPersonalizeConfigured() {
  return !!PERSONALIZE_PROJECT_UID;
}

/**
 * Check if SDK is initialized
 */
export function isSDKInitialized() {
  return !!personalizeSDK;
}

/**
 * Get user attributes
 */
export function getUserAttributes() {
  return {
    preferred_language: userLanguage,
    profile_type: userProfileType,
    favorite_genre: userFavoriteGenre
  };
}

/**
 * Clear personalization data (for logout)
 */
export function clearPersonalizationData() {
  localStorage.removeItem('cineverse_personalize_prefs');
  userLanguage = null;
  userProfileType = null;
  userFavoriteGenre = null;
  variantAlias = null;
  activeVariants = [];
  isInitialized = false;
  isQueryParamBased = false;
  
  // Reset the SDK if available
  const sdk = getSDK();
  if (sdk && sdk.reset) {
    try {
      sdk.reset();
    } catch (e) {
      // Ignore reset errors
    }
  }
  
  console.log('[Personalize] ✅ Data cleared');
}

// Export functions
export { trackImpression, trackEvent, getVariantParam };

// Export default object
const personalizeService = {
  initializePersonalize,
  getSDK,
  getUserLanguage,
  getUserProfileType,
  setUserLanguage,
  setUserProfileType,
  setUserFavoriteGenre,
  setUserAttributes,
  getVariantAlias,
  getRawVariantAliases,
  getVariantParam,
  getSupportedLanguages,
  isPersonalizeConfigured,
  isSDKInitialized,
  getUserAttributes,
  clearPersonalizationData,
  isFromQueryParam,
  getActiveVariants,
  getLanguageCodeMap,
  trackImpression,
  trackEvent
};

export default personalizeService;

