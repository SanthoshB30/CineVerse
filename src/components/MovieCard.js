import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/contentstack';

const MovieCard = ({ movie }) => {
  const posterUrl = getImageUrl(movie.poster_image);
  const defaultPoster = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
  const accessibleTitle = `${movie.title}${movie.release_year ? `, released in ${movie.release_year}` : ''}${movie.rating ? `, rated ${movie.rating.toFixed(1)} stars` : ''}`;

  return (
    <Link 
      to={`/movie/${movie.slug}`} 
      className="movie-card"
      aria-label={accessibleTitle}
    >
      <div className="movie-card-image">
        <img 
          src={posterUrl || defaultPoster} 
          alt={`${movie.title} movie poster`}
          loading="lazy"
          decoding="async"
          width="300"
          height="450"
        />
        {movie.featured && (
          <div 
            className="featured-badge" 
            aria-label="Featured movie"
            role="status"
          >
            Featured
          </div>
        )}
      </div>
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-meta" aria-label="Movie information">
          {movie.release_year && (
            <span className="movie-year" aria-label={`Released in ${movie.release_year}`}>
              {movie.release_year}
            </span>
          )}
          {movie.rating && (
            <span 
              className="movie-rating"
              aria-label={`Rating: ${movie.rating.toFixed(1)} out of 5 stars`}
              role="img"
            >
              ⭐ {movie.rating.toFixed(1)}
            </span>
          )}
        </div>
        {movie.genre && movie.genre.length > 0 && (
          <div className="movie-genres" aria-label="Movie genres">
            {movie.genre.slice(0, 2).map(g => (
              <span 
                key={g.uid} 
                className="genre-tag"
                aria-label={`Genre: ${g.name}`}
              >
                {g.name}
              </span>
            ))}
            {movie.genre.length > 2 && (
              <span 
                className="genre-tag"
                aria-label={`${movie.genre.length - 2} more genres`}
              >
                +{movie.genre.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;

