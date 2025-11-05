import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieBySlug, getImageUrl } from '../api/contentstack';
import ReviewSection from '../components/ReviewSection';

const MovieDetailPage = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovie();
  }, [slug]);

  const loadMovie = async () => {
    setLoading(true);
    const movieData = await getMovieBySlug(slug);
    setMovie(movieData);
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

            {movie.trailer_url && (
              <div className="movie-actions">
                <a 
                  href={movie.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  🎬 Watch Trailer
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="movie-reviews">
          <ReviewSection movieUid={movie.uid} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;

