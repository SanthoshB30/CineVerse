/**
 * Analytics Service
 * 
 * Contentstack Analytics:
 * - Automatically tracks entry views when content is fetched via Delivery API
 * - Only works on deployed domains (not localhost)
 * - View analytics in: Contentstack Dashboard → Analytics
 * 
 * These functions log events to console for development debugging.
 * Once deployed, Contentstack tracks automatically without any code changes.
 */

/**
 * Track page view
 */
export const trackPageView = (pageName, additionalData = {}) => {
  console.log('📊 Page View:', pageName, additionalData);
};

/**
 * Track entry view (movie, genre, director, actor)
 */
export const trackEntryView = (pageName, entryUid, contentType, additionalData = {}) => {
  console.log('📊 Entry View:', { page: pageName, entry: entryUid, type: contentType, ...additionalData });
};

/**
 * Track custom event
 */
export const trackEvent = (eventName, eventData = {}) => {
  console.log('📊 Event:', eventName, eventData);
};

/**
 * Track Home Page - Trending visits
 */
export const trackHomePage = () => {
  trackPageView('Home Page', {
    section: 'trending',
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Movie Detail Page - Visits per movie
 */
export const trackMovieView = (movieUid, movieTitle, movieSlug) => {
  trackEntryView('Movie Detail Page', movieUid, 'movie', {
    title: movieTitle,
    slug: movieSlug,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track "Watched" event
 */
export const trackWatchedMovie = (movieUid, movieTitle, duration = null) => {
  trackEvent('Movie Watched', {
    entry: { uid: movieUid, content_type: 'movie' },
    title: movieTitle,
    duration: duration,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Genre Page - Genre popularity
 */
export const trackGenreView = (genreUid, genreName, genreSlug) => {
  trackEntryView('Genre Page', genreUid, 'genre', {
    name: genreName,
    slug: genreSlug,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Director Page
 */
export const trackDirectorView = (directorUid, directorName, directorSlug) => {
  trackEntryView('Director Page', directorUid, 'director', {
    name: directorName,
    slug: directorSlug,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Actor Page
 */
export const trackActorView = (actorUid, actorName, actorSlug) => {
  trackEntryView('Actor Page', actorUid, 'actor', {
    name: actorName,
    slug: actorSlug,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Profile Selection - Engagement
 */
export const trackProfileSelection = (profileId, profileName) => {
  trackEvent('Profile Selected', {
    profile_id: profileId,
    profile_name: profileName,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Profile Creation
 */
export const trackProfileCreation = (profileId, profileName, isKids = false) => {
  trackEvent('Profile Created', {
    profile_id: profileId,
    profile_name: profileName,
    is_kids: isKids,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Search - Popular searches
 */
export const trackSearch = (searchQuery, resultsCount = 0) => {
  trackEvent('Search', {
    query: searchQuery,
    results_count: resultsCount,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Login
 */
export const trackLogin = (username) => {
  trackEvent('User Login', {
    username: username,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Sign Up
 */
export const trackSignUp = (username) => {
  trackEvent('User Signup', {
    username: username,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Review Submission
 */
export const trackReviewSubmission = (movieUid, movieTitle, rating) => {
  trackEvent('Review Submitted', {
    entry: { uid: movieUid, content_type: 'movie' },
    title: movieTitle,
    rating: rating,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Video Play (if you have video playback)
 */
export const trackVideoPlay = (movieUid, movieTitle) => {
  trackEvent('Video Play Started', {
    entry: { uid: movieUid, content_type: 'movie' },
    title: movieTitle,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track Collection View
 */
export const trackCollectionView = (collectionUid, collectionName) => {
  trackEntryView('Collection Page', collectionUid, 'collection', {
    name: collectionName,
    timestamp: new Date().toISOString()
  });
};

export default {
  trackPageView,
  trackEntryView,
  trackEvent,
  trackHomePage,
  trackMovieView,
  trackWatchedMovie,
  trackGenreView,
  trackDirectorView,
  trackActorView,
  trackProfileSelection,
  trackProfileCreation,
  trackSearch,
  trackLogin,
  trackSignUp,
  trackReviewSubmission,
  trackVideoPlay,
  trackCollectionView
};

