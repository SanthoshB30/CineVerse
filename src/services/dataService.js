/**
 * ============================================================================
 * DATA SERVICE - Contentstack Integration
 * ============================================================================
 * 
 * This service fetches and caches data from Contentstack.
 * All data is fetched once on initialization and cached for performance.
 * 
 * ============================================================================
 */

import * as Contentstack from 'contentstack';
import logger from '../utils/logger';

/**
 * ============================================================================
 * CONTENTSTACK CONFIGURATION
 * ============================================================================
 */

// Initialize Contentstack SDK
const Stack = Contentstack.Stack({
  api_key: process.env.REACT_APP_CONTENTSTACK_API_KEY,
  delivery_token: process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'testing',
  region: process.env.REACT_APP_CONTENTSTACK_REGION || 'us'
});

/**
 * Get variant aliases from Contentstack Personalize SDK
 * These aliases are used to fetch personalized content variants
 */
const getVariantAliases = () => {
  try {
    // Check if Personalize SDK is available and has variant aliases
    if (window.csPersonalize && typeof window.csPersonalize.getVariantAliases === 'function') {
      const aliases = window.csPersonalize.getVariantAliases();
      if (aliases && aliases.length > 0) {
        logger.info('Using variant aliases from Personalize SDK:', aliases);
        return aliases;
      }
    }
    
    // Fallback: check if variant aliases are stored globally
    if (window.__PERSONALIZE_VARIANTS__ && window.__PERSONALIZE_VARIANTS__.length > 0) {
      logger.info('Using stored variant aliases:', window.__PERSONALIZE_VARIANTS__);
      return window.__PERSONALIZE_VARIANTS__;
    }
    
    return [];
  } catch (error) {
    logger.error('Failed to get variant aliases:', error);
    return [];
  }
};

/**
 * Add personalization to a Contentstack query using Variant Aliases
 * This is the proper way to use Contentstack Personalize SDK
 */
const addPersonalizationToQuery = (query) => {
  try {
    const variantAliases = getVariantAliases();
    
    if (variantAliases && variantAliases.length > 0) {
      // Add variant aliases to the query
      // This tells Contentstack to return personalized variants
      query.variants(variantAliases);
      logger.success('Personalization variants applied:', variantAliases);
    } else {
      logger.info('No variant aliases available - returning default content');
    }
  } catch (error) {
    logger.error('Failed to add personalization to query:', error);
  }
  
  return query;
};

// Validate configuration
const validateConfig = () => {
  const apiKey = process.env.REACT_APP_CONTENTSTACK_API_KEY;
  const deliveryToken = process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN;
  
  if (!apiKey || !deliveryToken) {
    logger.error('Contentstack credentials missing. Please verify .env configuration.');
    return false;
  }
  
  logger.group('Contentstack Configuration');
  logger.success('Configuration validated');
  logger.info(`Environment: ${process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'testing'}`);
  logger.info(`Region: ${process.env.REACT_APP_CONTENTSTACK_REGION || 'us'}`);
  logger.info(`API Key: ${apiKey.substring(0, 10)}...`);
  logger.groupEnd();
  return true;
};

/**
 * ============================================================================
 * DATA STORE CLASS
 * ============================================================================
 */

class DataStore {
  constructor() {
    this.movies = [];
    this.genres = [];
    this.directors = [];
    this.actors = [];
    this.reviews = [];
    this.appSettings = null;
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Initialize the data store by fetching from Contentstack
   */
  async initialize() {
    // If already initialized, return
    if (this.isInitialized) {
      return { success: true, message: 'Already initialized' };
    }

    // If initialization is in progress, return the existing promise
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Start initialization
    this.initializationPromise = this._loadFromContentstack();
    return this.initializationPromise;
  }

  /**
   * Load all data from Contentstack
   */
  async _loadFromContentstack() {
    try {
      logger.group('Contentstack Data Loading');
      logger.info('Initializing data fetch...');
      
      // Validate configuration first
      if (!validateConfig()) {
        throw new Error('Invalid Contentstack configuration');
      }

      const startTime = Date.now();

      // Fetch all content types sequentially to see which one fails
      logger.info('Fetching content types...');
      
      const appSettings = await this._fetchAppSettings();
      const directors = await this._fetchDirectors();
      const genres = await this._fetchGenres();
      const actors = await this._fetchActors();
      const movies = await this._fetchMovies();
      const reviews = await this._fetchReviews();

      // Store in memory
      this.appSettings = appSettings;
      this.directors = directors;
      this.genres = genres;
      this.actors = actors;
      this.movies = movies;
      this.reviews = reviews;

      // Mark as initialized
      this.isInitialized = true;
      this.initializationPromise = null;

      const endTime = Date.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);

      logger.separator();
      logger.success(`Data loaded successfully in ${loadTime}s`);
      logger.data('Content Summary', {
        appSettings: this.appSettings ? 'Loaded' : 'Not found',
        directors: this.directors.length,
        genres: this.genres.length,
        actors: this.actors.length,
        movies: this.movies.length,
        reviews: this.reviews.length
      });
      logger.groupEnd();

      // Warning if no data
      if (this.genres.length === 0) {
        logger.warn('No genres found. Verify content type exists and entries are published.');
      }

      return {
        success: true,
        message: 'Data loaded successfully from Contentstack',
        stats: {
          movies: this.movies.length,
          genres: this.genres.length,
          directors: this.directors.length,
          actors: this.actors.length,
          reviews: this.reviews.length,
          loadTime: loadTime
        }
      };
    } catch (error) {
      logger.error('Failed to load data from Contentstack:', error.message);
      logger.groupEnd();
      this.initializationPromise = null;
      return {
        success: false,
        message: 'Failed to load data from Contentstack: ' + error.message,
        error: error.message
      };
    }
  }

