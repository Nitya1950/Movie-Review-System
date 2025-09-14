import api from './api';

const userAPI = {
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  getWatchlist: async (userId) => {
    const response = await api.get(`/users/${userId}/watchlist`);
    return response.data;
  },

  addToWatchlist: async (userId, movieId) => {
    const response = await api.post(`/users/${userId}/watchlist`, { movieId });
    return response.data;
  },

  removeFromWatchlist: async (userId, movieId) => {
    const response = await api.delete(`/users/${userId}/watchlist/${movieId}`);
    return response.data;
  },
};

export default userAPI;
