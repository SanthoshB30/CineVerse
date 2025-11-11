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

// Validate configuration
const validateConfig = () => {
  const apiKey = process.env.REACT_APP_CONTENTSTACK_API_KEY;
  const deliveryToken = process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN;
  
  if (!apiKey || !deliveryToken) {
    console.error('❌ Contentstack credentials missing!');
    console.error('Please check your .env file has:');
    console.error('  - REACT_APP_CONTENTSTACK_API_KEY');
    console.error('  - REACT_APP_CONTENTSTACK_DELIVERY_TOKEN');
    console.error('  - REACT_APP_CONTENTSTACK_ENVIRONMENT');
    console.error('  - REACT_APP_CONTENTSTACK_REGION');
    return false;
  }
  
  console.log('✅ Contentstack configuration found');
  console.log(`   Environment: ${process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'testing'}`);
  console.log(`   Region: ${process.env.REACT_APP_CONTENTSTACK_REGION || 'us'}`);
  console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
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
    this.reviews = [];
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
      console.log('🚀 Loading data from Contentstack...');
      console.log('-----------------------------------');
      
      // Validate configuration first
      if (!validateConfig()) {
        throw new Error('Invalid Contentstack configuration');
      }

      const startTime = Date.now();

      // Fetch all content types sequentially to see which one fails
      console.log('\n📦 Fetching content types...\n');
      
      const directors = await this._fetchDirectors();
      const genres = await this._fetchGenres();
      const movies = await this._fetchMovies();
      const reviews = await this._fetchReviews();

      // Store in memory
      this.directors = directors;
      this.genres = genres;
      this.movies = movies;
      this.reviews = reviews;

      // Mark as initialized
      this.isInitialized = true;
      this.initializationPromise = null;

      const endTime = Date.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);

      console.log('-----------------------------------');
      console.log(`✅ Data loaded successfully from Contentstack in ${loadTime}s:`);
      console.log(`   - Directors: ${this.directors.length}`);
      console.log(`   - Genres: ${this.genres.length}`);
      console.log(`   - Movies: ${this.movies.length}`);
      console.log(`   - Reviews: ${this.reviews.length}`);
      console.log('-----------------------------------\n');

      // Warning if no data
      if (this.genres.length === 0) {
        console.warn('⚠️  WARNING: No genres found!');
        console.warn('   Make sure you have:');
        console.warn('   1. Created "genre" content type in Contentstack');
        console.warn('   2. Added genre entries');
        console.warn('   3. PUBLISHED the genre entries');
        console.warn('   4. Environment matches:', process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'testing');
      }

      return {
        success: true,
        message: 'Data loaded successfully from Contentstack',
        stats: {
          movies: this.movies.length,
          genres: this.genres.length,
          directors: this.directors.length,
          reviews: this.reviews.length,
          loadTime: loadTime
        }
      };
    } catch (error) {
      console.error('❌ Error loading data from Contentstack:', error);
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
      this.initializationPromise = null;
      return {
        success: false,
        message: 'Failed to load data from Contentstack: ' + error.message,
        error: error.message
      };
    }
  }

  /**
   * Fetch Directors from Contentstack
   */
  async _fetchDirectors() {
    try {
      console.log('📋 Fetching directors...');
      const Query = Stack.ContentType('director').Query();
      const result = await Query.toJSON().find();
      
      const entries = result[0] || [];
      console.log(`   Found ${entries.length} directors`);
      
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
      console.error('❌ Error fetching directors:', error.message || error);
      console.error('   Full error:', error);
      return [];
    }
  }

  /**
   * Fetch Genres from Contentstack
   */
  async _fetchGenres() {
    try {
      console.log('📋 Fetching genres...');
      const Query = Stack.ContentType('genre').Query();
      const result = await Query.toJSON().find();
      
      const entries = result[0] || [];
      console.log(`   Found ${entries.length} genres`);
      
      return entries.map(entry => ({
        uid: entry.uid,
        title: entry.title || entry.name,
        name: entry.name,
        slug: entry.slug,
        description: entry.description
      }));
    } catch (error) {
      console.error('❌ Error fetching genres:', error.message || error);
      console.error('   Full error:', error);
      return [];
    }
  }

  /**
   * Fetch Movies from Contentstack
   */
  async _fetchMovies() {
    try {
      console.log('📋 Fetching movies...');
      const Query = Stack.ContentType('movie').Query();
      const result = await Query
        .includeReference('genre')
        .includeReference('director')
        .toJSON()
        .find();
      
      const entries = result[0] || [];
      console.log(`   Found ${entries.length} movies`);
      
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
      console.error('❌ Error fetching movies:', error.message || error);
      console.error('   Full error:', error);
      return [];
    }
  }

  /**
   * Fetch Reviews from Contentstack
   */
  async _fetchReviews() {
    try {
      console.log('📋 Fetching reviews...');
      const Query = Stack.ContentType('review').Query();
      const result = await Query
        .includeReference('movie')
        .toJSON()
        .find();
      
      const entries = result[0] || [];
      console.log(`   Found ${entries.length} reviews`);
      
      return entries.map(entry => ({
        uid: entry.uid,
        reviewer_name: entry.reviewer_name,
        rating: entry.rating,
        review_text: entry.review_text,
        review_date: entry.review_date,
        movie: entry.movie?.[0] || null,
        movie_uid: entry.movie?.[0]?.uid || null
      }));
    } catch (error) {
      console.error('❌ Error fetching reviews:', error.message || error);
      console.error('   Full error:', error);
      return [];
    }
  }

  /**
   * Refresh/reload data from Contentstack
   */
  async refresh() {
    console.log('🔄 Refreshing data from Contentstack...');
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
      movies: this.movies.length,
      genres: this.genres.length,
      directors: this.directors.length,
      reviews: this.reviews.length
    };
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
 * ============================================================================
 * MOVIE QUERIES
 * ============================================================================
 */

/**
 * Get all movies
 */
export const getAllMovies = () => {
  if (!dataStore.isInitialized) {
    console.warn('Data store not initialized');
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
 * Search movies by title or description
 */
export const searchMovies = (searchTerm) => {
  if (!dataStore.isInitialized) return [];
  
  const term = searchTerm.toLowerCase();
  return dataStore.movies.filter(movie => 
    movie.title?.toLowerCase().includes(term) ||
    movie.description?.toLowerCase().includes(term)
  );
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
  
  // Movies
  getAllMovies,
  getFeaturedMovies,
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
  
  // Reviews
  getAllReviews,
  getReviewsByMovie,
  getReviewsByMovieSlug,
  
  // Utilities
  getImageUrl,
  formatDate,
  calculateAverageRating
};
