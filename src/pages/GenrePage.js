import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGenreBySlug, getMoviesByGenre, getImageUrl } from '../api/contentstack';
import MovieCard from '../components/MovieCard';
import { trackGenreView } from '../services/analytics';

const GenrePage = () => {
  const { slug } = useParams();
  const [genre, setGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    loadGenre();
  }, [slug]);

  useEffect(() => {
    sortMovies();
  }, [sortBy]);

  const loadGenre = async () => {
    setLoading(true);
    const genreData = await getGenreBySlug(slug);
    setGenre(genreData);

    if (genreData) {
      trackGenreView(genreData.uid, genreData.title, genreData.slug);
    }

    const moviesData = await getMoviesByGenre(slug);
    setMovies(moviesData);
    setLoading(false);
  };

  const sortMovies = () => {
    const sorted = [...movies];
    switch (sortBy) {
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'year':
        sorted.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    setMovies(sorted);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading genre...</p>
      </div>
    );
  }

  if (!genre) {
    return (
      <div className="error-page">
        <h1>Genre Not Found</h1>
        <p>The genre you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const bannerUrl = getImageUrl(genre.featured_image) || 
                    'https://via.placeholder.com/1920x400/1a1a1a/ffffff?text=' + 
                    encodeURIComponent(genre.name);

  return (
    <div className="genre-page">
      <div 
        className="genre-header"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        <div className="genre-header-overlay">
          <h1>{genre.name}</h1>
          {genre.description && (
            <div 
              className="genre-description"
              dangerouslySetInnerHTML={{ __html: genre.description }}
            />
          )}
        </div>
      </div>

      <div className="genre-content">
        <div className="genre-controls">
          <div className="sort-controls">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="title">Title</option>
              <option value="year">Release Year</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {movies.length > 0 ? (
          <div className="movies-grid">
            {movies.map(movie => (
              <MovieCard key={movie.uid} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No movies found in this genre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrePage;

