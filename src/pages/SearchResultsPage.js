import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { searchMovies } from '../api/contentstack';
import MovieCard from '../components/MovieCard';
import { trackSearch } from '../services/analytics';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchContext, setSearchContext] = useState({
    genres: new Set(),
    directors: new Set(),
    years: new Set()
  });

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
    
    const context = {
      genres: new Set(),
      directors: new Set(),
      years: new Set()
    };
    
    movies.forEach(movie => {
      movie.genre?.forEach(g => context.genres.add(g.name || g.title));
      movie.director?.forEach(d => context.directors.add(d.name || d.title));
      if (movie.release_year) context.years.add(movie.release_year);
    });
    
    setSearchContext(context);
    trackSearch(query, movies.length);
    
    setLoading(false);
  };

  const getSearchSuggestions = () => {
    const suggestions = [];
    
    if (searchContext.genres.size > 0) {
      suggestions.push(`Genres: ${Array.from(searchContext.genres).slice(0, 3).join(', ')}`);
    }
    if (searchContext.directors.size > 0) {
      suggestions.push(`Directors: ${Array.from(searchContext.directors).slice(0, 3).join(', ')}`);
    }
    if (searchContext.years.size > 0) {
      const years = Array.from(searchContext.years).sort((a, b) => b - a);
      suggestions.push(`Years: ${years.slice(0, 3).join(', ')}`);
    }
    
    return suggestions;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Searching...</p>
      </div>
    );
  }

  const suggestions = getSearchSuggestions();

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query} - CineVerse` : 'Search - CineVerse'}</title>
        <meta name="description" content={`Search results for "${query}" on CineVerse. Found ${results.length} movies matching your search.`} />
        <meta name="keywords" content={`${query}, movies, search, cinema, ${Array.from(searchContext.genres).join(', ')}`} />
        <meta property="og:title" content={`Search: ${query} - CineVerse`} />
        <meta property="og:description" content={`Found ${results.length} movies for "${query}"`} />
        <meta property="og:type" content="website" />
      </Helmet>

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
            <p className="search-tips">Try searching by:</p>
            <ul className="search-tips-list">
              <li>Movie title (e.g., "Inception", "Dune")</li>
              <li>Director name (e.g., "Christopher Nolan")</li>
              <li>Genre (e.g., "Horror", "Sci-Fi")</li>
              <li>Release year (e.g., "2021")</li>
            </ul>
            <Link to="/home" className="btn btn-primary">Back to Home</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;

