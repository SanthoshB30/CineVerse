/**
 * Contentstack Personalize SDK Initialization
 * 
 * Initializes the Personalize SDK and makes it globally available
 * as window.csPersonalize for use throughout the application
 */

import Personalize from '@contentstack/personalize-edge-sdk';

/**
 * Initialize Personalize SDK
 * @returns {Promise<Object>} Personalize SDK instance
 */
export async function initPersonalize() {
  // Skip if not in browser environment
  if (typeof window === 'undefined') {
    console.warn('⚠️ Not in browser environment - skipping Personalize init');
    return null;
  }

  // Return existing instance if already initialized
  if (window.csPersonalize) {
    console.log('✅ Personalize already initialized');
    return window.csPersonalize;
  }

  try {
    // Get Project UID from environment
    const projectUid = process.env.REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID;

    if (!projectUid) {
      console.warn('⚠️ Personalize Project UID not configured');
      console.warn('   Add REACT_APP_CONTENTSTACK_PERSONALIZE_PROJECT_UID to your .env file');
      console.warn('   Personalization features will be disabled');
      return null;
    }

    console.log('🎯 Initializing Contentstack Personalize...');
    console.log('   Project UID:', projectUid);

    // Initialize the SDK
    await Personalize.init(projectUid);

    // Store globally for easy access
    window.csPersonalize = Personalize;

    console.log('✅ Personalize SDK initialized successfully');
    console.log('   Available methods:', Object.keys(Personalize));

    return Personalize;
  } catch (error) {
    console.error('❌ Failed to initialize Personalize SDK:', error);
    console.error('   Error details:', error.message);
    console.warn('   Personalization features will be disabled');
    return null;
  }
}

/**
 * Get the Personalize SDK instance
 * @returns {Object|null} Personalize SDK instance or null if not initialized
 */
export function getPersonalizeSDK() {
  if (typeof window === 'undefined') return null;
  return window.csPersonalize || null;
}

/**
 * Check if Personalize SDK is initialized
 * @returns {boolean} True if SDK is ready
 */
export function isPersonalizeReady() {
  return typeof window !== 'undefined' && !!window.csPersonalize;
}

