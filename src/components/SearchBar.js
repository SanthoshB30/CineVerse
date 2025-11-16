import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { searchMovies } from '../api/contentstack';

const SearchBar = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // Keep search term in sync with URL on search results page
  useEffect(() => {
    if (location.pathname === '/search') {
      const query = searchParams.get('q') || '';
      setSearchTerm(query);
    }
  }, [location.pathname, searchParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length >= 2) {
        setIsLoading(true);
        const results = await searchMovies(searchTerm);
        setSuggestions(results.slice(0, 5)); // Show top 5 results
        setShowSuggestions(true);
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSuggestions(false);
      // Only clear if NOT on search results page
      if (location.pathname !== '/search') {
        setSearchTerm('');
      }
    }
  };

  const handleSuggestionClick = (movie) => {
    setShowSuggestions(false);
    setSearchTerm('');
    navigate(`/movie/${movie.slug}`);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search movies, directors, genres..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="search-input"
          autoComplete="off"
        />
        <button type="submit" className="search-button" aria-label="Search">
          🔍
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {isLoading ? (
            <div className="suggestion-loading">Searching...</div>
          ) : (
            <>
              {suggestions.map((movie) => (
                <div
                  key={movie.uid}
                  className="search-suggestion-item"
                  onClick={() => handleSuggestionClick(movie)}
                >
                  <div className="suggestion-poster">
                    {movie.poster_image?.url ? (
                      <img src={movie.poster_image.url} alt={movie.title} />
                    ) : (
                      <div className="suggestion-poster-placeholder">🎬</div>
                    )}
                  </div>
                  <div className="suggestion-info">
                    <div className="suggestion-title">{movie.title}</div>
                    <div className="suggestion-meta">
                      {movie.release_year && <span>{movie.release_year}</span>}
                      {movie.rating && <span className="suggestion-rating">⭐ {movie.rating}</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="suggestion-footer" onClick={() => onSearch(searchTerm)}>
                View all results for "{searchTerm}" →
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

