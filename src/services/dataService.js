/**
 * ============================================================================
 * DATA SERVICE - Client-Side Mock Data Store
 * ============================================================================
 * 
 * This service provides mock data for the Movie Review Platform.
 * All data is stored as static arrays and queried in-memory.
 * 
 * Benefits:
 * - No external API dependencies
 * - Instant load time
 * - Perfect for demo and development
 * - Easy to customize and extend
 * 
 * To use real Contentstack data, see contentstack.js
 * 
 * ============================================================================
 */

/**
 * ============================================================================
 * MOCK DATA DEFINITIONS
 * ============================================================================
 */

// Mock Directors
const MOCK_DIRECTORS = [
  {
    uid: 'dir_1',
    title: 'Christopher Nolan',
    name: 'Christopher Nolan',
    slug: 'christopher-nolan',
    bio: 'Christopher Nolan is a British-American film director, producer, and screenwriter known for his intellectually challenging films.',
    birth_year: 1970,
    profile_image: {
      url: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=400&fit=crop'
    }
  },
  {
    uid: 'dir_2',
    title: 'Jordan Peele',
    name: 'Jordan Peele',
    slug: 'jordan-peele',
    bio: 'Jordan Peele is an American filmmaker and actor known for his horror films that explore social themes.',
    birth_year: 1979,
    profile_image: {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    }
  },
  {
    uid: 'dir_3',
    title: 'Greta Gerwig',
    name: 'Greta Gerwig',
    slug: 'greta-gerwig',
    bio: 'Greta Gerwig is an American actress, writer, and director known for her distinctive voice in independent cinema.',
    birth_year: 1983,
    profile_image: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    }
  },
  {
    uid: 'dir_4',
    title: 'Denis Villeneuve',
    name: 'Denis Villeneuve',
    slug: 'denis-villeneuve',
    bio: 'Denis Villeneuve is a Canadian filmmaker known for his visually stunning science fiction films.',
    birth_year: 1967,
    profile_image: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    }
  },
  {
    uid: 'dir_5',
    title: 'Taika Waititi',
    name: 'Taika Waititi',
    slug: 'taika-waititi',
    bio: 'Taika Waititi is a New Zealand filmmaker known for his quirky, comedic style.',
    birth_year: 1975,
    profile_image: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    }
  }
];

// Mock Genres
const MOCK_GENRES = [
  {
    uid: 'genre_1',
    title: 'Horror',
    name: 'Horror',
    slug: 'horror',
    description: 'Films designed to frighten and invoke our darkest fears.'
  },
  {
    uid: 'genre_2',
    title: 'Comedy',
    name: 'Comedy',
    slug: 'comedy',
    description: 'Films designed to make audiences laugh and feel good.'
  },
  {
    uid: 'genre_3',
    title: 'Sci-Fi',
    name: 'Sci-Fi',
    slug: 'sci-fi',
    description: 'Films exploring futuristic concepts, space, and technology.'
  },
  {
    uid: 'genre_4',
    title: 'Action',
    name: 'Action',
    slug: 'action',
    description: 'High-energy films with intense sequences and stunts.'
  },
  {
    uid: 'genre_5',
    title: 'Drama',
    name: 'Drama',
    slug: 'drama',
    description: 'Character-driven films that explore emotional themes.'
  },
  {
    uid: 'genre_6',
    title: 'Thriller',
    name: 'Thriller',
    slug: 'thriller',
    description: 'Suspenseful films that keep you on the edge of your seat.'
  },
  {
    uid: 'genre_7',
    title: 'Adventure',
    name: 'Adventure',
    slug: 'adventure',
    description: 'Exciting films featuring journeys and exploration.'
  }
];

