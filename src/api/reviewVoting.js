export const updateReviewVotes = async (reviewUid, upvotes, downvotes) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));

    const voteCacheKey = 'cineverse_review_vote_counts';
    const voteCache = JSON.parse(localStorage.getItem(voteCacheKey) || '{}');
    
    voteCache[reviewUid] = { upvotes, downvotes, updatedAt: new Date().toISOString() };
    localStorage.setItem(voteCacheKey, JSON.stringify(voteCache));

    return { 
      success: true, 
      upvotes, 
      downvotes,
      message: 'Vote recorded successfully'
    };
  } catch (error) {
    throw new Error('Failed to update votes. Please try again.');
  }
};

export const getCachedVotes = (reviewUid) => {
  try {
    const voteCacheKey = 'cineverse_review_vote_counts';
    const voteCache = JSON.parse(localStorage.getItem(voteCacheKey) || '{}');
    return voteCache[reviewUid] || null;
  } catch (error) {
    return null;
  }
};

export const mergeVotesWithReviews = (reviews) => {
  return reviews.map(review => {
    const cachedVotes = getCachedVotes(review.uid);
    if (cachedVotes) {
      return {
        ...review,
        upvotes: cachedVotes.upvotes,
        downvotes: cachedVotes.downvotes
      };
    }
    return review;
  });
};

export const clearVoteCache = () => {
  localStorage.removeItem('cineverse_review_vote_counts');
};

export default {
  updateReviewVotes,
  getCachedVotes,
  mergeVotesWithReviews,
  clearVoteCache
};

