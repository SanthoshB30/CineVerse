import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/contentstack';

const MovieCard = ({ movie }) => {
  const posterUrl = getImageUrl(movie.poster_image);
  const defaultPoster = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';

  return (
    <Link to={`/movie/${movie.slug}`} className="movie-card">
      <div className="movie-card-image">
        <img 
          src={posterUrl || defaultPoster} 
          alt={movie.title}
          loading="lazy"
        />
        {movie.featured && (
          <div className="featured-badge">Featured</div>
        )}
      </div>
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-meta">
          <span className="movie-year">{movie.release_year}</span>
          {movie.rating && (
            <span className="movie-rating">
              ⭐ {movie.rating.toFixed(1)}
            </span>
          )}
        </div>
        {movie.genre && movie.genre.length > 0 && (
          <div className="movie-genres">
            {movie.genre.slice(0, 2).map(g => (
              <span key={g.uid} className="genre-tag">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;

