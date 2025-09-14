import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled(motion.button)`
  padding: 0.5rem 0.75rem;
  border: 1px solid #444;
  background: ${props => props.active ? '#ff6b6b' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#888'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  min-width: 40px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#ff5252' : '#2d2d2d'};
    color: #ffffff;
    border-color: ${props => props.active ? '#ff5252' : '#666'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  color: #888;
  padding: 0.5rem;
  font-size: 0.9rem;
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ←
      </PageButton>

      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <Ellipsis>...</Ellipsis>
          ) : (
            <PageButton
              active={page === currentPage}
              onClick={() => onPageChange(page)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {page}
            </PageButton>
          )}
        </React.Fragment>
      ))}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        →
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
