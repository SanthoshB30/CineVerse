import logger from '../utils/logger';

export const trackPageView = (pageName, additionalData = {}) => {
  logger.info(`Analytics: Page View - ${pageName}`);
};

export const trackEntryView = (pageName, entryUid, contentType, additionalData = {}) => {
  logger.info(`Analytics: Entry View - ${contentType}/${pageName}`);
};

export const trackEvent = (eventName, eventData = {}) => {
  logger.info(`Analytics: Event - ${eventName}`);
};

export const trackHomePage = () => {
  trackPageView('Home Page', {
    section: 'trending',
    timestamp: new Date().toISOString()
  });
};

export const trackMovieView = (movieUid, movieTitle, movieSlug) => {
  trackEntryView('Movie Detail Page', movieUid, 'movie', {
    title: movieTitle,
    slug: movieSlug,
    timestamp: new Date().toISOString()
  });
};

export const trackWatchedMovie = (movieUid, movieTitle, duration = null) => {
  trackEvent('Movie Watched', {
    entry: { uid: movieUid, content_type: 'movie' },
    title: movieTitle,
    duration: duration,
    timestamp: new Date().toISOString()
  });
};

export const trackGenreView = (genreUid, genreName, genreSlug) => {
  trackEntryView('Genre Page', genreUid, 'genre', {
    name: genreName,
    slug: genreSlug,
    timestamp: new Date().toISOString()
  });
};

export const trackDirectorView = (directorUid, directorName, directorSlug) => {
  trackEntryView('Director Page', directorUid, 'director', {
    name: directorName,
    slug: directorSlug,
    timestamp: new Date().toISOString()
  });
};

export const trackActorView = (actorUid, actorName, actorSlug) => {
  trackEntryView('Actor Page', actorUid, 'actor', {
    name: actorName,
    slug: actorSlug,
    timestamp: new Date().toISOString()
  });
};

export const trackProfileSelection = (profileId, profileName) => {
  trackEvent('Profile Selected', {
    profile_id: profileId,
    profile_name: profileName,
    timestamp: new Date().toISOString()
  });
};

export const trackProfileCreation = (profileId, profileName, isKids = false) => {
  trackEvent('Profile Created', {
    profile_id: profileId,
    profile_name: profileName,
    is_kids: isKids,
    timestamp: new Date().toISOString()
  });
};

export const trackSearch = (searchQuery, resultsCount = 0) => {
  trackEvent('Search', {
    query: searchQuery,
    results_count: resultsCount,
    timestamp: new Date().toISOString()
  });
};

export const trackLogin = (username) => {
  trackEvent('User Login', {
    username: username,
    timestamp: new Date().toISOString()
  });
};

export const trackSignUp = (username) => {
  trackEvent('User Signup', {
    username: username,
    timestamp: new Date().toISOString()
  });
};

export const trackReviewSubmission = (movieUid, movieTitle, rating) => {
  trackEvent('Review Submitted', {
    entry: { uid: movieUid, content_type: 'movie' },
    title: movieTitle,
    rating: rating,
    timestamp: new Date().toISOString()
  });
};

export const trackVideoPlay = (movieUid, movieTitle) => {
  trackEvent('Video Play Started', {
    entry: { uid: movieUid, content_type: 'movie' },
    title: movieTitle,
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
  trackVideoPlay
};

