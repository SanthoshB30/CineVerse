import CryptoJS from 'crypto-js';
import logger from '../utils/logger';

// Environment variables - REQUIRED (no fallbacks for security)
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_SECRET;
const API_KEY = process.env.REACT_APP_CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN;
const MANAGEMENT_TOKEN = process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'development';

// Validate required environment variables
if (!SECRET_KEY) {
  console.error('SECURITY ERROR: REACT_APP_ENCRYPTION_SECRET is not configured');
}
if (!API_KEY) {
  console.error('SECURITY ERROR: REACT_APP_CONTENTSTACK_API_KEY is not configured');
}
if (!DELIVERY_TOKEN) {
  console.error('SECURITY ERROR: REACT_APP_CONTENTSTACK_DELIVERY_TOKEN is not configured');
}

const BASE_URL = 'https://cdn.contentstack.io/v3';
const MANAGEMENT_URL = 'https://api.contentstack.io/v3';

// Log Contentstack configuration on module load
logger.group('Auth Configuration');
logger.info(`API_KEY: ${API_KEY ? 'Configured' : 'Missing'}`);
logger.info(`DELIVERY_TOKEN: ${DELIVERY_TOKEN ? 'Configured' : 'Missing'}`);
logger.info(`MANAGEMENT_TOKEN: ${MANAGEMENT_TOKEN ? 'Configured' : 'Not set (localStorage only)'}`);
logger.info(`ENVIRONMENT: ${ENVIRONMENT}`);
logger.groupEnd();

/**
 * Encrypt password using AES encryption
 */
export const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

/**
 * Decrypt password (for verification)
 */
export const decryptPassword = (encryptedPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    logger.error('Password decryption failed');
    return null;
  }
};

/**
 * Sign Up - Create new user in Contentstack
 */
