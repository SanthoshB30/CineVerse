/**
 * Review Voting API
 * 
 * Handles vote updates to Contentstack.
 * In production, this should go through a backend API for security.
 * For development/demo, we'll update optimistically in the local cache.
 */

/**
 * Update review vote counts
 * 
 * NOTE: This is a simplified implementation that updates the local cache only.
 * 
 * For production with Contentstack Management API:
 * 1. Set up a backend API endpoint
 * 2. Use Management API token (keep secret!)
 * 3. Call: await fetch('/api/reviews/:uid/vote', { method: 'POST', body: { upvotes, downvotes } })
 * 4. Backend updates Contentstack entry
 * 5. Return updated values
 * 
 * @param {string} reviewUid - Review entry UID
 * @param {number} upvotes - New upvote count
 * @param {number} downvotes - New downvote count
 * @returns {Promise<Object>} Updated vote counts
 */
export const updateReviewVotes = async (reviewUid, upvotes, downvotes) => {
  try {
    console.log(`📊 Updating votes for review ${reviewUid}:`, { upvotes, downvotes });

    // In a real implementation, this would call your backend API:
    // const response = await fetch(`/api/reviews/${reviewUid}/vote`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ upvotes, downvotes })
    // });
    // 
    // if (!response.ok) throw new Error('Failed to update votes');
    // return await response.json();

    // For now, we simulate the API call with a delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Store votes in localStorage to persist across page reloads
    // This simulates what would happen if we updated Contentstack
    const voteCacheKey = 'cineverse_review_vote_counts';
    const voteCache = JSON.parse(localStorage.getItem(voteCacheKey) || '{}');
    
    voteCache[reviewUid] = { upvotes, downvotes, updatedAt: new Date().toISOString() };
    localStorage.setItem(voteCacheKey, JSON.stringify(voteCache));

    console.log('✅ Votes updated successfully');

    return { 
      success: true, 
      upvotes, 
      downvotes,
      message: 'Vote recorded successfully'
    };
  } catch (error) {
    console.error('❌ Error updating votes:', error);
    throw new Error('Failed to update votes. Please try again.');
  }
};

/**
 * Get cached vote counts for a review
 * This merges cached votes with original data from Contentstack
 * 
 * @param {string} reviewUid - Review entry UID
 * @returns {Object|null} Cached vote counts or null
 */
export const getCachedVotes = (reviewUid) => {
  try {
    const voteCacheKey = 'cineverse_review_vote_counts';
    const voteCache = JSON.parse(localStorage.getItem(voteCacheKey) || '{}');
    
    return voteCache[reviewUid] || null;
  } catch (error) {
    console.error('Error reading cached votes:', error);
    return null;
  }
};

/**
 * Merge cached votes with review data
 * This ensures we show the most up-to-date vote counts
 * 
 * @param {Array} reviews - Array of review objects
 * @returns {Array} Reviews with merged vote counts
 */
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

/**
 * Clear all cached votes (useful for testing)
 */
export const clearVoteCache = () => {
  localStorage.removeItem('cineverse_review_vote_counts');
  console.log('Vote cache cleared');
};

export default {
  updateReviewVotes,
  getCachedVotes,
  mergeVotesWithReviews,
  clearVoteCache
};

