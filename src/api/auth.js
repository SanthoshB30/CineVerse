import CryptoJS from 'crypto-js';

// Use environment variable or fallback (in production, use env variable only)
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_SECRET || 'cineverse-secret-key-2025';

const BASE_URL = 'https://cdn.contentstack.io/v3';
const MANAGEMENT_URL = 'https://api.contentstack.io/v3';
const API_KEY = process.env.REACT_APP_CONTENTSTACK_API_KEY || 'blt3c4b3e4f90b5f8a3';
const DELIVERY_TOKEN = process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN || 'cs5fad7fd567df567ff99cd99c';
const MANAGEMENT_TOKEN = process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'development';

// Log Contentstack configuration on module load
console.log('🔧 Contentstack Auth Configuration:');
console.log('   API_KEY:', API_KEY ? '✅ Set' : '❌ Missing');
console.log('   DELIVERY_TOKEN:', DELIVERY_TOKEN ? '✅ Set' : '❌ Missing');
console.log('   MANAGEMENT_TOKEN:', MANAGEMENT_TOKEN ? '✅ Set' : '❌ Missing (profiles will only save to localStorage)');
console.log('   ENVIRONMENT:', ENVIRONMENT);

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
    console.error('Error decrypting password:', error);
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
    
    console.log('📤 Creating user in Contentstack:', { username, email });

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
      console.error('Sign up error:', errorData);
      throw new Error(errorData.error_message || 'Failed to create account');
    }

    const data = await response.json();
    
    console.log('✅ Sign up successful, entry created:', data.entry);
    
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
    console.error('Sign up error:', error);
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
    console.error('Error checking email:', error);
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
      console.info('User not found in published entries, checking draft entries...');
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
          console.info('User found in draft entries');
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

    console.log('✅ Sign in successful, user profiles:', profiles);

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
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Update last login timestamp
 */
const updateLastLogin = async (userUid) => {
  try {
    if (!MANAGEMENT_TOKEN) {
      console.warn('Management token not available, skipping last login update');
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
      const data = await response.json();
      // Publish the updated entry
      await publishEntry(userUid);
    }
  } catch (error) {
    console.error('Error updating last login:', error);
    // Don't throw error, login should still succeed
  }
};

/**
 * Update user profiles
 */
export const updateUserProfiles = async (userUid, profiles) => {
  try {
    console.log('📝 updateUserProfiles called with:', { userUid, profiles });
    
    if (!MANAGEMENT_TOKEN) {
      console.warn('⚠️ Management token not available, profiles will only save to localStorage');
      console.warn('⚠️ To enable Contentstack persistence, add REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN to your .env file');
      return profiles;
    }

    // Send profiles as native array (Group field in Contentstack)
    const requestBody = {
      entry: {
        profiles: profiles
      }
    };

    console.log('📤 Sending to Contentstack:', JSON.stringify(requestBody, null, 2));

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
      console.error('❌ Contentstack update failed:', errorData);
      console.error('❌ Error details:', JSON.stringify(errorData, null, 2));
      throw new Error(errorData.error_message || 'Failed to update profiles');
    }

    const data = await response.json();
    console.log('✅ Contentstack response:', JSON.stringify(data, null, 2));
    
    // Publish the updated entry
    await publishEntry(userUid);
    
    // Profiles come back as native array from group field
    const returnedProfiles = data.entry.profiles || [];
    
    console.log('✅ Profiles updated successfully in Contentstack:', returnedProfiles);
    return returnedProfiles;
  } catch (error) {
    console.error('❌ Error updating profiles:', error);
    console.error('❌ Full error details:', error.message);
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
    console.error('Error getting entry details:', error);
    return null;
  }
};

/**
 * Publish entry (make it live)
 */
const publishEntry = async (entryUid) => {
  try {
    if (!MANAGEMENT_TOKEN) {
      console.warn('Management token not available, skipping publish');
      return;
    }

    // Get entry details first to check version and state
    const entryDetails = await getEntryDetails(entryUid);
    if (!entryDetails) {
      console.warn('Could not fetch entry details, skipping publish');
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
        // Entry might already be published or in a workflow
        console.warn('Entry publish returned 422 - entry may already be published or require workflow approval:', errorData);
        
        // Log detailed validation errors if available
        if (errorData?.errors) {
          console.warn('Detailed validation errors:', JSON.stringify(errorData.errors, null, 2));
        }
        
        // Check if it's already published error
        if (errorData?.error_message?.includes('already published') || 
            errorData?.error_code === 'ENTRY_ALREADY_PUBLISHED') {
          console.info('Entry is already published, continuing...');
          return; // This is not an error, just skip
        }
        
        // Check if it's a workflow issue
        if (errorData?.error_message?.includes('workflow') || 
            errorData?.error_code === 'WORKFLOW_REQUIRED') {
          console.warn('Entry requires workflow approval. Publishing skipped.');
          return; // Don't block the operation
        }

        // Check if it's a validation error (error_code 357 is validation failure)
        if (errorData?.error_code === 357 || 
            errorData?.error_message?.includes('valid data') || 
            errorData?.error_message?.includes('validation') || 
            errorData?.errors) {
          console.warn('Entry validation failed. Entry saved but not published. This is normal for draft entries.');
          console.info('The entry is available in draft mode and can be used for authentication.');
          return; // Don't block the operation - draft entries work fine
        }
      }
      
      console.warn(`Failed to publish entry (${response.status}):`, errorData);
      console.info('Entry saved successfully but not published. This is acceptable.');
    } else {
      console.info('Entry published successfully');
    }
  } catch (error) {
    console.error('Error publishing entry:', error);
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
      console.info('User not found in published entries, checking draft entries...');
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
        console.info('User found in draft entries');
        
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
    console.error('Error fetching user:', error);
    throw error;
  }
};

