import React from 'react';

const AllActorsPage = () => {
  // Placeholder for future actor functionality
  const actors = [
    { id: 1, name: 'Tom Hanks', image: '👨' },
    { id: 2, name: 'Meryl Streep', image: '👩' },
    { id: 3, name: 'Leonardo DiCaprio', image: '🧑' },
    { id: 4, name: 'Jennifer Lawrence', image: '👩' },
    { id: 5, name: 'Robert Downey Jr.', image: '👨' },
    { id: 6, name: 'Scarlett Johansson', image: '👩' },
    { id: 7, name: 'Denzel Washington', image: '👨' },
    { id: 8, name: 'Cate Blanchett', image: '👩' }
  ];

  return (
    <div className="all-actors-page">
      <div className="page-header">
        <h1>Actors</h1>
        <p>Discover talented actors from around the world</p>
      </div>

      <div className="actors-grid">
        {actors.map(actor => (
          <div key={actor.id} className="actor-card">
            <div className="actor-card-image">
              <div className="actor-avatar">{actor.image}</div>
            </div>
            <div className="actor-card-info">
              <h3>{actor.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="coming-soon-notice">
        <p>🎬 Full actor profiles and filmographies coming soon!</p>
      </div>
    </div>
  );
};

export default AllActorsPage;

