import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllGenres, getImageUrl } from '../api/contentstack';

// Fallback emoji icons if no image is provided
const GENRE_ICONS = {
  'horror': '👻',
  'comedy': '😂',
  'sci-fi': '🚀',
  'action': '💥',
  'drama': '🎭',
  'thriller': '🔪',
  'adventure': '🗺️',
  'romance': '❤️',
  'fantasy': '🧙',
  'mystery': '🔍',
  'animation': '🎨',
  'documentary': '📽️',
  'crime': '🕵️',
  'western': '🤠',
  'musical': '🎵'
};

const BrowseGenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setLoading(true);
    const genresData = await getAllGenres();
    setGenres(genresData);
    setLoading(false);
  };

  const getGenreIcon = (genreSlug) => {
    return GENRE_ICONS[genreSlug.toLowerCase()] || '🎬';
  };

  const getGenreDisplay = (genre) => {
    const imageUrl = getImageUrl(genre.genre_image);
    if (imageUrl) {
      return <img src={imageUrl} alt={genre.name} className="genre-image" />;
    }
    return <span className="genre-emoji">{getGenreIcon(genre.slug)}</span>;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading genres...</p>
      </div>
    );
  }

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1 className="browse-title">Browse by Genre</h1>
        <p className="browse-subtitle">Explore movies by your favorite genres</p>
      </div>

      {genres.length > 0 ? (
        <div className="browse-grid">
          {genres.map(genre => (
            <Link 
              key={genre.uid}
              to={`/genre/${genre.slug}`}
              className="browse-card genre-browse-card"
            >
              <div className="browse-card-icon">
                {getGenreDisplay(genre)}
              </div>
              <div className="browse-card-content">
                <h3 className="browse-card-title">{genre.name}</h3>
                {genre.description && (
                  <p className="browse-card-description">{genre.description}</p>
                )}
              </div>
              <div className="browse-card-arrow">→</div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No genres found</h2>
          <p>Genres will appear here once added to Contentstack.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseGenresPage;

