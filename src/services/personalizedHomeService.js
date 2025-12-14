/**
 * Personalized Home Page Service
 * 
 * This service fetches personalized home page content from Contentstack
 * using the Personalize service to retrieve the correct variant.
 */

import * as Contentstack from 'contentstack';
import personalizeService from './personalizeService';
import logger from '../utils/logger';

// Contentstack Stack Configuration
const Stack = Contentstack.Stack({
  api_key: process.env.REACT_APP_CONTENTSTACK_API_KEY,
  delivery_token: process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'testing',
  region: process.env.REACT_APP_CONTENTSTACK_REGION || 'us'
});

/**
 * Retrieves variant aliases from the Personalize service
 * @returns {string} Comma-separated variant aliases string for .variants() API
 */
const getVariantAliasesString = () => {
  try {
    const variantAlias = personalizeService.getVariantAlias();
    
    if (variantAlias) {
      logger.success('Variant aliases from SDK:', variantAlias);
      console.log('[Personalize] Variant string for .variants() API:', variantAlias);
      return variantAlias;
    }
    
    logger.info('No variant aliases available - using default content');
    return '';

  } catch (error) {
    logger.error('Failed to get variant aliases:', error.message);
    return '';
  }
};

/**
 * Fetches the personalized home page entry from Contentstack
 * 
 * This function uses Query API to find the home_page entry,
 * which doesn't require knowing the exact entry UID.
 * 
 * @returns {Promise<{
 *   featured_movies: Array,
 *   trending_movies: Array,
 *   page_title: string,
 *   page_subtitle: string,
 *   variant_applied: string,
 *   error: string | null
 * }>}
 */
export const getPersonalizedHomePage = async () => {
  try {
    logger.group('Personalized Home Page Fetch');
    logger.info('Fetching personalized home page content...');

    // Validate Contentstack configuration
    if (!process.env.REACT_APP_CONTENTSTACK_API_KEY || 
        !process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN) {
      logger.error('Contentstack credentials not configured');
      logger.groupEnd();
      return {
        featured_movies: [],
        trending_movies: [],
        page_title: null,
        page_subtitle: null,
        variant_applied: null,
        error: 'Contentstack credentials not configured'
      };
    }

    // Get variant aliases using the Personalize SDK pattern
    const variantAliases = getVariantAliasesString();

    // Use Query API to find home_page entries (doesn't require knowing UID)
    let query = Stack.ContentType('home_page').Query();

    // PERSONALIZE: Apply variants to the query
    if (variantAliases) {
      query = query.variants(variantAliases);
      logger.success('Personalization variants applied:', variantAliases);
    } else {
      logger.info('No variant aliases - fetching default content');
    }

    // Fetch entries with movie references
    const result = await query
      .includeReference(['featured_movies', 'trending_movies'])
      .includeReference(['featured_movies.genre', 'featured_movies.director'])
      .includeReference(['trending_movies.genre', 'trending_movies.director'])
      .toJSON()
      .find();

    const entries = result[0] || [];

    if (entries.length === 0) {
      logger.warn('No home_page entries found');
      logger.groupEnd();
      return {
        featured_movies: [],
        trending_movies: [],
        page_title: null,
        page_subtitle: null,
        variant_applied: variantAliases || 'default',
        error: 'No home page content found'
      };
    }

    // Use the first home_page entry found
    const homePageEntry = entries[0];
    logger.info('Found home_page entry:', homePageEntry.uid);

    // Extract featured movies from the entry
    const featuredMovies = (homePageEntry.featured_movies || []).map(movie => ({
      uid: movie.uid,
      title: movie.title,
      slug: movie.slug,
      description: movie.description,
      release_year: movie.release_year,
      duration: movie.duration,
      rating: movie.rating,
      featured: movie.featured || false,
      language: movie.language,
      poster_image: movie.poster_image,
      banner_image: movie.banner_image,
      trailer_url: movie.trailer_url,
      streaming_links: movie.streaming_links || [],
      genre: Array.isArray(movie.genre) ? movie.genre : [],
      director: Array.isArray(movie.director) ? movie.director : []
    }));

    // Extract trending movies from the entry
    const trendingMovies = (homePageEntry.trending_movies || []).map(movie => ({
      uid: movie.uid,
      title: movie.title,
      slug: movie.slug,
      description: movie.description,
      release_year: movie.release_year,
      duration: movie.duration,
      rating: movie.rating,
      featured: movie.featured || false,
      language: movie.language,
      poster_image: movie.poster_image,
      banner_image: movie.banner_image,
      trailer_url: movie.trailer_url,
      streaming_links: movie.streaming_links || [],
      genre: Array.isArray(movie.genre) ? movie.genre : [],
      director: Array.isArray(movie.director) ? movie.director : []
    }));

    logger.success('Home page content fetched successfully');
    logger.data('Content Summary', {
      featured_movies: featuredMovies.length,
      trending_movies: trendingMovies.length,
      variant_applied: variantAliases || 'default'
    });
    logger.groupEnd();

    return {
      featured_movies: featuredMovies,
      trending_movies: trendingMovies,
      page_title: homePageEntry.page_title || null,
      page_subtitle: homePageEntry.page_subtitle || null,
      variant_applied: variantAliases || 'default',
      error: null
    };

  } catch (error) {
    logger.error('Failed to fetch personalized home page:', error.message);
    logger.groupEnd();
    return {
      featured_movies: [],
      trending_movies: [],
      page_title: null,
      page_subtitle: null,
      variant_applied: null,
      error: error.message
    };
  }
};