  /**
   * Fetch App Settings from Contentstack
   */
  async _fetchAppSettings() {
    try {
      logger.info('Fetching app settings...');
      const Query = Stack.ContentType('app_settings').Query();
      const result = await Query.toJSON().find();
      
      const entries = result[0] || [];
      logger.info(`App settings: ${entries.length} entries found`);
      
      // Return the first entry (singleton)
      if (entries.length > 0) {
        return {
          uid: entries[0].uid,
          title: entries[0].title,
          theme_colors: entries[0].theme_colors || {},
          background_image: entries[0].background_image
        };
      }
      return null;
    } catch (error) {
      logger.error('Failed to fetch app settings:', error.message);
      return null;
    }
  }

  /**
   * Fetch Directors from Contentstack
   */
  async _fetchDirectors() {
    try {
      logger.info('Fetching directors...');
      let Query = Stack.ContentType('director').Query();
      
      // Add personalization for directors
      Query = addPersonalizationToQuery(Query);
      
      const result = await Query.toJSON().find();
      
      const entries = result[0] || [];
      logger.info(`Directors: ${entries.length} entries found`);
      
      return entries.map(entry => ({
        uid: entry.uid,
        title: entry.title || entry.name,
        name: entry.name,
        slug: entry.slug,
        bio: entry.bio,
        birth_year: entry.birth_year,
        profile_image: entry.profile_image
      }));
    } catch (error) {
      logger.error('Failed to fetch directors:', error.message);
      return [];
    }
  }

  /**
   * Fetch Genres from Contentstack
   */
  async _fetchGenres() {
    try {
      logger.info('Fetching genres...');
      let Query = Stack.ContentType('genre').Query();
      
      // Add personalization
      Query = addPersonalizationToQuery(Query);
      
      const result = await Query.toJSON().find();
      
      const entries = result[0] || [];
      logger.info(`Genres: ${entries.length} entries found`);
      
      return entries.map(entry => ({
        uid: entry.uid,
        title: entry.title || entry.name,
        name: entry.name,
        slug: entry.slug,
        description: entry.description,
        genre_image: entry.genre_image
      }));
    } catch (error) {
      logger.error('Failed to fetch genres:', error.message);
      return [];
    }
  }

  /**
   * Fetch Actors from Contentstack
   */
  async _fetchActors() {
    try {
      logger.info('Fetching actors...');
      let Query = Stack.ContentType('actor').Query();
      
      // Add personalization for actors
      Query = addPersonalizationToQuery(Query);
      
      // Include the movies reference - movies is an array inside each filmography group item
      const result = await Query
        .includeReference(['filmography.movies'])
        .includeReference(['filmography.movies.genre'])
        .includeReference(['filmography.movies.director'])
        .toJSON()
        .find();
      
      const entries = result[0] || [];
      logger.info(`Actors: ${entries.length} entries found`);
      
      return entries.map(entry => {
        // Extract movies from filmography group (which is an array of groups)
        let movies = [];
        
        if (entry.filmography && Array.isArray(entry.filmography)) {
          // Each filmography item is a group with a movies array
          entry.filmography.forEach((filmItem, index) => {
            // movies is an array inside each filmography group item
            if (filmItem.movies && Array.isArray(filmItem.movies)) {
              filmItem.movies.forEach(movie => {
                // Check if movie is fully populated (has title) or just a reference (only uid)
                if (!movie.title) {
                  return;
                }
                
                // Movie is fully populated, add it
                movies.push({
                  uid: movie.uid,
                  title: movie.title,
                  slug: movie.slug,
                  description: movie.description,
                  release_year: movie.release_year,
                  duration: movie.duration,
                  rating: movie.rating,
                  featured: movie.featured || false,
                  poster_image: movie.poster_image,
                  banner_image: movie.banner_image,
                  trailer_url: movie.trailer_url,
                  streaming_links: movie.streaming_links || [],
                  genre: Array.isArray(movie.genre) ? movie.genre : [],
                  director: Array.isArray(movie.director) ? movie.director : []
                });
              });
            }
          });
        }
        
        return {
          uid: entry.uid,
          title: entry.title || entry.name,
          name: entry.name,
          slug: entry.slug,
          bio: entry.bio,
          birth_year: entry.birth_year,
          profile_image: entry.profile_image,
          movies: movies
        };
      });
    } catch (error) {
      logger.error('Failed to fetch actors:', error.message);
      return [];
    }
  }

