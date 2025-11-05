import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';

const GenreCarousel = ({ genre, movies }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      const newScrollPosition = carouselRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      carouselRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="genre-carousel">
      <div className="carousel-header">
        <h2 className="carousel-title">
          {genre.name}
        </h2>
        <Link to={`/genre/${genre.slug}`} className="view-all-link">
          View All →
        </Link>
      </div>
      
      <div className="carousel-container">
        <button 
          className="carousel-button left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>
        
        <div className="carousel-track" ref={carouselRef}>
          {movies.map(movie => (
            <div key={movie.uid} className="carousel-item">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        
        <button 
          className="carousel-button right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default GenreCarousel;