/**
 * Sets user attributes for personalization
 * Call this when user selects language or profile type
 * 
 * STEP 8: Set User Attributes (Manual Trigger)
 * 
 * @param {Object} attributes - User attributes to set
 * @param {string} [attributes.preferred_language] - User's preferred language (e.g., 'Tamil')
 * @param {string} [attributes.profile_type] - Profile type (e.g., 'kids', 'adult')
 * @param {string} [attributes.favorite_genre] - User's favorite genre
 * @returns {Promise<void>}
 * 
 * @example
 * await setUserAttributes({ preferred_language: 'tamil' });
 * await setUserAttributes({ profile_type: 'kids' });
 */
export const setUserAttributes = async (attributes) => {
  try {
    logger.info('Setting user attributes:', attributes);
    
    // Use personalizeService
    const result = await personalizeService.setUserAttributes(attributes);
    
    logger.success('User attributes set successfully');
    
    return result;
    
  } catch (error) {
    logger.error('Failed to set user attributes:', error.message);
    throw error;
  }
};

/**
 * Gets the current variant param for debugging/verification
 * 
 * Expected values:
 * - Tamil user -> 'tamil_movies'
 * - Kids profile -> 'kids_content'
 * - New user -> null or 'default'
 * 
 * @returns {string|null}
 */
export const getCurrentVariantParam = () => {
  try {
    return personalizeService.getVariantParam();
  } catch (error) {
    logger.error('Failed to get variant param:', error.message);
    return null;
  }
};

/**
 * Fetches home page using Query API (alternative to Entry API)
 * Useful when entry UID is not known
 * 
 * @returns {Promise<Object>}
 */
export const getPersonalizedHomePageByQuery = async () => {
  try {
    logger.info('Fetching home page via Query API...');

    const variantAliases = getVariantAliasesString();

    let query = Stack.ContentType('home_page').Query();

    if (variantAliases) {
      query = query.variants(variantAliases);
    }

    const result = await query
      .includeReference(['featured_movies', 'trending_movies'])
      .includeReference(['featured_movies.genre', 'featured_movies.director'])
      .includeReference(['trending_movies.genre', 'trending_movies.director'])
      .toJSON()
      .find();

    const entries = result[0] || [];

    if (entries.length === 0) {
      return {
        featured_movies: [],
        trending_movies: [],
        page_title: null,
        page_subtitle: null,
        variant_applied: variantAliases || 'default',
        error: 'No home page content found'
      };
    }

    const homePageEntry = entries[0];

    return {
      featured_movies: homePageEntry.featured_movies || [],
      trending_movies: homePageEntry.trending_movies || [],
      page_title: homePageEntry.page_title || null,
      page_subtitle: homePageEntry.page_subtitle || null,
      variant_applied: variantAliases || 'default',
      error: null
    };

  } catch (error) {
    logger.error('Failed to fetch home page by query:', error.message);
    return { error: error.message };
  }
};

const personalizedHomeService = {
  getPersonalizedHomePage,
  getPersonalizedHomePageByQuery,
  setUserAttributes,
  getCurrentVariantParam
};

export default personalizedHomeService;
