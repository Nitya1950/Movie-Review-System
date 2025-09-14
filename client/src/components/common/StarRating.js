import React from 'react';
import styled from 'styled-components';

const StarContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`;

const Star = styled.span`
  color: ${props => props.filled ? '#ffa726' : '#333'};
  font-size: ${props => props.size || 16}px;
  transition: color 0.2s ease;
  cursor: ${props => props.interactive ? 'pointer' : 'default'};
  
  ${props => props.interactive && `
    &:hover {
      color: #ffa726;
    }
  `}
`;

const StarRating = ({ 
  rating = 0, 
  size = 16, 
  maxRating = 5, 
  showValue = false, 
  interactive = false,
  onRatingChange 
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const handleStarClick = (starIndex) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  for (let i = 0; i < maxRating; i++) {
    if (i < fullStars) {
      stars.push(
        <Star 
          key={i} 
          filled 
          size={size}
          interactive={interactive}
          onClick={() => handleStarClick(i)}
        >
          ★
        </Star>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Star 
          key={i} 
          filled 
          size={size}
          interactive={interactive}
          onClick={() => handleStarClick(i)}
        >
          ☆
        </Star>
      );
    } else {
      stars.push(
        <Star 
          key={i} 
          filled={false} 
          size={size}
          interactive={interactive}
          onClick={() => handleStarClick(i)}
        >
          ☆
        </Star>
      );
    }
  }

  return (
    <StarContainer>
      {stars}
      {showValue && (
        <span style={{ marginLeft: '4px', fontSize: `${size - 2}px`, color: '#888' }}>
          ({rating.toFixed(1)})
        </span>
      )}
    </StarContainer>
  );
};

export default StarRating;