  /**
   * Fetch Movies from Contentstack
   */
  async _fetchMovies() {
    try {
      logger.info('Fetching movies...');
      let Query = Stack.ContentType('movie').Query();
      
      // Add personalization - This is the key part for personalized content!
      Query = addPersonalizationToQuery(Query);
      
      const result = await Query
        .includeReference('genre')
        .includeReference('director')
        .toJSON()
        .find();
      
      const entries = result[0] || [];
      logger.info(`Movies: ${entries.length} entries found`);
      
      return entries.map(entry => ({
        uid: entry.uid,
        title: entry.title,
        slug: entry.slug,
        description: entry.description,
        release_year: entry.release_year,
        duration: entry.duration,
        rating: entry.rating,
        featured: entry.featured || false,
        poster_image: entry.poster_image,
        banner_image: entry.banner_image,
        trailer_url: entry.trailer_url,
        streaming_links: entry.streaming_links || [],
        genre: Array.isArray(entry.genre) ? entry.genre : [],
        director: Array.isArray(entry.director) ? entry.director : []
      }));
    } catch (error) {
      logger.error('Failed to fetch movies:', error.message);
      return [];
    }
  }

  /**
   * Fetch Reviews from Contentstack
   */
  async _fetchReviews() {
    try {
      logger.info('Fetching reviews...');
      const Query = Stack.ContentType('reviewnew').Query();
      const result = await Query
        .includeReference('movie')
        .toJSON()
        .find();
      
      const entries = result[0] || [];
      logger.info(`Reviews: ${entries.length} entries found`);
      
      return entries.map(entry => ({
        uid: entry.uid,
        reviewer_name: entry.reviewer_name,
        rating: entry.rating,
        review_text: entry.review_text,
        review_date: entry.review_date,
        movie: entry.movie?.[0] || null,
        movie_uid: entry.movie?.[0]?.uid || null,
        upvotes: entry.upvotes || 0,
        downvotes: entry.downvotes || 0
      }));
    } catch (error) {
      logger.error('Failed to fetch reviews:', error.message);
      return [];
    }
  }

  /**
   * Refresh/reload data from Contentstack
   */
  async refresh() {
    logger.info('Refreshing data from Contentstack...');
    this.isInitialized = false;
    this.initializationPromise = null;
    return await this.initialize();
  }

  /**
   * Check if data store is ready
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Get initialization stats
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      appSettings: !!this.appSettings,
      movies: this.movies.length,
      genres: this.genres.length,
      directors: this.directors.length,
      actors: this.actors.length,
      reviews: this.reviews.length
    };
  }

  /**
   * Get app settings
   */
  getAppSettings() {
    return this.appSettings;
  }
}

// Create singleton instance
const dataStore = new DataStore();

/**
 * ============================================================================
 * INITIALIZATION FUNCTIONS
 * ============================================================================
 */

/**
 * Initialize the data store (call this on app startup)
 */
export const initializeDataStore = async () => {
  return await dataStore.initialize();
};

/**
 * Refresh the data store
 */
export const refreshDataStore = async () => {
  return await dataStore.refresh();
};

/**
 * Check if data store is ready
 */
export const isDataStoreReady = () => {
  return dataStore.isReady();
};

/**
 * Get data store stats
 */
export const getDataStoreStats = () => {
  return dataStore.getStats();
};

/**
 * Get app settings
 */
export const getAppSettings = () => {
  return dataStore.getAppSettings();
};

/**
 * ============================================================================
 * MOVIE QUERIES
 * ============================================================================
 */

/**
 * Get all movies
 */
