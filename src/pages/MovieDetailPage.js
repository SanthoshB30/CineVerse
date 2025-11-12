import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieBySlug, getImageUrl, getMoviesByGenre } from '../api/contentstack';
import ReviewSection from '../components/ReviewSection';
import MovieCard from '../components/MovieCard';

const MovieDetailPage = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovie();
  }, [slug]);

  const loadMovie = async () => {
    setLoading(true);
    const movieData = await getMovieBySlug(slug);
    setMovie(movieData);
    
    // Load similar movies based on genre
    if (movieData && movieData.genre && movieData.genre.length > 0) {
      const genreSlug = movieData.genre[0].slug;
      const moviesInGenre = await getMoviesByGenre(genreSlug);
      
      // Filter out current movie and limit to 6 similar movies
      const similar = moviesInGenre
        .filter(m => m.uid !== movieData.uid)
        .slice(0, 6);
      setSimilarMovies(similar);
    }
    
    setLoading(false);
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
      {/* Hero Section */}
      <div 
        className="movie-hero"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        <div className="movie-hero-overlay"></div>
      </div>

      {/* Content Section */}
      <div className="movie-content">
        <div className="movie-main">
          <div className="movie-poster">
            <img src={posterUrl} alt={movie.title} />
          </div>

          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            
            <div className="movie-meta">
              <span className="meta-item">{movie.release_year}</span>
              {movie.duration && (
                <span className="meta-item">{movie.duration}</span>
              )}
              {movie.rating && (
                <span className="meta-item rating">
                  ⭐ {movie.rating.toFixed(1)} / 5
                </span>
              )}
            </div>

            {movie.genre && movie.genre.length > 0 && (
              <div className="movie-genres">
                {movie.genre.map(genre => (
                  <Link 
                    key={genre.uid}
                    to={`/genre/${genre.slug}`}
                    className="genre-badge"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            {movie.director && movie.director.length > 0 && (
              <div className="movie-director">
                <strong>Director:</strong>{' '}
                <Link to={`/director/${movie.director[0].slug}`}>
                  {movie.director[0].name}
                </Link>
              </div>
            )}

            <div className="movie-description">
              <h2>Synopsis</h2>
              <div 
                dangerouslySetInnerHTML={{ __html: movie.description }}
              />
            </div>

            <div className="movie-actions">
              {movie.trailer_url && (
                <a 
                  href={movie.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  🎬 Watch Trailer
                </a>
              )}
            </div>

            {movie.streaming_links && movie.streaming_links.length > 0 && (
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
                    >
                      <span className="platform-icon">▶</span>
                      <span className="platform-name">{link.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="movie-reviews">
          <ReviewSection movieUid={movie.uid} />
        </div>

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="similar-movies-section">
            <h2 className="section-title">Similar to this</h2>
            <div className="similar-movies-grid">
              {similarMovies.map(similarMovie => (
                <MovieCard key={similarMovie.uid} movie={similarMovie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;

