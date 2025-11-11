/**
 * ============================================================================
 * Contentstack API Integration Layer
 * All data fetching functions for the Movie Review Platform
 * ============================================================================
 * 
 * This file now uses the DataService which fetches all data once and caches it.
 * All functions query the cached data instead of making individual API calls.
 * 
 * To use REAL Contentstack data:
 * 1. Ensure dataService.js has the correct Contentstack configuration
 * 2. Make sure your .env file has valid Contentstack credentials:
 *    - REACT_APP_CONTENTSTACK_API_KEY
 *    - REACT_APP_CONTENTSTACK_DELIVERY_TOKEN
 *    - REACT_APP_CONTENTSTACK_ENVIRONMENT
 *    - REACT_APP_CONTENTSTACK_REGION (optional, defaults to 'us')
 * 
 * To use MOCK data for demo:
 * 1. Keep the mock data implementation below
 * 2. Comment out the dataService imports
 * 
 * ============================================================================
 */

// Import DataService for real Contentstack data
import * as DataService from '../services/dataService';

/**
 * CHOOSE YOUR DATA SOURCE:
 * Set USE_MOCK_DATA to true for demo, false for real Contentstack data
 */
const USE_MOCK_DATA = false; // Changed to use real Contentstack data

// Export initialization function
export const initializeData = DataService.initializeDataStore;
export const refreshData = DataService.refreshDataStore;
export const isDataReady = DataService.isDataStoreReady;
export const getDataStats = DataService.getDataStoreStats;

/**
 * MOCK DATA FOR DEMO
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
    streaming_links: [
      { platform: 'Prime Video', watch_url: 'https://www.amazon.com/Inception-Leonardo-DiCaprio/dp/B003EIWXMQ' },
      { platform: 'Netflix', watch_url: 'https://www.netflix.com/title/70131314' }
    ],
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
    streaming_links: [
      { platform: 'Netflix', watch_url: 'https://www.netflix.com/title/80091288' },
      { platform: 'Prime Video', watch_url: 'https://www.amazon.com/Get-Out-Daniel-Kaluuya/dp/B06Y5ZTHFK' }
    ],
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
    streaming_links: [
      { platform: 'HBO Max', watch_url: 'https://www.hbomax.com/movie/dune' },
      { platform: 'Prime Video', watch_url: 'https://www.amazon.com/Dune-Timoth%C3%A9e-Chalamet/dp/B09DKSHLZ1' }
    ],
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
    streaming_links: [
      { platform: 'HBO Max', watch_url: 'https://www.hbomax.com/movie/the-dark-knight' },
      { platform: 'Prime Video', watch_url: 'https://www.amazon.com/Dark-Knight-Christian-Bale/dp/B001GZ6QEC' }
    ],
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
    streaming_links: [
      { platform: 'Prime Video', watch_url: 'https://www.amazon.com/Interstellar-Matthew-McConaughey/dp/B00TU9UFTS' },
      { platform: 'Paramount+', watch_url: 'https://www.paramountplus.com/movies/interstellar/' }
    ],
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
 * MOVIE API FUNCTIONS
 * ============================================================================
 */

// Fetch all movies
export const getAllMovies = async () => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_MOVIES;
  }
  return DataService.getAllMovies();
};

// Fetch featured movies (for homepage carousel)
export const getFeaturedMovies = async () => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_MOVIES.filter(movie => movie.featured);
  }
  return DataService.getFeaturedMovies();
};

// Fetch a single movie by slug
export const getMovieBySlug = async (slug) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_MOVIES.find(movie => movie.slug === slug) || null;
  }
  return DataService.getMovieBySlug(slug);
};

// Fetch movies by genre
export const getMoviesByGenre = async (genreSlug) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const genre = MOCK_GENRES.find(g => g.slug === genreSlug);
    if (!genre) return [];
    
    return MOCK_MOVIES.filter(movie => 
      movie.genre?.some(g => g.uid === genre.uid)
    );
  }
  return DataService.getMoviesByGenre(genreSlug);
};

// Search movies by title
export const searchMovies = async (searchTerm) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const term = searchTerm.toLowerCase();
    return MOCK_MOVIES.filter(movie => 
      movie.title.toLowerCase().includes(term) ||
      movie.description.toLowerCase().includes(term)
    );
  }
  return DataService.searchMovies(searchTerm);
};

/**
 * ============================================================================
 * DIRECTOR API FUNCTIONS
 * ============================================================================
 */

// Fetch all directors
export const getAllDirectors = async () => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_DIRECTORS.map(director => ({
      ...director,
      movies_directed: MOCK_MOVIES.filter(movie => 
        movie.director?.some(d => d.uid === director.uid)
      )
    }));
  }
  return DataService.getAllDirectors();
};

// Fetch a single director by slug
export const getDirectorBySlug = async (slug) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const director = MOCK_DIRECTORS.find(d => d.slug === slug);
    if (!director) return null;
    
    return {
      ...director,
      movies_directed: MOCK_MOVIES.filter(movie => 
        movie.director?.some(d => d.uid === director.uid)
      )
    };
  }
  return DataService.getDirectorBySlug(slug);
};

/**
 * ============================================================================
 * GENRE API FUNCTIONS
 * ============================================================================
 */

// Fetch all genres
export const getAllGenres = async () => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_GENRES;
  }
  return DataService.getAllGenres();
};

// Fetch a single genre by slug
export const getGenreBySlug = async (slug) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_GENRES.find(g => g.slug === slug) || null;
  }
  return DataService.getGenreBySlug(slug);
};

/**
 * ============================================================================
 * REVIEW API FUNCTIONS
 * ============================================================================
 */

// Fetch reviews for a specific movie
export const getReviewsByMovie = async (movieUid) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_REVIEWS.filter(review => review.movie_uid === movieUid);
  }
  return DataService.getReviewsByMovie(movieUid);
};

// Fetch all reviews
export const getAllReviews = async () => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_REVIEWS;
  }
  return DataService.getAllReviews();
};

/**
 * ============================================================================
 * CHATBOT API FUNCTIONS
 * ============================================================================
 */

// Fetch chatbot prompts/responses
export const getChatbotPrompts = async () => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  }
  return []; // No specific prompts needed
};

// Search for movie information for chatbot
export const searchMovieForChatbot = async (searchTerm) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const term = searchTerm.toLowerCase();
    return MOCK_MOVIES.filter(movie => 
      movie.title.toLowerCase().includes(term) ||
      movie.description.toLowerCase().includes(term)
    ).slice(0, 3);
  }
  return DataService.searchMovieForChatbot(searchTerm);
};

// Get movies by genre name for chatbot recommendations
export const getMoviesByGenreName = async (genreName) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_MOVIES.filter(movie => 
      movie.genre?.some(g => 
        g.name?.toLowerCase().includes(genreName.toLowerCase())
      )
    );
  }
  return DataService.getMoviesByGenreName(genreName);
};

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

// Get image URL with fallback
export const getImageUrl = (imageObject) => {
  if (!imageObject) return null;
  return imageObject.url || null;
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Calculate average rating from reviews
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

export default {
  getAllMovies,
  getFeaturedMovies,
  getMovieBySlug,
  getMoviesByGenre,
  searchMovies,
  getAllDirectors,
  getDirectorBySlug,
  getAllGenres,
  getGenreBySlug,
  getReviewsByMovie,
  getAllReviews,
  getChatbotPrompts,
  searchMovieForChatbot,
  getMoviesByGenreName,
  getImageUrl,
  formatDate,
  calculateAverageRating
};