export const getAllMovies = () => {
  if (!dataStore.isInitialized) {
    logger.warn('Data store not initialized');
    return [];
  }
  return [...dataStore.movies];
};

/**
 * Get featured movies
 */
export const getFeaturedMovies = () => {
  if (!dataStore.isInitialized) return [];
  return dataStore.movies.filter(movie => movie.featured === true);
};

/**
 * Get upcoming movies (for profile page background slideshow)
 */
export const getUpcomingMovies = () => {
  if (!dataStore.isInitialized) return [];
  return dataStore.movies.filter(movie => movie.upcoming === true);
};

/**
 * Get movie by slug
 */
export const getMovieBySlug = (slug) => {
  if (!dataStore.isInitialized) return null;
  return dataStore.movies.find(movie => movie.slug === slug) || null;
};

/**
 * Get movie by UID
 */
export const getMovieByUid = (uid) => {
  if (!dataStore.isInitialized) return null;
  return dataStore.movies.find(movie => movie.uid === uid) || null;
};

/**
 * Get movies by genre slug
 */
export const getMoviesByGenre = (genreSlug) => {
  if (!dataStore.isInitialized) return [];
  
  // Find the genre
  const genre = dataStore.genres.find(g => g.slug === genreSlug);
  if (!genre) return [];

  // Filter movies that include this genre
  return dataStore.movies.filter(movie => 
    movie.genre?.some(g => g.uid === genre.uid)
  );
};

/**
 * Get movies by genre name (for chatbot)
 */
export const getMoviesByGenreName = (genreName) => {
  if (!dataStore.isInitialized) return [];
  
  return dataStore.movies.filter(movie => 
    movie.genre?.some(g => 
      g.name?.toLowerCase().includes(genreName.toLowerCase())
    )
  );
};

/**
 * Get movies by director slug
 */
export const getMoviesByDirector = (directorSlug) => {
  if (!dataStore.isInitialized) return [];
  
  // Find the director
  const director = dataStore.directors.find(d => d.slug === directorSlug);
  if (!director) return [];

  // Filter movies that include this director
  return dataStore.movies.filter(movie => 
    movie.director?.some(d => d.uid === director.uid)
  );
};

/**
 * Enhanced search movies with metadata and context
 * Searches primarily in title, then expands to other fields for longer queries
 */
export const searchMovies = (searchTerm) => {
  if (!dataStore.isInitialized) return [];
  
  const term = searchTerm.toLowerCase().trim();
  if (!term) return [];
  
  return dataStore.movies.filter(movie => {
    // Always search in title
    if (movie.title?.toLowerCase().includes(term)) {
      return true;
    }
    
    // For very short queries (1-3 chars), only search title to avoid false matches
    if (term.length <= 3) {
      return false;
    }
    
    // For longer queries, search in other fields
    // Search in description (for words, not substrings within words)
    if (movie.description) {
      const words = movie.description.toLowerCase().split(/\s+/);
      if (words.some(word => word.includes(term))) {
        return true;
      }
    }
    
    // Search in genres (full word match)
    if (movie.genre?.some(g => {
      const genreName = (g.name || g.title || '').toLowerCase();
      return genreName.includes(term) || genreName.split(/\s+/).some(word => word.startsWith(term));
    })) {
      return true;
    }
    
    // Search in directors (name matching)
    if (movie.director?.some(d => {
      const directorName = (d.name || d.title || '').toLowerCase();
      return directorName.includes(term) || directorName.split(/\s+/).some(word => word.startsWith(term));
    })) {
      return true;
    }
    
    // Search in actors (if available)
    if (movie.actors?.some(a => {
      const actorName = (a.name || a.title || '').toLowerCase();
      return actorName.includes(term) || actorName.split(/\s+/).some(word => word.startsWith(term));
    })) {
      return true;
    }
    
    // Search in release year
    if (movie.release_year?.toString().includes(term)) {
      return true;
    }
    
    return false;
  }).sort((a, b) => {
    // Prioritize exact title matches
    const aExact = a.title?.toLowerCase() === term;
    const bExact = b.title?.toLowerCase() === term;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    // Then prioritize title starts with
    const aStarts = a.title?.toLowerCase().startsWith(term);
    const bStarts = b.title?.toLowerCase().startsWith(term);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    
    // Then any title matches
    const aTitle = a.title?.toLowerCase().includes(term);
    const bTitle = b.title?.toLowerCase().includes(term);
    if (aTitle && !bTitle) return -1;
    if (!aTitle && bTitle) return 1;
    
    // Then sort by rating
    return (b.rating || 0) - (a.rating || 0);
  });
};

/**
 * Search movies for chatbot (limited results)
 */
