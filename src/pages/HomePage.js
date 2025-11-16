import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/contentstack';
import { getAllMovies } from '../services/dataService';
import MovieCard from '../components/MovieCard';
import { trackHomePage } from '../services/analytics';
import { usePersonalization } from '../personalize/usePersonalization';

const HomePage = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Get personalization variant
  const { variant, loading: variantLoading } = usePersonalization();

  useEffect(() => {
    loadData();
    // Track home page visit
    trackHomePage();
  }, []);

  // Reload data when variant changes
  useEffect(() => {
    if (variant && !variantLoading) {
      console.log('🔄 Variant changed, reloading data with personalization');
      loadData();
    }
  }, [variant]);

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
      
      // Apply personalization based on variant
      let personalizedMovies = moviesData;
      
      if (variant) {
        console.log('🎬 Applying variant-based filtering:', variant.id);
        
        // Kids variant - show only kid-friendly content
        if (variant.id === 'kids-variant' || variant.id === 'kids_content') {
          personalizedMovies = moviesData.filter(movie => 
            movie.age_rating === 'U' || movie.age_rating === 'PG' || !movie.age_rating
          );
          console.log(`✅ Kids filter: ${personalizedMovies.length} kid-safe movies`);
        }
        
        // Tamil variant - prioritize Tamil movies
        else if (variant.id === 'tamil-variant' || variant.id === 'tamil_movies') {
          const tamilMovies = moviesData.filter(m => m.language === 'tamil' || m.language === 'Tamil');
          const otherMovies = moviesData.filter(m => m.language !== 'tamil' && m.language !== 'Tamil');
          personalizedMovies = [...tamilMovies, ...otherMovies];
          console.log(`✅ Tamil prioritization: ${tamilMovies.length} Tamil movies first`);
        }
        
        // Action variant - prioritize action movies
        else if (variant.id === 'action-variant' || variant.id === 'action_genre') {
          const actionMovies = moviesData.filter(m => 
            m.genre?.some(g => g.name?.toLowerCase() === 'action')
          );
          const otherMovies = moviesData.filter(m => 
            !m.genre?.some(g => g.name?.toLowerCase() === 'action')
          );
          personalizedMovies = [...actionMovies, ...otherMovies];
          console.log(`✅ Action prioritization: ${actionMovies.length} action movies first`);
        }
      }
      
      setAllMovies(personalizedMovies);
      
      // Get trending movies (highest rated or featured)
      const trending = personalizedMovies
        .filter(movie => movie.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      setTrendingMovies(trending.length > 0 ? trending : personalizedMovies.slice(0, 5));
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

  if (loading || variantLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>{variantLoading ? 'Personalizing content...' : 'Loading CineVerse...'}</p>
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
            <h2 className="section-title">
              {variant?.id === 'kids-variant' || variant?.id === 'kids_content' ? '👶 Kids Movies' :
               variant?.id === 'tamil-variant' || variant?.id === 'tamil_movies' ? '🎬 Tamil Movies' :
               variant?.id === 'action-variant' || variant?.id === 'action_genre' ? '💥 Action Movies' :
               'All Movies'}
            </h2>
            <p className="section-subtitle">
              {allMovies.length} movies available
              {variant && <span style={{ marginLeft: '10px', color: '#6C5CE7' }}>• Personalized for you</span>}
            </p>
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

