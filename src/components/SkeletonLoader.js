import React from 'react';

/**
 * Skeleton Loader Components
 * Provides loading state placeholders with smooth animations
 */

// Basic skeleton text line
export const SkeletonText = ({ width = '100%', height = '1rem', className = '' }) => (
  <div 
    className={`skeleton skeleton-text ${className}`}
    style={{ width, height }}
    aria-label="Loading..."
  />
);

// Skeleton title (larger text)
export const SkeletonTitle = ({ width = '70%', className = '' }) => (
  <div 
    className={`skeleton skeleton-title ${className}`}
    style={{ width }}
    aria-label="Loading title..."
  />
);

// Skeleton for movie card
export const SkeletonMovieCard = () => (
  <div className="skeleton-movie-card" role="status" aria-label="Loading movie...">
    <div className="skeleton-movie-poster" />
    <div className="skeleton-movie-title" />
    <div className="skeleton-movie-meta">
      <span className="skeleton" />
      <span className="skeleton" />
    </div>
  </div>
);

// Skeleton grid for multiple movie cards
export const SkeletonMovieGrid = ({ count = 6 }) => (
  <div className="skeleton-grid" role="status" aria-label="Loading movies...">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonMovieCard key={index} />
    ))}
  </div>
);

// Generic skeleton card
export const SkeletonCard = ({ children, className = '' }) => (
  <div className={`skeleton-card ${className}`} role="status" aria-label="Loading content...">
    {children}
  </div>
);

// Skeleton for person card (actor/director)
export const SkeletonPersonCard = () => (
  <div className="skeleton-movie-card" style={{ textAlign: 'center' }} role="status" aria-label="Loading person...">
    <div 
      className="skeleton" 
      style={{ 
        width: '150px', 
        height: '150px', 
        borderRadius: '50%',
        margin: '0 auto 1rem'
      }} 
    />
    <div className="skeleton-movie-title" style={{ margin: '0 auto' }} />
  </div>
);

// Skeleton grid for people
export const SkeletonPeopleGrid = ({ count = 8 }) => (
  <div className="skeleton-grid" role="status" aria-label="Loading people...">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonPersonCard key={index} />
    ))}
  </div>
);

export default {
  SkeletonText,
  SkeletonTitle,
  SkeletonMovieCard,
  SkeletonMovieGrid,
  SkeletonCard,
  SkeletonPersonCard,
  SkeletonPeopleGrid,
};

