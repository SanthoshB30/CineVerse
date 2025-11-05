import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDirectors, getImageUrl } from '../api/contentstack';

const AllDirectorsPage = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDirectors();
  }, []);

  const loadDirectors = async () => {
    setLoading(true);
    const directorsData = await getAllDirectors();
    setDirectors(directorsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading directors...</p>
      </div>
    );
  }

  return (
    <div className="all-directors-page">
      <div className="page-header">
        <h1>All Directors</h1>
        <p>{directors.length} directors in our collection</p>
      </div>

      {directors.length > 0 ? (
        <div className="directors-grid">
          {directors.map(director => {
            const profileUrl = getImageUrl(director.profile_image) || 
                              'https://via.placeholder.com/200x200/1a1a1a/ffffff?text=' + 
                              encodeURIComponent(director.name.charAt(0));
            
            return (
              <Link 
                key={director.uid}
                to={`/director/${director.slug}`}
                className="director-card"
              >
                <div className="director-card-image">
                  <img src={profileUrl} alt={director.name} />
                </div>
                <div className="director-card-info">
                  <h3>{director.name}</h3>
                  {director.birth_year && (
                    <p className="director-year">Born {director.birth_year}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>No directors found.</p>
        </div>
      )}
    </div>
  );
};

export default AllDirectorsPage;

