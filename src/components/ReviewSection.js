import React, { useEffect, useState } from 'react';
import { getReviewsByMovie, formatDate } from '../api/contentstack';

const ReviewSection = ({ movieUid }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [movieUid]);

  const loadReviews = async () => {
    setLoading(true);
    const reviewsData = await getReviewsByMovie(movieUid);
    setReviews(reviewsData);
    setLoading(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div className="review-section">
      <h2 className="section-title">
        Reviews ({reviews.length})
      </h2>
      
      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.uid} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.reviewer_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="reviewer-name">{review.reviewer_name}</h4>
                    <span className="review-date">{formatDate(review.date)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="review-text">{review.review_text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;

