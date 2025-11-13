import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollectionBySlug, getImageUrl } from '../api/contentstack';
import MovieCard from '../components/MovieCard';

const CollectionPage = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollection();
  }, [slug]);

  const loadCollection = async () => {
    setLoading(true);
    const collectionData = await getCollectionBySlug(slug);
    setCollection(collectionData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading collection...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="error-page">
        <h1>Collection Not Found</h1>
        <p>The collection you're looking for doesn't exist.</p>
        <Link to="/home" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const featuredImageUrl = getImageUrl(collection.featured_image);

  return (
    <div className="collection-page">
      {featuredImageUrl && (
        <div 
          className="collection-hero"
          style={{ backgroundImage: `url(${featuredImageUrl})` }}
        >
          <div className="collection-hero-overlay"></div>
        </div>
      )}

      <div className="collection-content">
        <div className="collection-header">
          <h1 className="collection-title">{collection.title}</h1>
          {collection.description && (
            <p className="collection-description">{collection.description}</p>
          )}
          <p className="collection-count">
            {collection.movies?.length || 0} {collection.movies?.length === 1 ? 'movie' : 'movies'}
          </p>
        </div>

        {collection.movies && collection.movies.length > 0 ? (
          <div className="collection-movies-grid">
            {collection.movies.map(movie => (
              <MovieCard key={movie.uid} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No movies in this collection yet</h2>
            <p>Check back later for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;

