import api from './api';

const reviewAPI = {
  getMovieReviews: async (movieId, params = {}) => {
    const response = await api.get(`/movies/${movieId}/reviews`, { params });
    return response.data;
  },

  getUserReviews: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/reviews`, { params });
    return response.data;
  },

  submitReview: async (movieId, reviewData) => {
    const response = await api.post(`/movies/${movieId}/reviews`, reviewData);
    return response.data;
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  markHelpful: async (reviewId, isHelpful) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`, { isHelpful });
    return response.data;
  },
};

export default reviewAPI;
