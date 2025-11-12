import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllGenres, getAllDirectors } from '../api/contentstack';
import { getAllMovies } from '../services/dataService';
import MovieCard from '../components/MovieCard';
import { getImageUrl } from '../api/contentstack';

const HomePage = () => {
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      const [genresData, directorsData, moviesData] = await Promise.all([
        getAllGenres(),
        getAllDirectors(),
        getAllMovies()
      ]);
      
      setGenres(genresData);
      setDirectors(directorsData.slice(0, 10)); // Show first 10 directors
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

      {/* Main Content with Sidebar */}
      <div className="home-main-content">
        {/* Sidebar */}
        <aside className={`home-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '‹' : '›'}
          </button>

          {sidebarOpen && (
            <div className="sidebar-content">
              {/* Genres Section */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">🎭 Genres</h3>
                <ul className="sidebar-list">
                  {genres.map(genre => (
                    <li key={genre.uid}>
                      <Link to={`/genre/${genre.slug}`} className="sidebar-link">
                        {genre.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Directors Section */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">🎬 Directors</h3>
                <ul className="sidebar-list">
                  {directors.map(director => (
                    <li key={director.uid}>
                      <Link to={`/director/${director.slug}`} className="sidebar-link">
                        {director.name}
                      </Link>
                    </li>
                  ))}
                  {directors.length > 0 && (
                    <li>
                      <Link to="/directors" className="sidebar-link view-all">
                        View All Directors →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Actors Section */}
              <div className="sidebar-section">
                <h3 className="sidebar-title">⭐ Actors</h3>
                <ul className="sidebar-list">
                  <li>
                    <Link to="/actors" className="sidebar-link">
                      Browse All Actors
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </aside>

        {/* Movies Grid */}
        <div className="home-movies-section">
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;

