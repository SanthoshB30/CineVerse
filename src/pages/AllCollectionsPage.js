import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCollections, getImageUrl } from '../api/contentstack';

const AllCollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    setLoading(true);
    const collectionsData = await getAllCollections();
    setCollections(collectionsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading collections...</p>
      </div>
    );
  }

  return (
    <div className="all-collections-page">
      <div className="page-header">
        <h1>Movie Collections</h1>
        <p>{collections.length} curated {collections.length === 1 ? 'collection' : 'collections'}</p>
      </div>

      {collections.length > 0 ? (
        <div className="collections-grid">
          {collections.map(collection => {
            const featuredImageUrl = getImageUrl(collection.featured_image) || 
                                    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=400&fit=crop';
            
            return (
              <Link 
                key={collection.uid}
                to={`/collection/${collection.slug}`}
                className="collection-card"
              >
                <div 
                  className="collection-card-image"
                  style={{ backgroundImage: `url(${featuredImageUrl})` }}
                >
                  <div className="collection-card-overlay">
                    <h3 className="collection-card-title">{collection.title}</h3>
                    <p className="collection-card-count">
                      {collection.movies?.length || 0} movies
                    </p>
                  </div>
                </div>
                {collection.description && (
                  <div className="collection-card-description">
                    <p>{collection.description}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No collections found</h2>
          <p>Collections will appear here once added to Contentstack.</p>
        </div>
      )}
    </div>
  );
};

export default AllCollectionsPage;