export const signUpUser = async (username, email, password) => {
  try {
    const encryptedPassword = encryptPassword(password);
    
    // Check if email already exists
    const existingUser = await checkEmailExists(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Try native array first, fallback to empty string if Contentstack expects text field
    const requestBody = {
      entry: {
        title: username.toLowerCase().replace(/\s+/g, '_'),
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
        created_on: new Date().toISOString(),
        profiles: [] // Will be converted based on Contentstack field type
      }
    };
    
    logger.info('Creating user account:', { username, email });

    const response = await fetch(
      `${MANAGEMENT_URL}/content_types/signup_user/entries?locale=en-us`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN || DELIVERY_TOKEN,
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      logger.error('Sign up failed:', errorData.error_message);
      throw new Error(errorData.error_message || 'Failed to create account');
    }

    const data = await response.json();
    
    logger.success('User account created successfully');
    
    // Publish the entry
    if (data.entry && data.entry.uid) {
      await publishEntry(data.entry.uid);
    }

    // Profiles is a native group field - comes back as array
    const profiles = data.entry.profiles || [];

    return {
      uid: data.entry.uid,
      username: data.entry.username,
      email: data.entry.email,
      profiles: profiles,
      created_on: data.entry.created_on
    };
  } catch (error) {
    logger.error('Sign up failed:', error.message);
    throw error;
  }
};

/**
 * Check if email already exists (checks both published and draft entries)
 */
const checkEmailExists = async (email) => {
  try {
    const query = { email: email.toLowerCase() };
    
    // First try delivery API (published entries)
    const deliveryResponse = await fetch(
      `${BASE_URL}/content_types/signup_user/entries?environment=${ENVIRONMENT}&query=${JSON.stringify(query)}`,
      {
        headers: {
          'api_key': API_KEY,
          'access_token': DELIVERY_TOKEN,
        }
      }
    );

    const deliveryData = await deliveryResponse.json();
    if (deliveryData.entries && deliveryData.entries.length > 0) {
      return true;
    }

    // If not found and management token available, check draft entries
    if (MANAGEMENT_TOKEN) {
      const managementResponse = await fetch(
        `${MANAGEMENT_URL}/content_types/signup_user/entries?query=${JSON.stringify(query)}&locale=en-us`,
        {
          headers: {
            'api_key': API_KEY,
            'authorization': MANAGEMENT_TOKEN,
          }
        }
      );

      const managementData = await managementResponse.json();
      return managementData.entries && managementData.entries.length > 0;
    }

    return false;
  } catch (error) {
    logger.error('Email verification failed:', error.message);
    return false;
  }
};

/**
 * Sign In - Query user and verify password (checks both published and draft entries)
 */
export const signInUser = async (email, password) => {
  try {
    const query = { email: email.toLowerCase() };
    let user = null;

    // First try delivery API (published entries)
    const deliveryResponse = await fetch(
      `${BASE_URL}/content_types/signup_user/entries?environment=${ENVIRONMENT}&query=${JSON.stringify(query)}`,
      {
        headers: {
          'api_key': API_KEY,
          'access_token': DELIVERY_TOKEN,
        }
      }
    );

    if (deliveryResponse.ok) {
      const deliveryData = await deliveryResponse.json();
      if (deliveryData.entries && deliveryData.entries.length > 0) {
        user = deliveryData.entries[0];
      }
    }

    // If not found and management token available, check draft entries
    if (!user && MANAGEMENT_TOKEN) {
      logger.info('Checking draft entries for user...');
      const managementResponse = await fetch(
        `${MANAGEMENT_URL}/content_types/signup_user/entries?query=${JSON.stringify(query)}&locale=en-us`,
        {
          headers: {
            'api_key': API_KEY,
            'authorization': MANAGEMENT_TOKEN,
          }
        }
      );

      if (managementResponse.ok) {
        const managementData = await managementResponse.json();
        if (managementData.entries && managementData.entries.length > 0) {
          user = managementData.entries[0];
          logger.info('User located in draft entries');
        }
      }
    }

    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const decrypted = decryptPassword(user.password);
    if (decrypted !== password) {
      throw new Error('Invalid email or password');
    }

    // Profiles is a native group field - comes back as array
    const profiles = user.profiles || [];

    logger.success(`Sign in successful (${profiles.length} profiles)`);

    // Update last login
    await updateLastLogin(user.uid);

    return {
      uid: user.uid,
      username: user.username,
      email: user.email,
      profiles: profiles,
      created_on: user.created_on,
      last_login: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Sign in failed:', error.message);
    throw error;
  }
};

/**
 * Update last login timestamp
 */
const updateLastLogin = async (userUid) => {
  try {
    if (!MANAGEMENT_TOKEN) {
      logger.warn('Management token not available, skipping last login update');
      return;
    }

    const requestBody = {
      entry: {
        last_login: new Date().toISOString()
      }
    };

    const response = await fetch(
      `${MANAGEMENT_URL}/content_types/signup_user/entries/${userUid}?locale=en-us`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN,
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (response.ok) {
      // Publish the updated entry
      await publishEntry(userUid);
    }
  } catch (error) {
    logger.error('Failed to update last login:', error.message);
    // Don't throw error, login should still succeed
  }
};

/**
 * Update user profiles
 */
export const updateUserProfiles = async (userUid, profiles) => {
  try {
    logger.info('Updating user profiles...', { userUid, profileCount: profiles.length });
    
    if (!MANAGEMENT_TOKEN) {
      logger.warn('Management token not available, profiles saved to localStorage only');
      return profiles;
    }

    // Send profiles as native array (Group field in Contentstack)
    const requestBody = {
      entry: {
        profiles: profiles
      }
    };

    const response = await fetch(
      `${MANAGEMENT_URL}/content_types/signup_user/entries/${userUid}?locale=en-us`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN,
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      logger.error('Profile update failed:', errorData.error_message);
      throw new Error(errorData.error_message || 'Failed to update profiles');
    }

    const data = await response.json();
    
    // Publish the updated entry
    await publishEntry(userUid);
    
    // Profiles come back as native array from group field
    const returnedProfiles = data.entry.profiles || [];
    
    logger.success(`Profiles updated successfully (${returnedProfiles.length} profiles)`);
    return returnedProfiles;
  } catch (error) {
    logger.error('Profile update failed:', error.message);
    throw error;
  }
};

/**
 * Get entry details from management API
 */
const getEntryDetails = async (entryUid) => {
  try {
    if (!MANAGEMENT_TOKEN) {
      return null;
    }

    const response = await fetch(
      `${MANAGEMENT_URL}/content_types/signup_user/entries/${entryUid}?locale=en-us`,
      {
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN,
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.entry;
    }
    return null;
  } catch (error) {
    logger.error('Failed to get entry details:', error.message);
    return null;
  }
};

/**
 * Publish entry (make it live)
 */
const publishEntry = async (entryUid) => {
  try {
    if (!MANAGEMENT_TOKEN) {
      logger.warn('Management token not available, skipping publish');
      return;
    }

    // Get entry details first to check version and state
    const entryDetails = await getEntryDetails(entryUid);
    if (!entryDetails) {
      logger.warn('Could not fetch entry details, skipping publish');
      return;
    }

    const publishPayload = {
      entry: {
        environments: [ENVIRONMENT],
        locales: ['en-us']
      }
    };

    // Include version if available (required by some Contentstack configurations)
    if (entryDetails._version) {
      publishPayload.entry.version = entryDetails._version;
    }

    const response = await fetch(
      `${MANAGEMENT_URL}/content_types/signup_user/entries/${entryUid}/publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': API_KEY,
          'authorization': MANAGEMENT_TOKEN,
        },
        body: JSON.stringify(publishPayload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Handle specific error cases
      if (response.status === 422) {
        // Check if it's already published error
        if (errorData?.error_message?.includes('already published') || 
            errorData?.error_code === 'ENTRY_ALREADY_PUBLISHED') {
          return; // This is not an error, just skip
        }
        
        // Check if it's a workflow issue
        if (errorData?.error_message?.includes('workflow') || 
            errorData?.error_code === 'WORKFLOW_REQUIRED') {
          logger.warn('Entry requires workflow approval');
          return;
        }

        // Check if it's a validation error
        if (errorData?.error_code === 357 || 
            errorData?.error_message?.includes('valid data') || 
            errorData?.error_message?.includes('validation') || 
            errorData?.errors) {
          logger.info('Entry saved as draft (validation pending)');
          return;
        }
      }
      
      logger.warn(`Publish skipped (${response.status}): Entry saved successfully`);
    } else {
      logger.success('Entry published');
    }
  } catch (error) {
    logger.error('Publish operation failed:', error.message);
    // Don't throw - publishing failure shouldn't break the operation
  }
};

/**
 * Get user by UID (checks both published and draft entries)
 */
export const getUserByUid = async (userUid) => {
  try {
    // First try delivery API (published entries)
    const deliveryResponse = await fetch(
      `${BASE_URL}/content_types/signup_user/entries/${userUid}?environment=${ENVIRONMENT}`,
      {
        headers: {
          'api_key': API_KEY,
          'access_token': DELIVERY_TOKEN,
        }
      }
    );

    if (deliveryResponse.ok) {
      const data = await deliveryResponse.json();
      
      // Profiles is a native group field - comes back as array
      const profiles = data.entry.profiles || [];
      
      return {
        uid: data.entry.uid,
        username: data.entry.username,
        email: data.entry.email,
        profiles: profiles,
        created_on: data.entry.created_on,
        last_login: data.entry.last_login
      };
    }

    // If not found and management token available, check draft entries
    if (MANAGEMENT_TOKEN) {
      logger.info('Checking draft entries for user...');
      const managementResponse = await fetch(
        `${MANAGEMENT_URL}/content_types/signup_user/entries/${userUid}?locale=en-us`,
        {
          headers: {
            'api_key': API_KEY,
            'authorization': MANAGEMENT_TOKEN,
          }
        }
      );

      if (managementResponse.ok) {
        const managementData = await managementResponse.json();
        logger.info('User located in draft entries');
        
        // Profiles is a native group field - comes back as array
        const profiles = managementData.entry.profiles || [];
        
        return {
          uid: managementData.entry.uid,
          username: managementData.entry.username,
          email: managementData.entry.email,
          profiles: profiles,
          created_on: managementData.entry.created_on,
          last_login: managementData.entry.last_login
        };
      }
    }

    throw new Error('Failed to fetch user');
  } catch (error) {
    logger.error('Failed to fetch user:', error.message);
    throw error;
  }
};

