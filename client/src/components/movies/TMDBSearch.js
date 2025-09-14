import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import tmdbAPI from '../../services/tmdbAPI';
import movieAPI from '../../services/movieAPI';

const SearchContainer = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #333;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: #2d2d2d;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
  }

  &::placeholder {
    color: #888;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 2rem;
`;

const ResultsTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const MovieCard = styled(motion.div)`
  background: #2d2d2d;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const MovieInfo = styled.div`
  padding: 1rem;
`;

const MovieTitle = styled.h4`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MovieYear = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const MovieGenre = styled.p`
  color: #ccc;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const ImportButton = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  background: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #ff6b6b;
    color: white;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TMDBSearch = ({ onMovieImported }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await tmdbAPI.searchMovies(query);
      setResults(data.movies);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (tmdbId) => {
    setImporting(prev => ({ ...prev, [tmdbId]: true }));
    try {
      const data = await tmdbAPI.importMovie(tmdbId);
      alert('Movie imported successfully!');
      onMovieImported && onMovieImported(data.movie);
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import movie');
    } finally {
      setImporting(prev => ({ ...prev, [tmdbId]: false }));
    }
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies on TMDB..."
        />
        <SearchButton type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </SearchButton>
      </SearchForm>

      {results.length > 0 && (
        <ResultsContainer>
          <ResultsTitle>Search Results</ResultsTitle>
          <MovieGrid>
            {results.map((movie) => (
              <MovieCard
                key={movie.tmdbId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {movie.posterUrl && (
                  <MoviePoster 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/200/300';
                    }}
                  />
                )}
                <MovieInfo>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieYear>{movie.releaseYear}</MovieYear>
                  <MovieGenre>{movie.genre.join(', ')}</MovieGenre>
                  <ImportButton
                    onClick={() => handleImport(movie.tmdbId)}
                    disabled={importing[movie.tmdbId]}
                  >
                    {importing[movie.tmdbId] ? 'Importing...' : 'Import Movie'}
                  </ImportButton>
                </MovieInfo>
              </MovieCard>
            ))}
          </MovieGrid>
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

export default TMDBSearch;
