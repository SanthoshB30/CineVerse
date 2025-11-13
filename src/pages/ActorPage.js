import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActorBySlug, getImageUrl } from '../api/contentstack';

const ActorPage = () => {
  const { slug } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActor();
  }, [slug]);

  const loadActor = async () => {
    setLoading(true);
    const actorData = await getActorBySlug(slug);
    setActor(actorData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading actor...</p>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="error-page">
        <h1>Actor Not Found</h1>
        <p>The actor you're looking for doesn't exist.</p>
        <Link to="/actors" className="btn btn-primary">Browse All Actors</Link>
      </div>
    );
  }

  const profileUrl = getImageUrl(actor.profile_image) || 
                     'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=No+Image';

  return (
    <div className="actor-page">
      <div className="actor-header">
        <div className="actor-profile">
          <img src={profileUrl} alt={actor.name} />
        </div>
        <div className="actor-info">
          <h1>{actor.name}</h1>
          {actor.birth_year && (
            <p className="actor-year">Born: {actor.birth_year}</p>
          )}
          {actor.bio && (
            <div 
              className="actor-bio"
              dangerouslySetInnerHTML={{ __html: actor.bio }}
            />
          )}
        </div>
      </div>

      <div className="actor-filmography">
        <h2>Filmography</h2>
        <div className="coming-soon-notice">
          <p>🎬 Filmography coming soon! This feature will show all movies featuring {actor.name}.</p>
        </div>
      </div>
    </div>
  );
};

export default ActorPage;

