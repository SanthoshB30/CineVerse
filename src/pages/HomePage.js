/**
 * HomePage Component
 * 
 * This component displays the personalized home page for CineVerse.
 * 
 * PERSONALIZATION APPROACH:
 * - Content personalization is SERVER-DRIVEN via Contentstack Personalize
 * - The home_page entry in Contentstack contains pre-ordered movie references
 * - Variants (Tamil, Action, Kids, etc.) are configured in Contentstack Personalize
 * - NO frontend filtering or sorting is applied to movie lists
 * 
 * The usePersonalizeVariants hook is ONLY used for:
 * - UI labels (section titles like "Tamil Movies", "Kids Movies")
 * - Displaying the Kids Mode banner
 * - Loading state messaging
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getImageUrl } from '../api/contentstack';
import { getPersonalizedHomePage } from '../services/personalizedHomeService';
import MovieCard from '../components/MovieCard';
import { trackHomePage } from '../services/analytics';
import { usePersonalizeVariants } from '../personalize/usePersonalizeVariants';
import { useAuth } from '../context/AuthContext';
import logger from '../utils/logger';

const HomePage = () => {
  // State for personalized content from Contentstack
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  
  // UI state
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Auth and personalization context
  const { selectedProfile } = useAuth();
  const [searchParams] = useSearchParams();
  
  // usePersonalizeVariants is used ONLY for UI labels and Kids Mode banner
  // NOT for filtering or sorting content - that happens server-side
  // 
  // Debug: Check console for Personalize.getVariantParam() output
  // Expected values:
  // - Tamil user -> 'tamil_movies'
  // - Kids profile -> 'kids_content'
  // - New user -> 'default' or null
  const { variants, variantParam, loading: variantLoading } = usePersonalizeVariants();

  /**
   * Fetches personalized home page content from Contentstack
   * The personalization happens on the server side via .variants() API
   * No frontend filtering or sorting is applied
   */
  const loadPersonalizedContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      logger.group('HomePage: Loading Personalized Content');
      
      // Fetch personalized content from Contentstack
      // The getPersonalizedHomePage service applies .variants() to get the correct variant
      const homePageData = await getPersonalizedHomePage();
      
      if (homePageData.error) {
        logger.error('Failed to load personalized content:', homePageData.error);
        setError(homePageData.error);
        setFeaturedMovies([]);
        setTrendingMovies([]);
      } else {
        // Set featured movies directly from Contentstack response
        // NO frontend filtering or sorting - content is pre-personalized
        setFeaturedMovies(homePageData.featured_movies);
        
        // Set trending movies for hero carousel
        // Order is determined by Contentstack entry, not frontend logic
        setTrendingMovies(homePageData.trending_movies);
        
        logger.success('Personalized content loaded:', {
          featured: homePageData.featured_movies.length,
          trending: homePageData.trending_movies.length
        });
      }
      
      logger.groupEnd();
    } catch (err) {
      logger.error('HomePage: Data loading failed:', err.message);
      setError(err.message);
      setFeaturedMovies([]);
      setTrendingMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and analytics tracking
  useEffect(() => {
    loadPersonalizedContent();
    trackHomePage();
  }, [loadPersonalizedContent]);

  // Reload content when variants change (user switches profile)
  // The content will be re-fetched with new variant aliases from getVariantParam()
  useEffect(() => {
    if (!variantLoading) {
      logger.info('Variants updated, refreshing personalized content');
      logger.info('Current variant param:', variantParam || 'default');
      loadPersonalizedContent();
    }
  }, [variants, variantParam, selectedProfile, variantLoading, loadPersonalizedContent]);

  // Auto-rotate hero carousel
  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentTrendingIndex((prev) => (prev + 1) % trendingMovies.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [trendingMovies]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel navigation handlers
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

  /**
   * Returns the appropriate section title based on active variants
   * This is UI-only personalization - does not affect content
   */
  const getSectionTitle = () => {
    // Check profile first
    if (selectedProfile?.is_kid) {
      return 'Kids Movies';
    }
    
    // Check variant aliases for UI label
    if (variants.some(v => v.includes('kids'))) {
      return 'Kids Movies';
    }
    if (variants.some(v => v.includes('tamil'))) {
      return 'Tamil Movies';
    }
    if (variants.some(v => v.includes('action'))) {
      return 'Action Movies';
    }
    
    return 'Trending Movies';
  };

  /**
   * Checks if Kids Mode is active for UI banner display
   * Checks URL param, profile, or variants
   */
  const isKidsMode = searchParams.get('isKids') === 'true' || selectedProfile?.is_kid || variants.some(v => v.includes('kids'));

  // Loading state
  if (loading || variantLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>{variantLoading ? 'Personalizing content...' : 'Loading CineVerse...'}</p>
      </div>
    );
  }

  // Error state
  if (error && featuredMovies.length === 0 && trendingMovies.length === 0) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h2>Unable to load content</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={loadPersonalizedContent}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Current trending movie for hero banner
  const currentTrending = trendingMovies[currentTrendingIndex];
  const bannerUrl = currentTrending ? 
    (getImageUrl(currentTrending.banner_image) || getImageUrl(currentTrending.poster_image) || 
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop') :
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1920&h=1080&fit=crop';

  const currentTrendingGenres = currentTrending?.genre?.slice(0, 3).map(g => g.name).join(' . ') || '';
  const description = currentTrending?.description?.replace(/<[^>]*>/g, '') || '';
  const truncatedDescription = description.substring(0, 200);
  const fullDescription = description.substring(0, 400);

  return (
    <div className="home-page-new">
      {/* Kids Mode Indicator - compact pill style */}
      {isKidsMode && (
        <div className="kids-mode-pill">
          <span className="kids-mode-pill-icon">👶</span>
          <span className="kids-mode-pill-text">Kids Mode</span>
        </div>
      )}

      {/* Hero Banner with Trending Movies Carousel */}
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
              <span className="badge-icon">*</span>
              <span>Featured This Week</span>
            </div>
            
            <h1 className="hero-title-animated">{currentTrending.title}</h1>
            
            <div className="hero-meta-enhanced">
              {currentTrending.release_year && (
                <span className="meta-pill">{currentTrending.release_year}</span>
              )}
              {currentTrending.duration && (
                <span className="meta-pill">{currentTrending.duration}</span>
              )}
              {currentTrending.rating && (
                <span className="meta-pill meta-rating">{currentTrending.rating.toFixed(1)}/5</span>
              )}
              {currentTrendingGenres && (
                <span className="meta-pill">{currentTrendingGenres}</span>
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
                <span className="btn-icon">Play</span>
                <span>Watch Now</span>
              </Link>
              <Link to={`/movie/${currentTrending.slug}`} className="btn btn-glass btn-lg hero-cta">
                <span className="btn-icon">Info</span>
                <span>More Info</span>
              </Link>
            </div>
            
          </div>
        )}

        {/* Hero Carousel Controls */}
        <div className="hero-carousel-controls">
          <button 
            className="carousel-nav-btn carousel-prev" 
            onClick={handlePrevTrending}
            aria-label="Previous movie"
          >
            &lt;
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
            &gt;
          </button>
        </div>

        {scrollY < 50 && (
          <div className="scroll-indicator">
            <span>Scroll to explore</span>
            <span className="scroll-arrow">v</span>
          </div>
        )}
      </div>

      {/* Featured Movies Section */}
      <div className="home-content-full">
        <section className="home-movies-only-section">
          <div className="section-header">
            {/* Section title uses variants for UI label only */}
            <h2 className="section-title">{getSectionTitle()}</h2>
            <p className="section-subtitle">
              Personalized for you
            </p>
          </div>

          {/* Movie Grid - displays pre-personalized content from Contentstack */}
          {featuredMovies.length > 0 ? (
            <div className="movies-grid-home">
              {featuredMovies.map(movie => (
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
