import React from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../api/contentstack';

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <div className="watchlist-title-section">
          <h1 className="watchlist-title">
            <span className="watchlist-icon">🎬</span>
            My Watchlist
          </h1>
          <p className="watchlist-subtitle">
            {watchlist.length === 0 
              ? "Your watchlist is empty. Start adding movies you want to watch!"
              : `${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''} saved`
            }
          </p>
        </div>
        {watchlist.length > 0 && (
          <button 
            className="clear-watchlist-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
                clearWatchlist();
              }
            }}
          >
            <span className="clear-icon">🗑️</span>
            Clear All
          </button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="watchlist-empty">
          <div className="empty-illustration">
            <span className="empty-icon">📽️</span>
          </div>
          <h2>No movies in your watchlist yet</h2>
          <p>Browse our collection and add movies you'd like to watch later.</p>
          <Link to="/movies" className="btn btn-primary">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((movie, index) => {
            const posterUrl = getImageUrl(movie.poster_image) || 
              'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
            
            return (
              <div 
                key={movie.uid} 
                className="watchlist-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/movie/${movie.slug}`} className="watchlist-card-link">
                  <div className="watchlist-card-poster">
                    <img src={posterUrl} alt={movie.title} loading="lazy" />
                    <div className="watchlist-card-overlay">
                      <span className="play-icon">▶</span>
                    </div>
                  </div>
                </Link>
                
                <div className="watchlist-card-info">
                  <Link to={`/movie/${movie.slug}`}>
                    <h3 className="watchlist-card-title">{movie.title}</h3>
                  </Link>
                  
                  <div className="watchlist-card-meta">
                    {movie.release_year && (
                      <span className="meta-year">{movie.release_year}</span>
                    )}
                    {movie.rating && (
                      <span className="meta-rating">
                        ⭐ {movie.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  
                  {movie.genre && movie.genre.length > 0 && (
                    <div className="watchlist-card-genres">
                      {movie.genre.slice(0, 2).map(g => (
                        <span key={g.uid} className="genre-tag">{g.name}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="watchlist-card-added">
                    Added {formatDate(movie.addedAt)}
                  </div>
                </div>
                
                <button 
                  className="remove-from-watchlist-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWatchlist(movie.uid);
                  }}
                  aria-label={`Remove ${movie.title} from watchlist`}
                >
                  <span className="remove-icon">×</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;

