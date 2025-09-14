import api from './api';

// Helper to get JWT from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const movieAPI = {
  getMovies: async (params = {}) => {
    const response = await api.get('/movies', { 
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getMovie: async (movieId) => {
    const response = await api.get(`/movies/${movieId}`, { 
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getFeaturedMovies: async () => {
    const response = await api.get('/movies/featured', { 
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getTrendingMovies: async () => {
    const response = await api.get('/movies/trending', { 
      headers: getAuthHeader(),
    });
    return response.data;
  },

  searchMovies: async (searchParams) => {
    const response = await api.get('/movies', { 
      params: searchParams,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  createMovie: async (movieData) => {
    const response = await api.post('/movies', movieData, { 
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateMovie: async (movieId, movieData) => {
    const response = await api.put(`/movies/${movieId}`, movieData, { 
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteMovie: async (movieId) => {
    const response = await api.delete(`/movies/${movieId}`, { 
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default movieAPI;
