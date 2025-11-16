import React, { useEffect, useState } from 'react';
import { getReviewsByMovie, formatDate } from '../api/contentstack';
import { mergeVotesWithReviews } from '../api/reviewVoting';
import { createReview, mergeLocalReviews } from '../api/reviewCreation';
import { useAuth } from '../context/AuthContext';
import ReviewVoteButtons from './ReviewVoteButtons';

const ReviewSection = ({ movieUid }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    reviewText: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { selectedProfile, user } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [movieUid, refreshKey]);

  useEffect(() => {
    const handleDataRefresh = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('dataRefreshed', handleDataRefresh);
    return () => window.removeEventListener('dataRefreshed', handleDataRefresh);
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const reviewsData = await getReviewsByMovie(movieUid);
    const allReviews = mergeLocalReviews(reviewsData, movieUid);
    const reviewsWithVotes = mergeVotesWithReviews(allReviews);
    setReviews(reviewsWithVotes);
    setLoading(false);
  };

  const handleVoteUpdate = (reviewUid, newUpvotes, newDownvotes) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.uid === reviewUid
          ? { ...review, upvotes: newUpvotes, downvotes: newDownvotes }
          : review
      )
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    setSubmitting(true);

    try {
      const reviewerName = selectedProfile?.profile_name || user?.username || 'Anonymous';

      if (reviewFormData.reviewText.trim().length < 10) {
        setSubmitError('Review must be at least 10 characters long');
        setSubmitting(false);
        return;
      }

      await createReview({
        movieUid,
        reviewerName,
        rating: reviewFormData.rating,
        reviewText: reviewFormData.reviewText.trim()
      });

      setSubmitSuccess(true);
      setReviewFormData({ rating: 5, reviewText: '' });
      setShowReviewForm(false);
      await loadReviews();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setReviewFormData({ rating: 5, reviewText: '' });
    setSubmitError('');
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
      <div className="review-section-header">
        <h2 className="section-title">
          Reviews ({reviews.length})
        </h2>
        {!showReviewForm && (
          <button 
            className="btn btn-primary add-review-btn"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </button>
        )}
      </div>

      {submitSuccess && (
        <div className="success-message">
          ✅ Review submitted successfully!
        </div>
      )}

      {showReviewForm && (
        <div className="review-form-container">
          <h3 className="review-form-title">Write Your Review</h3>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label htmlFor="rating">Your Rating</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star-button ${star <= reviewFormData.rating ? 'active' : ''}`}
                    onClick={() => setReviewFormData({ ...reviewFormData, rating: star })}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
                <span className="rating-text">
                  {reviewFormData.rating} / 5
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reviewText">Your Review</label>
              <textarea
                id="reviewText"
                className="form-textarea"
                placeholder="Share your thoughts about this movie... (minimum 10 characters)"
                value={reviewFormData.reviewText}
                onChange={(e) => setReviewFormData({ ...reviewFormData, reviewText: e.target.value })}
                rows={5}
                minLength={10}
                maxLength={1000}
                required
              />
              <div className="character-count">
                {reviewFormData.reviewText.length} / 1000 characters
              </div>
            </div>

            {submitError && (
              <div className="error-message">
                ⚠️ {submitError}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelReview}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || reviewFormData.reviewText.trim().length < 10}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}
      
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
                    <h4 className="reviewer-name">
                      {review.reviewer_name}
                      {review.isLocal && (
                        <span className="local-badge" title="Review stored locally">✨</span>
                      )}
                    </h4>
                    <span className="review-date">{formatDate(review.review_date)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="review-text">{review.review_text}</p>
              
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

