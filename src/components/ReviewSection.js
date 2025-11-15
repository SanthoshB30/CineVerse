import React, { useEffect, useState } from 'react';
import { getReviewsByMovie, formatDate } from '../api/contentstack';
import { mergeVotesWithReviews } from '../api/reviewVoting';
import ReviewVoteButtons from './ReviewVoteButtons';

const ReviewSection = ({ movieUid }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [movieUid, refreshKey]);

  // Listen for data refresh events
  useEffect(() => {
    const handleDataRefresh = () => {
      console.log('🔄 Data refreshed, reloading reviews...');
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('dataRefreshed', handleDataRefresh);
    return () => window.removeEventListener('dataRefreshed', handleDataRefresh);
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const reviewsData = await getReviewsByMovie(movieUid);
    // Merge with cached vote counts from localStorage
    const reviewsWithVotes = mergeVotesWithReviews(reviewsData);
    setReviews(reviewsWithVotes);
    setLoading(false);
  };

  /**
   * Handle vote update from child component
   */
  const handleVoteUpdate = (reviewUid, newUpvotes, newDownvotes) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.uid === reviewUid
          ? { ...review, upvotes: newUpvotes, downvotes: newDownvotes }
          : review
      )
    );
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
                    <span className="review-date">{formatDate(review.review_date)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="review-text">{review.review_text}</p>
              
              {/* Interactive vote buttons */}
              <ReviewVoteButtons 
                review={review} 
                onVoteUpdate={handleVoteUpdate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;