// Mock Movies
const MOCK_MOVIES = [
  {
    uid: 'movie_1',
    title: 'Inception',
    slug: 'inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    release_year: 2010,
    duration: '2h 28min',
    rating: 4.8,
    featured: true,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop'
    },
    trailer_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    genre: [MOCK_GENRES[2], MOCK_GENRES[3], MOCK_GENRES[5]],
    director: [MOCK_DIRECTORS[0]]
  },
  {
    uid: 'movie_2',
    title: 'Get Out',
    slug: 'get-out',
    description: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.',
    release_year: 2017,
    duration: '1h 44min',
    rating: 4.5,
    featured: true,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop'
    },
    trailer_url: 'https://www.youtube.com/watch?v=sRfnevzM9kQ',
    genre: [MOCK_GENRES[0], MOCK_GENRES[5]],
    director: [MOCK_DIRECTORS[1]]
  },
  {
    uid: 'movie_3',
    title: 'Lady Bird',
    slug: 'lady-bird',
    description: 'In 2002, an artistically inclined seventeen-year-old girl comes of age in Sacramento, California.',
    release_year: 2017,
    duration: '1h 34min',
    rating: 4.3,
    featured: false,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1920&h=1080&fit=crop'
    },
    genre: [MOCK_GENRES[1], MOCK_GENRES[4]],
    director: [MOCK_DIRECTORS[2]]
  },
  {
    uid: 'movie_4',
    title: 'Dune',
    slug: 'dune',
    description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
    release_year: 2021,
    duration: '2h 35min',
    rating: 4.6,
    featured: true,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop'
    },
    genre: [MOCK_GENRES[2], MOCK_GENRES[6], MOCK_GENRES[4]],
    director: [MOCK_DIRECTORS[3]]
  },
  {
    uid: 'movie_5',
    title: 'Thor: Ragnarok',
    slug: 'thor-ragnarok',
    description: 'Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarök, the destruction of his world, at the hands of the powerful and ruthless villain Hela.',
    release_year: 2017,
    duration: '2h 10min',
    rating: 4.4,
    featured: false,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1635805737707-575885ab0b6e?w=1920&h=1080&fit=crop'
    },
    genre: [MOCK_GENRES[3], MOCK_GENRES[1], MOCK_GENRES[6]],
    director: [MOCK_DIRECTORS[4]]
  },
  {
    uid: 'movie_6',
    title: 'Us',
    slug: 'us',
    description: 'A family\'s serene beach vacation turns to chaos when their doppelgängers appear and begin to terrorize them.',
    release_year: 2019,
    duration: '1h 56min',
    rating: 4.2,
    featured: false,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1574267432644-f610ff34e55b?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=1920&h=1080&fit=crop'
    },
    genre: [MOCK_GENRES[0], MOCK_GENRES[5]],
    director: [MOCK_DIRECTORS[1]]
  },
  {
    uid: 'movie_7',
    title: 'The Dark Knight',
    slug: 'the-dark-knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    release_year: 2008,
    duration: '2h 32min',
    rating: 4.9,
    featured: true,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=1920&h=1080&fit=crop'
    },
    genre: [MOCK_GENRES[3], MOCK_GENRES[5], MOCK_GENRES[4]],
    director: [MOCK_DIRECTORS[0]]
  },
  {
    uid: 'movie_8',
    title: 'Jojo Rabbit',
    slug: 'jojo-rabbit',
    description: 'A young German boy in the Hitler Youth whose hero and imaginary friend is the country\'s dictator is shocked to discover that his mother is hiding a Jewish girl in their home.',
    release_year: 2019,
    duration: '1h 48min',
    rating: 4.4,
    featured: false,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop'
    },
    genre: [MOCK_GENRES[1], MOCK_GENRES[4]],
    director: [MOCK_DIRECTORS[4]]
  },
  {
    uid: 'movie_9',
    title: 'Interstellar',
    slug: 'interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    release_year: 2014,
    duration: '2h 49min',
    rating: 4.7,
    featured: true,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop'
    },
    genre: [MOCK_GENRES[2], MOCK_GENRES[4], MOCK_GENRES[6]],
    director: [MOCK_DIRECTORS[0]]
  },
  {
    uid: 'movie_10',
    title: 'A Quiet Place',
    slug: 'a-quiet-place',
    description: 'In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.',
    release_year: 2018,
    duration: '1h 30min',
    rating: 4.3,
    featured: false,
    poster_image: {
      url: 'https://images.unsplash.com/photo-1574267432644-f610ff34e55b?w=400&h=600&fit=crop'
    },
    banner_image: {
      url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop'
    },
    genre: [MOCK_GENRES[0], MOCK_GENRES[2], MOCK_GENRES[5]],
    director: [{ uid: 'dir_6', name: 'John Krasinski' }]
  }
];

