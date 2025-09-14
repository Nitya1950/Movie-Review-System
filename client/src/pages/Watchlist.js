import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { fetchWatchlist, removeFromWatchlist } from '../store/slices/userSlice';
import MovieCard from '../components/movies/MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WatchlistContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  padding: 2rem 0;
`;

const WatchlistContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #888;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const BrowseButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }
`;

const WatchlistItem = styled.div`
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  color: #ff6b6b;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: #ff6b6b;
    color: white;
    transform: scale(1.1);
  }
`;

const Watchlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { watchlist, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchWatchlist(user._id));
    }
  }, [dispatch, user]);

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await dispatch(removeFromWatchlist(movieId)).unwrap();
      // Success feedback handled by the slice
    } catch (error) {
      // Error feedback handled by the slice
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your watchlist..." />;
  }

  return (
    <WatchlistContainer>
      <WatchlistContent>
        <Header>
          <Title>My Watchlist</Title>
          <Subtitle>
            Keep track of movies you want to watch. Add movies to your watchlist
            and easily access them here.
          </Subtitle>
        </Header>

        {watchlist.length === 0 ? (
          <EmptyState>
            <EmptyTitle>Your Watchlist is Empty</EmptyTitle>
            <EmptyText>
              Start building your watchlist by browsing movies and adding
              the ones you want to watch later.
            </EmptyText>
            <BrowseButton to="/movies">
              Browse Movies
            </BrowseButton>
          </EmptyState>
        ) : (
          <MoviesGrid>
            {watchlist.map((item, index) => (
              <motion.div
                key={item.movie._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <WatchlistItem>
                  <RemoveButton
                    onClick={() => handleRemoveFromWatchlist(item.movie._id)}
                    title="Remove from watchlist"
                  >
                    ×
                  </RemoveButton>
                  <MovieCard movie={item.movie} />
                </WatchlistItem>
              </motion.div>
            ))}
          </MoviesGrid>
        )}
      </WatchlistContent>
    </WatchlistContainer>
  );
};

export default Watchlist;
