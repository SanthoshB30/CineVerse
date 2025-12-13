import React, { useState } from 'react';
import useReviewVoting from '../hooks/useReviewVoting';
import { updateReviewVotes } from '../api/reviewVoting';
import logger from '../utils/logger';

/**
 * ReviewVoteButtons Component
 * 
 * Interactive upvote/downvote buttons for reviews
 */
const ReviewVoteButtons = ({ review, onVoteUpdate }) => {
  const { hasVoted, isVoting, handleUpvote, handleDownvote } = useReviewVoting(review.uid);
  const [localUpvotes, setLocalUpvotes] = useState(review.upvotes || 0);
  const [localDownvotes, setLocalDownvotes] = useState(review.downvotes || 0);
  const [error, setError] = useState('');

  /**
   * Handle upvote click
   */
  const onUpvoteClick = async () => {
    setError('');
    
    try {
      const result = await handleUpvote(
        localUpvotes,
        localDownvotes,
        async (newUpvotes, newDownvotes) => {
          // Update API/localStorage
          await updateReviewVotes(review.uid, newUpvotes, newDownvotes);
          
          // Update local state
          setLocalUpvotes(newUpvotes);
          setLocalDownvotes(newDownvotes);
          
          // Notify parent component
          if (onVoteUpdate) {
            onVoteUpdate(review.uid, newUpvotes, newDownvotes);
          }
        }
      );
    } catch (err) {
      setError('Failed to record vote');
      logger.error('Upvote failed:', err.message);
    }
  };

  /**
   * Handle downvote click
   */
  const onDownvoteClick = async () => {
    setError('');
    
    try {
      const result = await handleDownvote(
        localUpvotes,
        localDownvotes,
        async (newUpvotes, newDownvotes) => {
          // Update API/localStorage
          await updateReviewVotes(review.uid, newUpvotes, newDownvotes);
          
          // Update local state
          setLocalUpvotes(newUpvotes);
          setLocalDownvotes(newDownvotes);
          
          // Notify parent component
          if (onVoteUpdate) {
            onVoteUpdate(review.uid, newUpvotes, newDownvotes);
          }
        }
      );
    } catch (err) {
      setError('Failed to record vote');
      logger.error('Downvote failed:', err.message);
    }
  };

  const totalVotes = localUpvotes + localDownvotes;

  return (
    <div className="review-votes">
      <button
        className={`vote-button upvote-button ${hasVoted === 'upvote' ? 'voted' : ''}`}
        onClick={onUpvoteClick}
        disabled={isVoting}
        title={hasVoted === 'upvote' ? 'Remove upvote' : 'Mark as helpful'}
      >
        <span className="vote-icon">👍</span>
        <span className="vote-count">{localUpvotes}</span>
        {hasVoted === 'upvote' && <span className="voted-indicator">✓</span>}
      </button>

      <button
        className={`vote-button downvote-button ${hasVoted === 'downvote' ? 'voted' : ''}`}
        onClick={onDownvoteClick}
        disabled={isVoting}
        title={hasVoted === 'downvote' ? 'Remove downvote' : 'Mark as not helpful'}
      >
        <span className="vote-icon">👎</span>
        <span className="vote-count">{localDownvotes}</span>
        {hasVoted === 'downvote' && <span className="voted-indicator">✓</span>}
      </button>

      {totalVotes > 0 && (
        <span className="vote-stats">
          ({totalVotes} {totalVotes === 1 ? 'vote' : 'votes'})
        </span>
      )}

      {error && (
        <span className="vote-error">{error}</span>
      )}
    </div>
  );
};

export default ReviewVoteButtons;

