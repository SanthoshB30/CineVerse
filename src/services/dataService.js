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
    this.actors = [];
    this.collections = [];
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
      console.log('🚀 Loading data from Contentstack...');
      console.log('-----------------------------------');
      
      // Validate configuration first
      if (!validateConfig()) {
        throw new Error('Invalid Contentstack configuration');
      }

      const startTime = Date.now();

      // Fetch all content types sequentially to see which one fails
      console.log('\n📦 Fetching content types...\n');
      
      const appSettings = await this._fetchAppSettings();
      const directors = await this._fetchDirectors();
      const genres = await this._fetchGenres();
      const actors = await this._fetchActors();
      const collections = await this._fetchCollections();
      const movies = await this._fetchMovies();
      const reviews = await this._fetchReviews();

      // Store in memory
      this.appSettings = appSettings;
      this.directors = directors;
      this.genres = genres;
      this.actors = actors;
      this.collections = collections;
      this.movies = movies;
      this.reviews = reviews;

      // Mark as initialized
      this.isInitialized = true;
      this.initializationPromise = null;

      const endTime = Date.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);

      console.log('-----------------------------------');
      console.log(`✅ Data loaded successfully from Contentstack in ${loadTime}s:`);
      console.log(`   - App Settings: ${this.appSettings ? '✓' : '✗'}`);
      console.log(`   - Directors: ${this.directors.length}`);
      console.log(`   - Genres: ${this.genres.length}`);
      console.log(`   - Actors: ${this.actors.length}`);
      console.log(`   - Collections: ${this.collections.length}`);
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
          actors: this.actors.length,
          collections: this.collections.length,
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
   * Fetch App Settings from Contentstack
   */
  async _fetchAppSettings() {
    try {
      console.log('📋 Fetching app settings...');
      const Query = Stack.ContentType('app_settings').Query();
      const result = await Query.toJSON().find();
      
      const entries = result[0] || [];
      console.log(`   Found ${entries.length} app settings entries`);
      
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
      console.error('❌ Error fetching app settings:', error.message || error);
      console.error('   Full error:', error);
      return null;
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
        description: entry.description,
        genre_image: entry.genre_image
      }));
    } catch (error) {
      console.error('❌ Error fetching genres:', error.message || error);
      console.error('   Full error:', error);
      return [];
    }
  }

  /**
   * Fetch Actors from Contentstack
   */
  async _fetchActors() {
    try {
      console.log('📋 Fetching actors...');
      const Query = Stack.ContentType('actor').Query();
      
      // Include the movies reference - movies is an array inside each filmography group item
      const result = await Query
        .includeReference(['filmography.movies'])
        .includeReference(['filmography.movies.genre'])
        .includeReference(['filmography.movies.director'])
        .toJSON()
        .find();
      
      const entries = result[0] || [];
      console.log(`   Found ${entries.length} actors`);
      
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
                  console.log(`   ⚠️  ${entry.name}: Movie reference not populated, only has:`, Object.keys(movie));
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
                
                console.log(`   ✓ Added movie: ${movie.title} (poster: ${movie.poster_image ? 'yes' : 'no'})`);
              });
            }
          });
          
          if (movies.length > 0) {
            console.log(`   ✅ ${entry.name}: ${movies.length} movie(s) loaded`);
          } else {
            console.log(`   ⚠️  ${entry.name}: No movies loaded (check if movies are published)`);
          }
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
      console.error('❌ Error fetching actors:', error.message || error);
      console.error('   Full error:', error);
      return [];
    }
  }

  /**
   * Fetch Collections from Contentstack
   */
  async _fetchCollections() {
    try {
      console.log('📋 Fetching collections...');
      const Query = Stack.ContentType('collection').Query();
      const result = await Query
        .includeReference('movies')
        .toJSON()
        .find();
      
      const entries = result[0] || [];
      console.log(`   Found ${entries.length} collections`);
      
      return entries.map(entry => ({
        uid: entry.uid,
        title: entry.title,
        slug: entry.slug,
        description: entry.description,
        featured_image: entry.featured_image,
        movies: Array.isArray(entry.movies) ? entry.movies : []
      }));
    } catch (error) {
      console.error('❌ Error fetching collections:', error.message || error);
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
      const Query = Stack.ContentType('reviewnew').Query();
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
        movie_uid: entry.movie?.[0]?.uid || null,
        upvotes: entry.upvotes || 0,
        downvotes: entry.downvotes || 0
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
      appSettings: !!this.appSettings,
      movies: this.movies.length,
      genres: this.genres.length,
      directors: this.directors.length,
      actors: this.actors.length,
      collections: this.collections.length,
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
 * COLLECTION QUERIES
 * ============================================================================
 */

/**
 * Get all collections
 */
export const getAllCollections = () => {
  if (!dataStore.isInitialized) return [];
  return [...dataStore.collections];
};

/**
 * Get collection by slug
 */
export const getCollectionBySlug = (slug) => {
  if (!dataStore.isInitialized) return null;
  return dataStore.collections.find(c => c.slug === slug) || null;
};

/**
 * Get collection by UID
 */
export const getCollectionByUid = (uid) => {
  if (!dataStore.isInitialized) return null;
  return dataStore.collections.find(c => c.uid === uid) || null;
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
  
  // Collections
  getAllCollections,
  getCollectionBySlug,
  getCollectionByUid,
  
  // Reviews
  getAllReviews,
  getReviewsByMovie,
  getReviewsByMovieSlug,
  
  // Utilities
  getImageUrl,
  formatDate,
  calculateAverageRating
};
