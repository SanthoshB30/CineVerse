import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieBySlug, getImageUrl, getMoviesByGenre } from '../api/contentstack';
import ReviewSection from '../components/ReviewSection';
import MovieCard from '../components/MovieCard';
import { trackMovieView, trackWatchedMovie } from '../services/analytics';

const MovieDetailPage = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    loadMovie();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowStickyBar(currentScrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadMovie = async () => {
    setLoading(true);
    window.scrollTo(0, 0);
    const movieData = await getMovieBySlug(slug);
    setMovie(movieData);
    
    if (movieData) {
      trackMovieView(movieData.uid, movieData.title, movieData.slug);
    }
    
    if (movieData && movieData.genre && movieData.genre.length > 0) {
      const genreSlug = movieData.genre[0].slug;
      const moviesInGenre = await getMoviesByGenre(genreSlug);
      const similar = moviesInGenre
        .filter(m => m.uid !== movieData.uid)
        .slice(0, 6);
      setSimilarMovies(similar);
    }
    
    setLoading(false);
  };

  const handleWatchClick = (platform) => {
    if (movie) {
      trackWatchedMovie(movie.uid, movie.title);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading movie...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-page">
        <h1>Movie Not Found</h1>
        <p>The movie you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const bannerUrl = getImageUrl(movie.banner_image) || 
                     getImageUrl(movie.poster_image) || 
                     'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Movie+Banner';
  const posterUrl = getImageUrl(movie.poster_image) || 
                     'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';

  return (
    <div className="movie-detail-page">
      {/* Parallax Header */}
      <section className="movie-detail-header-parallax">
        {/* Parallax Backdrop */}
        <div 
          className="parallax-backdrop"
          style={{ 
            backgroundImage: `url(${bannerUrl})`,
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})`
          }}
        />
        
        {/* Multi-layer Gradient Overlays */}
        <div className="parallax-overlay parallax-overlay-primary" />
        <div className="parallax-overlay parallax-overlay-secondary" />
        <div className="parallax-overlay parallax-overlay-vignette" />
        
        {/* Content Container */}
        <div className="parallax-content-container">
          <div className="parallax-content">
            {/* Left: Poster Column (sticky on scroll) */}
            <div className="poster-column">
              <div className="poster-sticky">
                <img 
                  src={posterUrl} 
                  alt={`${movie.title} poster`}
                  className="poster-image-3d"
                />
                
                {/* Floating Action Buttons */}
                <div className="poster-actions">
                  {movie.trailer_url && (
                    <a 
                      href={movie.trailer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn primary"
                      aria-label="Play trailer"
                    >
                      <span className="icon">▶</span>
                      <span>Trailer</span>
                    </a>
                  )}
                  <button className="action-btn secondary" aria-label="Add to watchlist">
                    <span className="icon">+</span>
                  </button>
                  <button className="action-btn secondary" aria-label="Share">
                    <span className="icon">↗</span>
                  </button>
                </div>
                
                {/* Rating Badge */}
                {movie.rating && (
                  <div className="rating-badge-3d">
                    <span className="rating-score">{movie.rating.toFixed(1)}</span>
                    <span className="rating-max">/5</span>
                    <div className="rating-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.round(movie.rating) ? 'star-filled' : 'star-empty'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right: Details Column */}
            <div className="details-column">
              <h1 className="movie-title-enhanced">
                {movie.title}
                {movie.original_title && movie.original_title !== movie.title && (
                  <span className="original-title">({movie.original_title})</span>
                )}
              </h1>
              
              {/* Enhanced Meta Row */}
              <div className="meta-row-enhanced">
                {movie.release_year && (
                  <span className="meta-item">{movie.release_year}</span>
                )}
                {movie.duration && (
                  <>
                    <span className="meta-divider">•</span>
                    <span className="meta-item">{movie.duration}</span>
                  </>
                )}
                {movie.rating && (
                  <>
                    <span className="meta-divider">•</span>
                    <span className="meta-item rating-highlight">
                      ⭐ {movie.rating.toFixed(1)}
                    </span>
                  </>
                )}
                {movie.age_rating && (
                  <>
                    <span className="meta-divider">•</span>
                    <span className="meta-item age-rating">{movie.age_rating}</span>
                  </>
                )}
              </div>
              
              {/* Genre Pills */}
              {movie.genre && movie.genre.length > 0 && (
                <div className="genre-pills">
                  {movie.genre.map(genre => (
                    <Link 
                      key={genre.uid} 
                      to={`/genre/${genre.slug}`}
                      className="genre-pill"
                    >
                      <span className="genre-icon">🎭</span>
                      <span>{genre.name}</span>
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Tagline */}
              {movie.tagline && (
                <blockquote className="movie-tagline">
                  "{movie.tagline}"
                </blockquote>
              )}
              
              {/* Synopsis */}
              <div className="synopsis-section">
                <h2>Synopsis</h2>
                <div 
                  className="synopsis-text"
                  dangerouslySetInnerHTML={{ __html: movie.description }}
                />
              </div>
              
              {/* Key Info Grid */}
              <div className="key-info-grid">
                {movie.director && movie.director.length > 0 && (
                  <div className="info-item">
                    <span className="info-label">Director</span>
                    <Link to={`/director/${movie.director[0].slug}`} className="info-value">
                      {movie.director[0].name || movie.director[0].title}
                    </Link>
                  </div>
                )}
                {movie.language && (
                  <div className="info-item">
                    <span className="info-label">Language</span>
                    <span className="info-value">{movie.language}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        {scrollY < 50 && (
          <div className="scroll-indicator">
            <span>Scroll for more</span>
            <span className="scroll-arrow">↓</span>
          </div>
        )}
      </section>

      {/* Sticky Action Bar (appears on scroll) */}
      <div className={`sticky-action-bar ${showStickyBar ? 'visible' : ''}`}>
        <div className="sticky-bar-content">
          <div className="movie-mini-info">
            <img src={posterUrl} alt="" loading="lazy" />
            <span className="movie-mini-title">{movie.title}</span>
          </div>
          <div className="sticky-bar-actions">
            {movie.trailer_url && (
              <a 
                href={movie.trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                ▶ Watch Trailer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Streaming Links Section */}
      {movie.streaming_links && movie.streaming_links.length > 0 && (
        <div className="streaming-section-wrapper">
          <div className="streaming-section">
            <h3>Watch Now On</h3>
            <div className="streaming-platforms">
              {movie.streaming_links.map((link, index) => (
                <a
                  key={index}
                  href={link.watch_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="streaming-button"
                  onClick={() => handleWatchClick(link.platform)}
                >
                  <span className="platform-icon">▶</span>
                  <span className="platform-name">{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="movie-reviews-wrapper">
        <ReviewSection movieUid={movie.uid} />
      </div>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="similar-movies-section">
          <h2 className="section-title">You Might Also Like</h2>
          <div className="similar-movies-grid">
            {similarMovies.map(similarMovie => (
              <MovieCard key={similarMovie.uid} movie={similarMovie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
