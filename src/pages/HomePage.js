import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/contentstack';
import { getAllMovies } from '../services/dataService';
import MovieCard from '../components/MovieCard';
import { trackHomePage } from '../services/analytics';
import { usePersonalizeVariants } from '../personalize/usePersonalizeVariants';
import { useAuth } from '../context/AuthContext';
import logger from '../utils/logger';

const HomePage = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const { selectedProfile } = useAuth();
  const { variants, loading: variantLoading } = usePersonalizeVariants();

  useEffect(() => {
    loadData();
    trackHomePage();
  }, []);

  useEffect(() => {
    if (!variantLoading) {
      logger.info('Profile or variants updated, refreshing content');
      loadData();
    }
  }, [variants, selectedProfile]);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentTrendingIndex((prev) => (prev + 1) % trendingMovies.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [trendingMovies]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const kidFriendlyGenres = ['animation', 'family', 'kids', 'children', 'comedy', 'adventure', 'fantasy'];
  
  const loadData = async () => {
    setLoading(true);
    try {
      const moviesData = await getAllMovies();
      let personalizedMovies = moviesData;
      const isKidsProfile = selectedProfile?.is_kid || variants.some(v => v === 'kids_content' || v.includes('kids'));
      
      if (isKidsProfile) {
        const matureGenres = ['horror', 'thriller', 'crime', 'war'];
        
        personalizedMovies = moviesData.filter(movie => {
          const movieGenres = movie.genre?.map(g => (g.name || g.title || '').toLowerCase()) || [];
          const hasMatureContent = movieGenres.some(genre => 
            matureGenres.some(mature => genre.includes(mature))
          );
          
          if (hasMatureContent) {
            return false;
          }
          
          const hasKidFriendlyGenre = movieGenres.some(genre =>
            kidFriendlyGenres.some(friendly => genre.includes(friendly))
          );
          
          return hasKidFriendlyGenre || movieGenres.length === 0;
        });
        
        logger.success(`Kids filter applied: ${personalizedMovies.length} kid-friendly movies`);
      } else if (variants && variants.length > 0) {
        logger.info('Applying personalization:', variants);
        
        if (variants.some(v => v === 'tamil_movies' || v.includes('tamil'))) {
          const tamilMovies = moviesData.filter(m => m.language === 'tamil' || m.language === 'Tamil');
          const otherMovies = moviesData.filter(m => m.language !== 'tamil' && m.language !== 'Tamil');
          personalizedMovies = [...tamilMovies, ...otherMovies];
          logger.success(`Tamil prioritization applied: ${tamilMovies.length} movies`);
        } else if (variants.some(v => v === 'action_genre' || v.includes('action'))) {
          const actionMovies = moviesData.filter(m => 
            m.genre?.some(g => g.name?.toLowerCase() === 'action')
          );
          const otherMovies = moviesData.filter(m => 
            !m.genre?.some(g => g.name?.toLowerCase() === 'action')
          );
          personalizedMovies = [...actionMovies, ...otherMovies];
          logger.success(`Action prioritization applied: ${actionMovies.length} movies`);
        }
      }
      
      setAllMovies(personalizedMovies);
      
      const trending = personalizedMovies
        .filter(movie => movie.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      setTrendingMovies(trending.length > 0 ? trending : personalizedMovies.slice(0, 5));
    } catch (error) {
      logger.error('Data loading failed:', error.message);
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

  const currentTrendingGenres = currentTrending?.genre?.slice(0, 3).map(g => g.name).join(' • ') || '';
  const description = currentTrending?.description?.replace(/<[^>]*>/g, '') || '';
  const truncatedDescription = description.substring(0, 200);
  const fullDescription = description.substring(0, 400);

  // Check if this is a kids profile
  const isKidsMode = selectedProfile?.is_kid || variants.some(v => v.includes('kids'));

  return (
    <div className="home-page-new">
      {isKidsMode && (
        <div className="kids-mode-banner">
          <span className="kids-mode-icon">👶</span>
          <span className="kids-mode-text">Kids Mode Active</span>
          <span className="kids-mode-subtitle">Only showing age-appropriate content</span>
        </div>
      )}

      <div className="hero-banner-enhanced">
        <div 
          className="hero-parallax-bg"
          style={{ 
            backgroundImage: `url(${bannerUrl})`,
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`
          }}
        />
        
        <div className="hero-gradient-overlay" />
        <div className="hero-vignette" />
        
        {currentTrending && (
          <div className="hero-content-enhanced">
            <div className="hero-badge">
              <span className="badge-icon">👑</span>
              <span>Featured This Week</span>
            </div>
            
            <h1 className="hero-title-animated">{currentTrending.title}</h1>
            
            <div className="hero-meta-enhanced">
              {currentTrending.release_year && (
                <span className="meta-pill">📅 {currentTrending.release_year}</span>
              )}
              {currentTrending.duration && (
                <span className="meta-pill">⏱️ {currentTrending.duration}</span>
              )}
              {currentTrending.rating && (
                <span className="meta-pill meta-rating">⭐ {currentTrending.rating.toFixed(1)}/5</span>
              )}
              {currentTrendingGenres && (
                <span className="meta-pill">🎭 {currentTrendingGenres}</span>
              )}
            </div>
            
            {description && (
              <div className="hero-description-expandable">
                <p>
                  {showFullDescription ? fullDescription : truncatedDescription}
                  {description.length > 200 && '...'}
                </p>
                {description.length > 200 && (
                  <button 
                    className="description-toggle-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            )}
            
            <div className="hero-cta-group">
              <Link to={`/movie/${currentTrending.slug}`} className="btn btn-primary btn-lg hero-cta">
                <span className="btn-icon">▶</span>
                <span>Watch Now</span>
              </Link>
              <Link to={`/movie/${currentTrending.slug}`} className="btn btn-glass btn-lg hero-cta">
                <span className="btn-icon">ℹ</span>
                <span>More Info</span>
              </Link>
            </div>
            
          </div>
        )}

        <div className="hero-carousel-controls">
          <button 
            className="carousel-nav-btn carousel-prev" 
            onClick={handlePrevTrending}
            aria-label="Previous movie"
          >
            ‹
          </button>
          <div className="hero-thumbnails">
            {trendingMovies.map((movie, index) => (
              <button
                key={movie.uid}
                className={`hero-thumbnail ${index === currentTrendingIndex ? 'active' : ''}`}
                onClick={() => setCurrentTrendingIndex(index)}
                aria-label={`View ${movie.title}`}
              >
                <img 
                  src={getImageUrl(movie.poster_image) || 'https://via.placeholder.com/80x120/1a1a1a/ffffff?text=Movie'} 
                  alt={movie.title}
                  loading="lazy"
                />
                <div className="thumbnail-overlay" />
              </button>
            ))}
          </div>
          <button 
            className="carousel-nav-btn carousel-next" 
            onClick={handleNextTrending}
            aria-label="Next movie"
          >
            ›
          </button>
        </div>

        {scrollY < 50 && (
          <div className="scroll-indicator">
            <span>Scroll to explore</span>
            <span className="scroll-arrow">↓</span>
          </div>
        )}
      </div>

      <div className="home-content-full">
        <section className="home-movies-only-section">
          <div className="section-header">
            <h2 className="section-title">
              {selectedProfile?.is_kid || variants.some(v => v.includes('kids')) ? '👶 Kids Movies' :
               variants.some(v => v.includes('tamil')) ? '🎬 Tamil Movies' :
               variants.some(v => v.includes('action')) ? '💥 Action Movies' :
               'All Movies'}
            </h2>
            <p className="section-subtitle">
              {allMovies.length} movies available
              {(selectedProfile?.is_kid || variants.length > 0) && <span style={{ marginLeft: '10px', color: '#6C5CE7' }}>• Personalized for you</span>}
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

