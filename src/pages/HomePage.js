import React, { useState, useEffect } from 'react';
import { 
  getAllGenres, 
  getMoviesByGenre
} from '../api/contentstack';
import MovieCard from '../components/MovieCard';

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(false);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setLoading(true);
    const genresData = await getAllGenres();
    setGenres(genresData);
    setLoading(false);
  };

  const handleGenreSelect = async (genre) => {
    setSelectedGenre(genre);
    setLoadingMovies(true);
    const moviesData = await getMoviesByGenre(genre.slug);
    setMovies(moviesData);
    setLoadingMovies(false);
  };

  const handleBackToGenres = () => {
    setSelectedGenre(null);
    setMovies([]);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading genres...</p>
      </div>
    );
  }

  // Show movies view if a genre is selected
  if (selectedGenre) {
    return (
      <div className="home-page">
        <div className="genre-movies-view">
          <div className="genre-movies-header">
            <button 
              className="back-button"
              onClick={handleBackToGenres}
              aria-label="Back to genres"
            >
              ← Back to Genres
            </button>
            <div className="genre-title-section">
              <h1 className="genre-title">{selectedGenre.name}</h1>
              <p className="genre-description">{selectedGenre.description}</p>
            </div>
          </div>

          {loadingMovies ? (
            <div className="loading-screen">
              <div className="loader"></div>
              <p>Loading movies...</p>
            </div>
          ) : (
            <>
              {movies.length > 0 ? (
                <div className="movies-grid">
                  {movies.map(movie => (
                    <MovieCard key={movie.uid} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h2>No movies found</h2>
                  <p>No movies available in this genre yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Show genre selection view (default)
  return (
    <div className="home-page">
      <div className="genre-selection-view">
        <div className="welcome-header">
          <h1 className="welcome-title">🎬 Welcome to CineVerse</h1>
          <p className="welcome-subtitle">
            Select a genre to discover amazing movies, or use the AI chatbot to get personalized recommendations
          </p>
        </div>

        <div className="genres-grid">
          {genres.map(genre => (
            <button
              key={genre.uid}
              className="genre-card"
              onClick={() => handleGenreSelect(genre)}
            >
              <div className="genre-card-icon">
                {getGenreIcon(genre.name)}
              </div>
              <h2 className="genre-card-title">{genre.name}</h2>
              <p className="genre-card-description">{genre.description}</p>
              <span className="genre-card-arrow">→</span>
            </button>
          ))}
        </div>

        {genres.length === 0 && (
          <div className="empty-state">
            <h2>⚠️ No genres available</h2>
            <p>No genres found in Contentstack</p>
            <div className="error-help" style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px', margin: '20px auto' }}>
              <p><strong>Please check:</strong></p>
              <ol style={{ textAlign: 'left', marginTop: '10px' }}>
                <li>You have created the "genre" content type in Contentstack</li>
                <li>You have added genre entries (Horror, Comedy, Sci-Fi, etc.)</li>
                <li>All genre entries are <strong>PUBLISHED</strong> (not just saved)</li>
                <li>The environment matches (check browser console)</li>
                <li>Your API credentials are correct in .env file</li>
              </ol>
              <p style={{ marginTop: '15px' }}>
                <strong>Check the browser console (F12) for detailed error messages.</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get emoji icons for genres
const getGenreIcon = (genreName) => {
  const icons = {
    'Horror': '👻',
    'Comedy': '😂',
    'Sci-Fi': '🚀',
    'Action': '💥',
    'Drama': '🎭',
    'Thriller': '🔪',
    'Adventure': '🗺️',
    'Romance': '💕',
    'Fantasy': '🧙',
    'Mystery': '🕵️',
    'Crime': '🚔',
    'Animation': '🎨',
    'Documentary': '📽️',
    'Musical': '🎵'
  };
  return icons[genreName] || '🎬';
};

export default HomePage;

