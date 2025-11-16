/**
 * Contentstack Personalize SDK Initialization
 * 
 * Initializes the Personalize SDK using the browser SDK loaded from CDN
 * Makes it globally available as window.csPersonalize
 */

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

  // Wait for SDK to be available from CDN
  const maxAttempts = 50; // Wait up to 5 seconds
  let attempts = 0;
  
  while (!window.ContentstackPersonalize && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }

  if (!window.ContentstackPersonalize) {
    console.error('❌ Contentstack Personalize SDK not loaded from CDN');
    console.error('   Make sure the script tag is in index.html:');
    console.error('   <script src="https://cdn.contentstack.io/personalize/latest/personalize.min.js"></script>');
    return null;
  }

  // Return existing instance if already initialized
  if (window.csPersonalize) {
    console.log('✅ Personalize already initialized');
    return window.csPersonalize;
  }

  try {
    const apiKey = process.env.REACT_APP_CONTENTSTACK_API_KEY;
    const environment = process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'development';

    if (!apiKey) {
      console.warn('⚠️ Contentstack API Key not configured');
      console.warn('   Add REACT_APP_CONTENTSTACK_API_KEY to your .env file');
      return null;
    }

    console.log('🎯 Initializing Contentstack Personalize...');
    console.log('   API Key:', apiKey.substring(0, 10) + '...');
    console.log('   Environment:', environment);

    // Initialize using the browser SDK
    await window.ContentstackPersonalize.init({
      apiKey: apiKey,
      environment: environment,
    });

    // Create shorthand reference
    window.csPersonalize = window.ContentstackPersonalize;

    console.log('✅ Personalize SDK initialized successfully');
    console.log('   SDK available at: window.csPersonalize');

    return window.ContentstackPersonalize;
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

