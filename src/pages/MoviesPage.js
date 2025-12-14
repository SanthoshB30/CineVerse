/**
 * MoviesPage Component
 * 
 * Displays all movie entries from Contentstack.
 * Filters for kids-friendly content when Kids Mode is active.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { getAllMovies } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

// Kids-friendly genres
const KIDS_GENRES = ['kids', 'animation', 'family', 'children', 'animated'];

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedProfile } = useAuth();

  // Check if Kids Mode is active from the selected profile
  const isKidsMode = selectedProfile?.is_kid;

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      const allMovies = getAllMovies();
      setMovies(allMovies);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter movies for kids mode
  const displayedMovies = useMemo(() => {
    if (!isKidsMode) return movies;
    
    return movies.filter(movie => {
      // Check if movie has any kids-friendly genre
      const movieGenres = movie.genre || [];
      return movieGenres.some(genre => {
        const genreName = (genre.name || genre.title || '').toLowerCase();
        return KIDS_GENRES.some(kidsGenre => genreName.includes(kidsGenre));
      });
    });
  }, [movies, isKidsMode]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="movies-page">
      {/* Kids Mode Indicator */}
      {isKidsMode && (
        <div className="kids-mode-pill">
          <span className="kids-mode-pill-icon">👶</span>
          <span className="kids-mode-pill-text">Kids Mode</span>
        </div>
      )}

      <div className="movies-page-header">
        <div className="movies-page-title-section">
          <h1 className="movies-page-title">
            {isKidsMode ? 'Kids Movies' : 'All Movies'}
          </h1>
          <p className="movies-page-subtitle">
            {isKidsMode 
              ? 'Age-appropriate movies for young viewers'
              : 'Browse the full CineVerse movie collection'
            }
          </p>
        </div>
      </div>

      {displayedMovies.length > 0 ? (
        <div className="movies-grid">
          {displayedMovies.map(movie => (
            <div key={movie.uid} className="movie-card-wrapper">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🎬</div>
          <h2>{isKidsMode ? 'No kids movies found' : 'No movies found'}</h2>
          <p>Check back later for new additions!</p>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;

