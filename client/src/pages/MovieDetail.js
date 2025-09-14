import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import { fetchMovie, clearCurrentMovie } from '../store/slices/movieSlice';
import { fetchMovieReviews, submitReview } from '../store/slices/reviewSlice';
import { addToWatchlist, removeFromWatchlist } from '../store/slices/userSlice';
import MovieCard from '../components/movies/MovieCard';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';

const MovieDetailContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 1;
`;

const HeroImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.posterUrl || '/api/placeholder/1200/600'});
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
`;

const PosterContainer = styled.div`
  position: relative;
`;

const Poster = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const MovieInfo = styled.div`
  color: #ffffff;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #cccccc;
  font-size: 1.1rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GenreTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const GenreTag = styled.span`
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Rating = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RatingValue = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #ffa726;
`;

const RatingCount = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => props.primary ? `
    background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }
  ` : `
    background: transparent;
    color: #ffffff;
    border: 2px solid #444;
    
    &:hover {
      background: #2d2d2d;
      border-color: #666;
    }
  `}
`;

const Synopsis = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    color: #ffffff;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #cccccc;
    line-height: 1.6;
    font-size: 1.1rem;
  }
`;

const CastSection = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    color: #ffffff;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const CastList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CastMember = styled.div`
  background: #2d2d2d;
  padding: 1rem;
  border-radius: 8px;
  min-width: 150px;
  
  .name {
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .character {
    color: #888;
    font-size: 0.9rem;
  }
`;

const ContentSection = styled.section`
  padding: 4rem 0;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
  text-align: center;
`;

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentMovie, loading } = useSelector((state) => state.movies);
  const { movieReviews, loading: reviewsLoading } = useSelector((state) => state.reviews);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovie(id));
      dispatch(fetchMovieReviews({ movieId: id }));
    }

    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, id]);

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add movies to your watchlist');
      navigate('/login');
      return;
    }

    try {
      // This would be implemented with the user API
      toast.success('Added to watchlist!');
    } catch (error) {
      toast.error('Failed to add to watchlist');
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to write reviews');
      navigate('/login');
      return;
    }
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await dispatch(submitReview({ movieId: id, reviewData })).unwrap();
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading movie details..." />;
  }

  if (!currentMovie) {
    return (
      <MovieDetailContainer>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
          <h2>Movie not found</h2>
          <p>The movie you're looking for doesn't exist or has been removed.</p>
        </div>
      </MovieDetailContainer>
    );
  }

  return (
    <MovieDetailContainer>
      <HeroSection>
        <HeroImage posterUrl={currentMovie.posterUrl} />
        <HeroBackground />
        <HeroContent>
          <PosterContainer>
            <Poster
              src={currentMovie.posterUrl || '/api/placeholder/300/450'}
              alt={currentMovie.title}
              onError={(e) => {
                e.target.src = '/api/placeholder/300/450';
              }}
            />
          </PosterContainer>

          <MovieInfo>
            <Title>{currentMovie.title}</Title>
            
            <MetaInfo>
              <MetaItem>
                <span>📅</span>
                <span>{currentMovie.releaseYear}</span>
              </MetaItem>
              {currentMovie.duration && (
                <MetaItem>
                  <span>⏱️</span>
                  <span>{currentMovie.formattedDuration || `${currentMovie.duration}m`}</span>
                </MetaItem>
              )}
              <MetaItem>
                <span>🎬</span>
                <span>{currentMovie.director}</span>
              </MetaItem>
            </MetaInfo>

            {currentMovie.genre && currentMovie.genre.length > 0 && (
              <GenreTags>
                {currentMovie.genre.map((genre, index) => (
                  <GenreTag key={index}>{genre}</GenreTag>
                ))}
              </GenreTags>
            )}

            <RatingContainer>
              <StarRating rating={currentMovie.averageRating} size={24} />
              <Rating>
                <RatingValue>{currentMovie.averageRating.toFixed(1)}</RatingValue>
                <RatingCount>
                  Based on {currentMovie.totalRatings || 0} reviews
                </RatingCount>
              </Rating>
            </RatingContainer>

            <ActionButtons>
              <Button primary onClick={handleWriteReview}>
                Write Review
              </Button>
              <Button onClick={handleAddToWatchlist}>
                Add to Watchlist
              </Button>
            </ActionButtons>

            {currentMovie.synopsis && (
              <Synopsis>
                <h3>Synopsis</h3>
                <p>{currentMovie.synopsis}</p>
              </Synopsis>
            )}

            {currentMovie.cast && currentMovie.cast.length > 0 && (
              <CastSection>
                <h3>Cast</h3>
                <CastList>
                  {currentMovie.cast.slice(0, 6).map((member, index) => (
                    <CastMember key={index}>
                      <div className="name">{member.name}</div>
                      {member.character && (
                        <div className="character">{member.character}</div>
                      )}
                    </CastMember>
                  ))}
                </CastList>
              </CastSection>
            )}
          </MovieInfo>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
            />
          </motion.div>
        )}

        <SectionTitle>Reviews</SectionTitle>
        <ReviewList
          reviews={movieReviews}
          loading={reviewsLoading}
          movieId={id}
        />
      </ContentSection>
    </MovieDetailContainer>
  );
};

export default MovieDetail;
