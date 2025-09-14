import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';


import { fetchMovies, setFilters, clearFilters } from '../store/slices/movieSlice';
import MovieCard from '../components/movies/MovieCard';
import SearchFilters from '../components/movies/SearchFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const MoviesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  padding: 2rem 0;
`;

const MoviesContent = styled.div`
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

const FiltersSection = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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

const ClearFiltersButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #ff5252;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: #888;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, pagination, filters, loading, error } = useSelector((state) => state.movies);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const debouncedFetchMovies = React.useMemo(
    () => debounce((filters) => dispatch(fetchMovies(filters)), 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetchMovies(filters);
    setIsInitialLoad(false);

    return () => debouncedFetchMovies.cancel(); // cancel pending API calls
}, [filters, debouncedFetchMovies]);


  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ ...filters, page }));
  };

  if (loading && isInitialLoad) {
    return <LoadingSpinner text="Loading movies..." />;
  }

  return (
    <MoviesContainer>
      <MoviesContent>
        <Header>
          <Title>Discover Movies</Title>
          <Subtitle>
            Explore our collection of movies, rate your favorites, and discover new films
            based on your preferences.
          </Subtitle>
        </Header>

        <FiltersSection>
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </FiltersSection>

        {error && (
          <EmptyState>
            <EmptyTitle>Error Loading Movies</EmptyTitle>
            <EmptyText>{error}</EmptyText>
            <ClearFiltersButton onClick={() => window.location.reload()}>
              Try Again
            </ClearFiltersButton>
          </EmptyState>
        )}

        {!error && movies.length === 0 && !loading && (
          <EmptyState>
            <EmptyTitle>No Movies Found</EmptyTitle>
            <EmptyText>
              We couldn't find any movies matching your criteria. Try adjusting your filters
              or search terms.
            </EmptyText>
            <ClearFiltersButton onClick={handleClearFilters}>
              Clear Filters
            </ClearFiltersButton>
          </EmptyState>
        )}

        {movies.length > 0 && (
          <>
            <ResultsInfo>
              <div>
                Showing {((pagination.currentPage - 1) * 12) + 1} - {Math.min(pagination.currentPage * 12, pagination.totalMovies)} of {pagination.totalMovies} movies
              </div>
              <div>
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            </ResultsInfo>

            <MoviesGrid>
              {movies.map((movie, index) => (
                <motion.div
                  key={movie._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </MoviesGrid>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {loading && !isInitialLoad && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <LoadingSpinner text="Loading more movies..." />
          </div>
        )}
      </MoviesContent>
    </MoviesContainer>
  );
};

export default Movies;
