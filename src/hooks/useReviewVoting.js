import { useState, useEffect } from 'react';
import logger from '../utils/logger';

/**
 * Custom Hook for Review Voting
 * 
 * Manages vote state, prevents double voting, and handles vote persistence
 */
const useReviewVoting = (reviewUid) => {
  const [hasVoted, setHasVoted] = useState(null); // 'upvote', 'downvote', or null
  const [isVoting, setIsVoting] = useState(false);

  // Load voting state from localStorage on mount
  useEffect(() => {
    const votesKey = 'cineverse_review_votes';
    const votes = JSON.parse(localStorage.getItem(votesKey) || '{}');
    
    if (votes[reviewUid]) {
      setHasVoted(votes[reviewUid]);
    }
  }, [reviewUid]);

  /**
   * Record a vote in localStorage
   */
  const recordVote = (voteType) => {
    const votesKey = 'cineverse_review_votes';
    const votes = JSON.parse(localStorage.getItem(votesKey) || '{}');
    
    votes[reviewUid] = voteType;
    localStorage.setItem(votesKey, JSON.stringify(votes));
    setHasVoted(voteType);
  };

  /**
   * Remove a vote from localStorage
   */
  const removeVote = () => {
    const votesKey = 'cineverse_review_votes';
    const votes = JSON.parse(localStorage.getItem(votesKey) || '{}');
    
    delete votes[reviewUid];
    localStorage.setItem(votesKey, JSON.stringify(votes));
    setHasVoted(null);
  };

  /**
   * Handle upvote
   */
  const handleUpvote = async (currentUpvotes, currentDownvotes, onSuccess) => {
    setIsVoting(true);

    try {
      let newUpvotes = currentUpvotes;
      let newDownvotes = currentDownvotes;

      if (hasVoted === 'upvote') {
        // Already upvoted - remove upvote
        newUpvotes = Math.max(0, currentUpvotes - 1);
        removeVote();
      } else if (hasVoted === 'downvote') {
        // Previously downvoted - switch to upvote
        newDownvotes = Math.max(0, currentDownvotes - 1);
        newUpvotes = currentUpvotes + 1;
        recordVote('upvote');
      } else {
        // No previous vote - add upvote
        newUpvotes = currentUpvotes + 1;
        recordVote('upvote');
      }

      // Call success callback with new values
      if (onSuccess) {
        await onSuccess(newUpvotes, newDownvotes);
      }

      return { upvotes: newUpvotes, downvotes: newDownvotes };
    } catch (error) {
      logger.error('Upvote handling failed:', error.message);
      throw error;
    } finally {
      setIsVoting(false);
    }
  };

  /**
   * Handle downvote
   */
  const handleDownvote = async (currentUpvotes, currentDownvotes, onSuccess) => {
    setIsVoting(true);

    try {
      let newUpvotes = currentUpvotes;
      let newDownvotes = currentDownvotes;

      if (hasVoted === 'downvote') {
        // Already downvoted - remove downvote
        newDownvotes = Math.max(0, currentDownvotes - 1);
        removeVote();
      } else if (hasVoted === 'upvote') {
        // Previously upvoted - switch to downvote
        newUpvotes = Math.max(0, currentUpvotes - 1);
        newDownvotes = currentDownvotes + 1;
        recordVote('downvote');
      } else {
        // No previous vote - add downvote
        newDownvotes = currentDownvotes + 1;
        recordVote('downvote');
      }

      // Call success callback with new values
      if (onSuccess) {
        await onSuccess(newUpvotes, newDownvotes);
      }

      return { upvotes: newUpvotes, downvotes: newDownvotes };
    } catch (error) {
      logger.error('Downvote handling failed:', error.message);
      throw error;
    } finally {
      setIsVoting(false);
    }
  };

  return {
    hasVoted,
    isVoting,
    handleUpvote,
    handleDownvote
  };
};

export default useReviewVoting;

