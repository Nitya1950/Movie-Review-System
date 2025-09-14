import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import StarRating from '../common/StarRating';

const FormContainer = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid #333;
`;

const FormTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
`;

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const RatingLabel = styled.span`
  color: #cccccc;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  background: #2d2d2d;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
  }

  &::placeholder {
    color: #888;
  }

  &.error {
    border-color: #ff6b6b;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #ff6b6b;
`;

const CheckboxLabel = styled.label`
  color: #cccccc;
  font-size: 0.9rem;
  cursor: pointer;
`;

const ErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
    
    &:hover:not(:disabled) {
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ReviewForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [rating, setRating] = useState(initialData.rating || 0);
  const [isSpoiler, setIsSpoiler] = useState(initialData.isSpoiler || false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      reviewText: initialData.reviewText || '',
      isSpoiler: initialData.isSpoiler || false,
    },
  });

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setValue('rating', newRating);
  };

  const handleFormSubmit = (data) => {
    if (rating === 0) {
      return;
    }
    onSubmit({
      ...data,
      rating,
      isSpoiler,
    });
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormTitle>Write a Review</FormTitle>
      
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup>
          <Label>Rating *</Label>
          <StarRatingContainer>
            <StarRating
              rating={rating}
              onRatingChange={handleRatingChange}
              size={24}
              interactive
            />
            <RatingLabel>
              {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
            </RatingLabel>
          </StarRatingContainer>
          {rating === 0 && (
            <ErrorMessage>Please select a rating</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="reviewText">Your Review *</Label>
          <TextArea
            id="reviewText"
            placeholder="Share your thoughts about this movie..."
            {...register('reviewText', {
              required: 'Review text is required',
              minLength: {
                value: 10,
                message: 'Review must be at least 10 characters long',
              },
              maxLength: {
                value: 2000,
                message: 'Review cannot exceed 2000 characters',
              },
            })}
            className={errors.reviewText ? 'error' : ''}
          />
          {errors.reviewText && (
            <ErrorMessage>{errors.reviewText.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="isSpoiler"
              checked={isSpoiler}
              onChange={(e) => setIsSpoiler(e.target.checked)}
            />
            <CheckboxLabel htmlFor="isSpoiler">
              This review contains spoilers
            </CheckboxLabel>
          </CheckboxContainer>
        </FormGroup>

        <ButtonGroup>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" primary disabled={rating === 0}>
            Submit Review
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default ReviewForm;
