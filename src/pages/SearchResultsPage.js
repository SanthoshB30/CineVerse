import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchMovies } from '../api/contentstack';
import MovieCard from '../components/MovieCard';
import { trackSearch } from '../services/analytics';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performSearch();
  }, [query]);

  const performSearch = async () => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const movies = await searchMovies(query);
    setResults(movies);
    
    // Track search query and results
    trackSearch(query, movies.length);
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Searching...</p>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search Results</h1>
        <p className="search-query">
          Showing results for: <strong>"{query}"</strong>
        </p>
        <p className="search-count">{results.length} movie(s) found</p>
      </div>

      {results.length > 0 ? (
        <div className="movies-grid">
          {results.map(movie => (
            <MovieCard key={movie.uid} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No Results Found</h2>
          <p>We couldn't find any movies matching "{query}"</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;

