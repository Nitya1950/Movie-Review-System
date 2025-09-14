import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: #2d2d2d;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.75rem;
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

const Select = styled.select`
  background: #2d2d2d;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
  }

  option {
    background: #2d2d2d;
    color: #ffffff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
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
    color: #888;
    border: 1px solid #444;
    
    &:hover {
      background: #2d2d2d;
      color: #ffffff;
      border-color: #666;
    }
  `}
`;

const SearchFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value, page: 1 };
    setLocalFilters(newFilters);
  };

  const handleSearch = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({
      search: '',
      genre: '',
      year: '',
      minRating: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
    });
    onClearFilters();
  };

  const genres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
    'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller',
    'War', 'Western'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FiltersContainer>
        <FilterGroup>
          <Label htmlFor="search">Search Movies</Label>
          <Input
            id="search"
            type="text"
            placeholder="Enter movie title, director..."
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </FilterGroup>

        <FilterGroup>
          <Label htmlFor="genre">Genre</Label>
          <Select
            id="genre"
            value={localFilters.genre}
            onChange={(e) => handleInputChange('genre', e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label htmlFor="year">Release Year</Label>
          <Select
            id="year"
            value={localFilters.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label htmlFor="minRating">Minimum Rating</Label>
          <Select
            id="minRating"
            value={localFilters.minRating}
            onChange={(e) => handleInputChange('minRating', e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label htmlFor="sortBy">Sort By</Label>
          <Select
            id="sortBy"
            value={localFilters.sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
          >
            <option value="createdAt">Recently Added</option>
            <option value="title">Title A-Z</option>
            <option value="releaseYear">Release Year</option>
            <option value="averageRating">Rating</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label htmlFor="sortOrder">Order</Label>
          <Select
            id="sortOrder"
            value={localFilters.sortOrder}
            onChange={(e) => handleInputChange('sortOrder', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </Select>
        </FilterGroup>
      </FiltersContainer>

      <ButtonGroup>
        <Button primary onClick={handleSearch}>
          Search Movies
        </Button>
        <Button onClick={handleClear}>
          Clear Filters
        </Button>
      </ButtonGroup>
    </motion.div>
  );
};

export default SearchFilters;
