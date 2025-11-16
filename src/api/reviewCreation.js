export const createReview = async (reviewData) => {
  try {
    if (!reviewData.movieUid || !reviewData.reviewerName || !reviewData.rating || !reviewData.reviewText) {
      throw new Error('All fields are required');
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (reviewData.reviewText.trim().length < 10) {
      throw new Error('Review must be at least 10 characters long');
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const newReview = {
      uid: `local_review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      movie_uid: reviewData.movieUid,
      reviewer_name: reviewData.reviewerName,
      rating: reviewData.rating,
      review_text: reviewData.reviewText,
      review_date: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      isLocal: true
    };

    const reviewCacheKey = 'cineverse_local_reviews';
    const reviewCache = JSON.parse(localStorage.getItem(reviewCacheKey) || '[]');
    
    reviewCache.push(newReview);
    localStorage.setItem(reviewCacheKey, JSON.stringify(reviewCache));

    return { 
      success: true, 
      review: newReview,
      message: 'Review submitted successfully!'
    };
  } catch (error) {
    throw error;
  }
};

export const getLocalReviews = (movieUid) => {
  try {
    const reviewCacheKey = 'cineverse_local_reviews';
    const reviewCache = JSON.parse(localStorage.getItem(reviewCacheKey) || '[]');
    return reviewCache.filter(review => review.movie_uid === movieUid);
  } catch (error) {
    return [];
  }
};

export const mergeLocalReviews = (contentstackReviews, movieUid) => {
  const localReviews = getLocalReviews(movieUid);
  const allReviews = [...contentstackReviews, ...localReviews];
  allReviews.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
  return allReviews;
};

export const clearLocalReviews = () => {
  localStorage.removeItem('cineverse_local_reviews');
};

export default {
  createReview,
  getLocalReviews,
  mergeLocalReviews,
  clearLocalReviews
};