export const searchMovieForChatbot = (searchTerm) => {
  const results = searchMovies(searchTerm);
  return results.slice(0, 3);
};

/**
 * ============================================================================
 * GENRE QUERIES
 * ============================================================================
 */

/**
 * Get all genres
 */
export const getAllGenres = () => {
  if (!dataStore.isInitialized) return [];
  return [...dataStore.genres];
};

/**
 * Get genre by slug
 */
export const getGenreBySlug = (slug) => {
  if (!dataStore.isInitialized) return null;
  return dataStore.genres.find(g => g.slug === slug) || null;
};

/**
 * Get genre by UID
 */
export const getGenreByUid = (uid) => {
  if (!dataStore.isInitialized) return null;
  return dataStore.genres.find(g => g.uid === uid) || null;
};

/**
 * ============================================================================
 * DIRECTOR QUERIES
 * ============================================================================
 */

/**
 * Get all directors
 */
export const getAllDirectors = () => {
  if (!dataStore.isInitialized) return [];
  
  // Add movies_directed to each director
  return dataStore.directors.map(director => ({
    ...director,
    movies_directed: getMoviesByDirector(director.slug)
  }));
};

/**
 * Get director by slug
 */
export const getDirectorBySlug = (slug) => {
  if (!dataStore.isInitialized) return null;
  
  const director = dataStore.directors.find(d => d.slug === slug);
  if (!director) return null;

  // Add movies_directed
  return {
    ...director,
    movies_directed: getMoviesByDirector(slug)
  };
};

/**
 * Get director by UID
 */
export const getDirectorByUid = (uid) => {
  if (!dataStore.isInitialized) return null;
  return dataStore.directors.find(d => d.uid === uid) || null;
};

/**
 * ============================================================================
 * ACTOR QUERIES
 * ============================================================================
 */

/**
 * Get all actors
 */
export const getAllActors = () => {
  if (!dataStore.isInitialized) return [];
  
  // Add movies_acted_in to each actor (if needed in future)
  return dataStore.actors.map(actor => ({
    ...actor
  }));
};

/**
 * Get actor by slug
 */
export const getActorBySlug = (slug) => {
  if (!dataStore.isInitialized) return null;
  
  const actor = dataStore.actors.find(a => a.slug === slug);
  if (!actor) return null;

  return {
    ...actor
  };
};

/**
 * Get actor by UID
 */
export const getActorByUid = (uid) => {
  if (!dataStore.isInitialized) return null;
  return dataStore.actors.find(a => a.uid === uid) || null;
};

/**
 * ============================================================================
 * REVIEW QUERIES
 * ============================================================================
 */

/**
 * Get all reviews
 */
export const getAllReviews = () => {
  if (!dataStore.isInitialized) return [];
  return [...dataStore.reviews];
};

/**
 * Get reviews by movie UID
 */
export const getReviewsByMovie = (movieUid) => {
  if (!dataStore.isInitialized) return [];
  return dataStore.reviews.filter(review => 
    review.movie?.uid === movieUid || review.movie_uid === movieUid
  );
};

/**
 * Get reviews by movie slug
 */
export const getReviewsByMovieSlug = (movieSlug) => {
  if (!dataStore.isInitialized) return [];
  
  const movie = getMovieBySlug(movieSlug);
  if (!movie) return [];
  
  return getReviewsByMovie(movie.uid);
};

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

/**
 * Get image URL with fallback
 */
export const getImageUrl = (imageObject) => {
  if (!imageObject) return null;
  return imageObject.url || null;
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Calculate average rating from reviews
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

/**
 * ============================================================================
 * EXPORTS
 * ============================================================================
 */

export default {
  // Initialization
  initializeDataStore,
  refreshDataStore,
  isDataStoreReady,
  getDataStoreStats,
  getAppSettings,
  
  // Movies
  getAllMovies,
  getFeaturedMovies,
  getUpcomingMovies,
  getMovieBySlug,
  getMovieByUid,
  getMoviesByGenre,
  getMoviesByGenreName,
  getMoviesByDirector,
  searchMovies,
  searchMovieForChatbot,
  
  // Genres
  getAllGenres,
  getGenreBySlug,
  getGenreByUid,
  
  // Directors
  getAllDirectors,
  getDirectorBySlug,
  getDirectorByUid,
  
  // Actors
  getAllActors,
  getActorBySlug,
  getActorByUid,
  
  // Reviews
  getAllReviews,
  getReviewsByMovie,
  getReviewsByMovieSlug,
  
  // Utilities
  getImageUrl,
  formatDate,
  calculateAverageRating
};
