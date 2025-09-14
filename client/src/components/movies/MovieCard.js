import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import StarRating from '../common/StarRating';

const CardContainer = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const PosterOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.8) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Year = styled.span`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const Genre = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const GenreTag = styled.span`
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
`;

const Rating = styled.span`
  color: #ffa726;
  font-weight: 600;
  font-size: 0.9rem;
`;

const RatingCount = styled.span`
  color: #888;
  font-size: 0.8rem;
`;

const MovieCard = ({ movie }) => {
  const handleCardHover = (e) => {
    const overlay = e.currentTarget.querySelector('[data-overlay]');
    const poster = e.currentTarget.querySelector('[data-poster]');
    if (overlay) overlay.style.opacity = '1';
    if (poster) poster.style.transform = 'scale(1.05)';
  };

  const handleCardLeave = (e) => {
    const overlay = e.currentTarget.querySelector('[data-overlay]');
    const poster = e.currentTarget.querySelector('[data-poster]');
    if (overlay) overlay.style.opacity = '0';
    if (poster) poster.style.transform = 'scale(1)';
  };

  return (
    <CardContainer
      whileHover={{ scale: 1.02 }}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
    >
      <Link to={`/movies/${movie._id}`}>
        <PosterContainer>
          <Poster
            data-poster
            src={movie.posterUrl || '/api/placeholder/300/400'}
            alt={movie.title}
            onError={(e) => {
              e.target.src = '/api/placeholder/300/400';
            }}
          />
          <PosterOverlay data-overlay>
            <div>
              <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>
                {movie.title}
              </h4>
              <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                {movie.releaseYear} • {movie.genre?.slice(0, 2).join(', ')}
              </p>
            </div>
          </PosterOverlay>
        </PosterContainer>
      </Link>

      <CardContent>
        <Link to={`/movies/${movie._id}`}>
          <Title>{movie.title}</Title>
        </Link>
        
        <Year>{movie.releaseYear}</Year>
        
        {movie.genre && movie.genre.length > 0 && (
          <Genre>
            {movie.genre.slice(0, 3).map((genre, index) => (
              <GenreTag key={index}>{genre}</GenreTag>
            ))}
            {movie.genre.length > 3 && (
              <GenreTag>+{movie.genre.length - 3}</GenreTag>
            )}
          </Genre>
        )}

        <RatingContainer>
          <StarRating rating={movie.averageRating} size={16} />
          <Rating>{movie.averageRating.toFixed(1)}</Rating>
          <RatingCount>({movie.totalRatings || 0})</RatingCount>
        </RatingContainer>
      </CardContent>
    </CardContainer>
  );
};

export default MovieCard;
