import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext(null);

const WATCHLIST_STORAGE_KEY = 'cineverse_watchlist';

export const WatchlistProvider = ({ children }) => {
  const { user, selectedProfile } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [toast, setToast] = useState(null);

  // Get storage key based on user and profile
  // Each profile has its own unique watchlist
  const getStorageKey = useCallback(() => {
    if (user && selectedProfile) {
      // Use profile's unique identifier (UID from metadata or profile_name)
      const profileId = selectedProfile._metadata?.uid || selectedProfile.profile_name || selectedProfile.name;
      return `${WATCHLIST_STORAGE_KEY}_${user.uid}_${profileId}`;
    }
    return WATCHLIST_STORAGE_KEY;
  }, [user, selectedProfile]);

  // Load watchlist from localStorage
  useEffect(() => {
    const storageKey = getStorageKey();
    const savedWatchlist = localStorage.getItem(storageKey);
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (e) {
        setWatchlist([]);
      }
    } else {
      setWatchlist([]);
    }
  }, [getStorageKey]);

  // Save watchlist to localStorage
  const saveWatchlist = useCallback((newWatchlist) => {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(newWatchlist));
    setWatchlist(newWatchlist);
  }, [getStorageKey]);

  // Show toast notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Check if movie is in watchlist
  const isInWatchlist = useCallback((movieUid) => {
    return watchlist.some(movie => movie.uid === movieUid);
  }, [watchlist]);

  // Add movie to watchlist
  const addToWatchlist = useCallback((movie) => {
    if (!isInWatchlist(movie.uid)) {
      const movieData = {
        uid: movie.uid,
        title: movie.title,
        slug: movie.slug,
        poster_image: movie.poster_image,
        rating: movie.rating,
        release_year: movie.release_year,
        genre: movie.genre,
        addedAt: new Date().toISOString()
      };
      const newWatchlist = [movieData, ...watchlist];
      saveWatchlist(newWatchlist);
      showToast(`"${movie.title}" added to your watchlist`, 'success');
      return true;
    }
    return false;
  }, [watchlist, isInWatchlist, saveWatchlist, showToast]);

  // Remove movie from watchlist
  const removeFromWatchlist = useCallback((movieUid) => {
    const movie = watchlist.find(m => m.uid === movieUid);
    const newWatchlist = watchlist.filter(m => m.uid !== movieUid);
    saveWatchlist(newWatchlist);
    if (movie) {
      showToast(`"${movie.title}" removed from watchlist`, 'info');
    }
    return true;
  }, [watchlist, saveWatchlist, showToast]);

  // Toggle watchlist status
  const toggleWatchlist = useCallback((movie) => {
    if (isInWatchlist(movie.uid)) {
      return removeFromWatchlist(movie.uid);
    } else {
      return addToWatchlist(movie);
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist]);

  // Clear entire watchlist
  const clearWatchlist = useCallback(() => {
    saveWatchlist([]);
    showToast('Watchlist cleared', 'info');
  }, [saveWatchlist, showToast]);

  // Share movie
  const shareMovie = useCallback(async (movie) => {
    const shareUrl = `${window.location.origin}/movie/${movie.slug}`;
    const shareData = {
      title: movie.title,
      text: `Check out "${movie.title}" on CineVerse!`,
      url: shareUrl
    };

    // Try native share API first (mobile)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
        return { success: true, method: 'native' };
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fall through to clipboard
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard!', 'success');
      return { success: true, method: 'clipboard' };
    } catch (err) {
      showToast('Failed to copy link', 'error');
      return { success: false };
    }
  }, [showToast]);

  const value = {
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
    shareMovie,
    toast,
    showToast,
    watchlistCount: watchlist.length
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export default WatchlistContext;

