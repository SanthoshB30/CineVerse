import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllActors, getImageUrl } from '../api/contentstack';

const AllActorsPage = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActors();
  }, []);

  const loadActors = async () => {
    setLoading(true);
    const actorsData = await getAllActors();
    setActors(actorsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading actors...</p>
      </div>
    );
  }

  return (
    <div className="all-actors-page">
      <div className="page-header">
        <h1>All Actors</h1>
        <p>{actors.length} {actors.length === 1 ? 'actor' : 'actors'} in our collection</p>
      </div>

      {actors.length > 0 ? (
        <div className="actors-grid">
          {actors.map(actor => {
            const profileUrl = getImageUrl(actor.profile_image) || 
                              'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=' + 
                              encodeURIComponent(actor.name.charAt(0));
            
            return (
              <Link 
                key={actor.uid}
                to={`/actor/${actor.slug}`}
                className="actor-card"
              >
                <div className="actor-card-image">
                  <img src={profileUrl} alt={actor.name} />
                </div>
                <div className="actor-card-info">
                  <h3>{actor.name}</h3>
                  {actor.birth_year && (
                    <p className="actor-year">Born {actor.birth_year}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No actors found</h2>
          <p>Actor profiles will appear here once added to Contentstack.</p>
        </div>
      )}
    </div>
  );
};

export default AllActorsPage;

