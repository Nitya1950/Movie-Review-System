import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewAPI from '../../services/reviewAPI';

// Async thunks
export const fetchMovieReviews = createAsyncThunk(
  'reviews/fetchMovieReviews',
  async ({ movieId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getMovieReviews(movieId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getUserReviews(userId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user reviews');
    }
  }
);

export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async ({ movieId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.submitReview(movieId, reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.updateReview(reviewId, reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewAPI.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

export const markHelpful = createAsyncThunk(
  'reviews/markHelpful',
  async ({ reviewId, isHelpful }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.markHelpful(reviewId, isHelpful);
      return { reviewId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark helpful');
    }
  }
);

const initialState = {
  movieReviews: [],
  userReviews: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearMovieReviews: (state) => {
      state.movieReviews = [];
    },
    clearUserReviews: (state) => {
      state.userReviews = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movie reviews
      .addCase(fetchMovieReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.movieReviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchMovieReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.movieReviews.unshift(action.payload.review);
        state.error = null;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.movieReviews.findIndex(
          review => review._id === action.payload.review._id
        );
        if (index !== -1) {
          state.movieReviews[index] = action.payload.review;
        }
        state.error = null;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.movieReviews = state.movieReviews.filter(
          review => review._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark helpful
      .addCase(markHelpful.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markHelpful.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.movieReviews.findIndex(
          review => review._id === action.payload.reviewId
        );
        if (index !== -1) {
          state.movieReviews[index].helpfulCount = action.payload.helpfulCount;
          state.movieReviews[index].notHelpfulCount = action.payload.notHelpfulCount;
        }
        state.error = null;
      })
      .addCase(markHelpful.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearMovieReviews,
  clearUserReviews,
  clearError,
} = reviewSlice.actions;

export default reviewSlice.reducer;
