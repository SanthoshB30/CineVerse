import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDirectorBySlug, getImageUrl, getAllMovies } from '../api/contentstack';
import MovieCard from '../components/MovieCard';

const DirectorPage = () => {
  const { slug } = useParams();
  const [director, setDirector] = useState(null);
  const [directorMovies, setDirectorMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDirector();
  }, [slug]);

  const loadDirector = async () => {
    setLoading(true);
    const directorData = await getDirectorBySlug(slug);
    setDirector(directorData);

    if (directorData) {
      // Get all movies and filter by this director
      const allMovies = await getAllMovies();
      const movies = allMovies.filter(movie => 
        movie.director?.some(d => d.uid === directorData.uid)
      );
      setDirectorMovies(movies);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading director...</p>
      </div>
    );
  }

  if (!director) {
    return (
      <div className="error-page">
        <h1>Director Not Found</h1>
        <p>The director you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const profileUrl = getImageUrl(director.profile_image) || 
                     'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=No+Image';

  return (
    <div className="director-page">
      <div className="director-header">
        <div className="director-profile">
          <img src={profileUrl} alt={director.name} />
        </div>
        <div className="director-info">
          <h1>{director.name}</h1>
          {director.birth_year && (
            <p className="director-year">Born: {director.birth_year}</p>
          )}
          {director.biography && (
            <div 
              className="director-bio"
              dangerouslySetInnerHTML={{ __html: director.biography }}
            />
          )}
        </div>
      </div>

      <div className="director-filmography">
        <h2>Filmography ({directorMovies.length})</h2>
        {directorMovies.length > 0 ? (
          <div className="movies-grid">
            {directorMovies.map(movie => (
              <MovieCard key={movie.uid} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="no-content">No movies found for this director.</p>
        )}
      </div>
    </div>
  );
};

export default DirectorPage;

