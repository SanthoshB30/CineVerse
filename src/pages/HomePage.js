import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/contentstack';
import { getAllMovies } from '../services/dataService';
import MovieCard from '../components/MovieCard';

const HomePage = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentTrendingIndex((prev) => (prev + 1) % trendingMovies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [trendingMovies]);

  const loadData = async () => {
    setLoading(true);
    try {
      const moviesData = await getAllMovies();
      setAllMovies(moviesData);
      
      // Get trending movies (highest rated or featured)
      const trending = moviesData
        .filter(movie => movie.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      setTrendingMovies(trending.length > 0 ? trending : moviesData.slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handlePrevTrending = () => {
    setCurrentTrendingIndex((prev) => 
      prev === 0 ? trendingMovies.length - 1 : prev - 1
    );
  };

  const handleNextTrending = () => {
    setCurrentTrendingIndex((prev) => 
      (prev + 1) % trendingMovies.length
    );
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading CineVerse...</p>
      </div>
    );
  }

  const currentTrending = trendingMovies[currentTrendingIndex];
  const bannerUrl = currentTrending ? 
    (getImageUrl(currentTrending.banner_image) || getImageUrl(currentTrending.poster_image) || 
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop') :
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop';

  return (
    <div className="home-page-new">
      {/* Trending Movies Slideshow */}
      <div className="trending-section">
        <div 
          className="trending-background"
          style={{ backgroundImage: `url(${bannerUrl})` }}
        >
          <div className="trending-overlay"></div>
        </div>
        
        {currentTrending && (
          <div className="trending-content">
            <h2 className="trending-label">🔥 Trending Now</h2>
            <h1 className="trending-title">{currentTrending.title}</h1>
            <div className="trending-meta">
              {currentTrending.release_year && <span>{currentTrending.release_year}</span>}
              {currentTrending.rating && <span className="trending-rating">⭐ {currentTrending.rating.toFixed(1)}</span>}
              {currentTrending.duration && <span>{currentTrending.duration}</span>}
            </div>
            {currentTrending.description && (
              <p className="trending-description">
                {currentTrending.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
              </p>
            )}
            <div className="trending-actions">
              <Link to={`/movie/${currentTrending.slug}`} className="btn btn-primary">
                ▶ Watch Now
              </Link>
              <Link to={`/movie/${currentTrending.slug}`} className="btn btn-secondary">
                ℹ More Info
              </Link>
            </div>
          </div>
        )}

        <div className="trending-controls">
          <button className="trending-nav-btn" onClick={handlePrevTrending}>‹</button>
          <div className="trending-indicators">
            {trendingMovies.map((_, index) => (
              <button
                key={index}
                className={`trending-indicator ${index === currentTrendingIndex ? 'active' : ''}`}
                onClick={() => setCurrentTrendingIndex(index)}
              />
            ))}
          </div>
          <button className="trending-nav-btn" onClick={handleNextTrending}>›</button>
        </div>
      </div>

      {/* Main Content - Movies Only */}
      <div className="home-content-full">
        {/* All Movies Section */}
        <section className="home-movies-only-section">
          <div className="section-header">
            <h2 className="section-title">All Movies</h2>
            <p className="section-subtitle">{allMovies.length} movies available</p>
          </div>

          {allMovies.length > 0 ? (
            <div className="movies-grid-home">
              {allMovies.map(movie => (
                <div key={movie.uid} className="movie-card-wrapper">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No movies found</h2>
              <p>Check back later for new additions!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

