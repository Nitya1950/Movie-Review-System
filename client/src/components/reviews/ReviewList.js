import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import StarRating from '../common/StarRating';
import LoadingSpinner from '../common/LoadingSpinner';

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #444;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
`;

const UserDetails = styled.div`
  .username {
    color: #ffffff;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  .date {
    color: #888;
    font-size: 0.9rem;
  }
`;

const ReviewMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Rating = styled.span`
  color: #ffa726;
  font-weight: 600;
  font-size: 1.1rem;
`;

const SpoilerWarning = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  border-radius: 6px;
  padding: 0.5rem;
  color: #ff6b6b;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ReviewText = styled.div`
  color: #cccccc;
  line-height: 1.6;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ReviewActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #333;
`;

const HelpfulActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const HelpfulButton = styled.button`
  background: transparent;
  border: 1px solid #444;
  color: #888;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2d2d2d;
    color: #ffffff;
    border-color: #666;
  }

  &.helpful {
    border-color: #4caf50;
    color: #4caf50;
  }

  &.not-helpful {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }
`;

const HelpfulCount = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #888;
`;

const EmptyTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ReviewList = ({ reviews, loading, movieId }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <LoadingSpinner text="Loading reviews..." />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState>
        <EmptyTitle>No Reviews Yet</EmptyTitle>
        <EmptyText>
          Be the first to share your thoughts about this movie!
        </EmptyText>
      </EmptyState>
    );
  }

  return (
    <ReviewsContainer>
      {reviews.map((review, index) => (
        <ReviewCard
          key={review._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ReviewHeader>
            <UserInfo>
              <UserAvatar>
                {review.user?.username?.charAt(0).toUpperCase() || 'U'}
              </UserAvatar>
              <UserDetails>
                <div className="username">{review.user?.username || 'Anonymous'}</div>
                <div className="date">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </UserDetails>
            </UserInfo>

            <ReviewMeta>
              <RatingContainer>
                <StarRating rating={review.rating} size={16} />
                <Rating>{review.rating.toFixed(1)}</Rating>
              </RatingContainer>
            </ReviewMeta>
          </ReviewHeader>

          {review.isSpoiler && (
            <SpoilerWarning>
              ⚠️ This review contains spoilers
            </SpoilerWarning>
          )}

          <ReviewText>{review.reviewText}</ReviewText>

          <ReviewActions>
            <HelpfulActions>
              <HelpfulButton>
                👍 Helpful ({review.helpfulCount || 0})
              </HelpfulButton>
              <HelpfulButton>
                👎 Not Helpful ({review.notHelpfulCount || 0})
              </HelpfulButton>
            </HelpfulActions>
          </ReviewActions>
        </ReviewCard>
      ))}
    </ReviewsContainer>
  );
};

export default ReviewList;