// Mock Reviews
const MOCK_REVIEWS = [
  {
    uid: 'review_1',
    movie_uid: 'movie_1',
    reviewer_name: 'John Smith',
    rating: 5,
    review_text: 'Absolutely mind-bending! Nolan at his best. The visuals are stunning and the story keeps you engaged till the very end.',
    review_date: '2023-06-15',
    movie: MOCK_MOVIES[0]
  },
  {
    uid: 'review_2',
    movie_uid: 'movie_1',
    reviewer_name: 'Sarah Johnson',
    rating: 5,
    review_text: 'A masterpiece of modern cinema. Complex, thrilling, and beautifully executed.',
    review_date: '2023-07-20',
    movie: MOCK_MOVIES[0]
  },
  {
    uid: 'review_3',
    movie_uid: 'movie_2',
    reviewer_name: 'Mike Williams',
    rating: 5,
    review_text: 'A brilliant social thriller that will stay with you long after watching. Jordan Peele is a genius.',
    review_date: '2023-05-10',
    movie: MOCK_MOVIES[1]
  },
  {
    uid: 'review_4',
    movie_uid: 'movie_4',
    reviewer_name: 'Emma Davis',
    rating: 5,
    review_text: 'Visually stunning and epic in scope. Villeneuve brings Herbert\'s vision to life perfectly.',
    review_date: '2023-08-01',
    movie: MOCK_MOVIES[3]
  }
];

/**
 * ============================================================================
 * CLIENT-SIDE DATA STORE
 * ============================================================================
 */

class DataStore {
  constructor() {
    this.movies = MOCK_MOVIES;
    this.genres = MOCK_GENRES;
    this.directors = MOCK_DIRECTORS;
    this.reviews = MOCK_REVIEWS;
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Initialize the data store with mock data (instant)
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
    this.initializationPromise = this._loadMockData();
    return this.initializationPromise;
  }

  /**
   * Load mock data (simulates API call for consistent interface)
   */
  async _loadMockData() {
    try {
      console.log('🚀 Loading mock data...');
      const startTime = Date.now();

      // Simulate network delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 300));

      // Data is already loaded in constructor
      // Mark as initialized
      this.isInitialized = true;
      this.initializationPromise = null;

      const endTime = Date.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);

      console.log(`✅ Mock data loaded successfully in ${loadTime}s:`);
      console.log(`   - Movies: ${this.movies.length}`);
      console.log(`   - Genres: ${this.genres.length}`);
      console.log(`   - Directors: ${this.directors.length}`);
      console.log(`   - Reviews: ${this.reviews.length}`);

      return {
        success: true,
        message: 'Mock data loaded successfully',
        stats: {
          movies: this.movies.length,
          genres: this.genres.length,
          directors: this.directors.length,
          reviews: this.reviews.length,
          loadTime: loadTime
        }
      };
    } catch (error) {
      console.error('❌ Error loading mock data:', error);
      this.initializationPromise = null;
      return {
        success: false,
        message: 'Failed to load mock data',
        error: error.message
      };
    }
  }

  /**
   * Refresh/reload mock data
   */
  async refresh() {
    console.log('🔄 Refreshing mock data...');
    this.isInitialized = false;
    this.initializationPromise = null;
    // Reset to original mock data
    this.movies = MOCK_MOVIES;
    this.genres = MOCK_GENRES;
    this.directors = MOCK_DIRECTORS;
    this.reviews = MOCK_REVIEWS;
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
 * DATA QUERY FUNCTIONS (Used by other parts of the app)
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

