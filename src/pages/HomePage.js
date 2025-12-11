import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/contentstack';
import { getAllMovies } from '../services/dataService';
import MovieCard from '../components/MovieCard';
import { trackHomePage } from '../services/analytics';
import { usePersonalizeVariants } from '../personalize/usePersonalizeVariants';

const HomePage = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Get personalization variants (array of variant aliases)
  const { variants, loading: variantLoading } = usePersonalizeVariants();

  useEffect(() => {
    loadData();
    // Track home page visit
    trackHomePage();
  }, []);

  // Reload data when variants change
  useEffect(() => {
    if (variants.length > 0 && !variantLoading) {
      console.log('🔄 Variants changed, reloading data with personalization');
      loadData();
    }
  }, [variants]);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentTrendingIndex((prev) => (prev + 1) % trendingMovies.length);
      }, 7000); // Increased to 7 seconds for better viewing
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

  const loadData = async () => {
    setLoading(true);
    try {
      const moviesData = await getAllMovies();
      
      // Apply personalization based on variant aliases
      let personalizedMovies = moviesData;
      
      if (variants && variants.length > 0) {
        console.log('🎬 Applying personalization with variants:', variants);
        
        // Check for kids variant
        if (variants.some(v => v === 'kids_content' || v.includes('kids'))) {
          personalizedMovies = moviesData.filter(movie => 
            movie.age_rating === 'U' || movie.age_rating === 'PG' || !movie.age_rating
          );
          console.log(`✅ Kids filter: ${personalizedMovies.length} kid-safe movies`);
        }
        
        // Check for Tamil variant
        else if (variants.some(v => v === 'tamil_movies' || v.includes('tamil'))) {
          const tamilMovies = moviesData.filter(m => m.language === 'tamil' || m.language === 'Tamil');
          const otherMovies = moviesData.filter(m => m.language !== 'tamil' && m.language !== 'Tamil');
          personalizedMovies = [...tamilMovies, ...otherMovies];
          console.log(`✅ Tamil prioritization: ${tamilMovies.length} Tamil movies first`);
        }
        
        // Check for Action variant
        else if (variants.some(v => v === 'action_genre' || v.includes('action'))) {
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

  const currentTrendingGenres = currentTrending?.genre?.slice(0, 3).map(g => g.name).join(' • ') || '';
  const description = currentTrending?.description?.replace(/<[^>]*>/g, '') || '';
  const truncatedDescription = description.substring(0, 200);
  const fullDescription = description.substring(0, 400);

  return (
    <div className="home-page-new">
      {/* Enhanced Hero Banner with Parallax */}
      <div className="hero-banner-enhanced">
        {/* Parallax Background */}
        <div 
          className="hero-parallax-bg"
          style={{ 
            backgroundImage: `url(${bannerUrl})`,
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0002})`
          }}
        />
        
        {/* Multiple gradient overlays for depth */}
        <div className="hero-gradient-overlay" />
        <div className="hero-vignette" />
        
        {currentTrending && (
          <div className="hero-content-enhanced">
            {/* Premium Featured Badge */}
            <div className="hero-badge">
              <span className="badge-icon">👑</span>
              <span>Featured This Week</span>
            </div>
            
            {/* Animated Title */}
            <h1 className="hero-title-animated">{currentTrending.title}</h1>
            
            {/* Enhanced Meta with Icons */}
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
            
            {/* Expandable Description */}
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
            
            {/* Enhanced CTA Group */}
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

        {/* Enhanced Carousel Controls with Thumbnails */}
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

        {/* Scroll Indicator */}
        {scrollY < 50 && (
          <div className="scroll-indicator">
            <span>Scroll to explore</span>
            <span className="scroll-arrow">↓</span>
          </div>
        )}
      </div>

      {/* Main Content - Movies Only */}
      <div className="home-content-full">
        {/* All Movies Section */}
        <section className="home-movies-only-section">
          <div className="section-header">
            <h2 className="section-title">
              {variants.some(v => v.includes('kids')) ? '👶 Kids Movies' :
               variants.some(v => v.includes('tamil')) ? '🎬 Tamil Movies' :
               variants.some(v => v.includes('action')) ? '💥 Action Movies' :
               'All Movies'}
            </h2>
            <p className="section-subtitle">
              {allMovies.length} movies available
              {variants.length > 0 && <span style={{ marginLeft: '10px', color: '#6C5CE7' }}>• Personalized for you</span>}
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

