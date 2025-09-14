import api from './api';

const tmdbAPI = {
  searchMovies: async (query, page = 1) => {
    const response = await api.get('/tmdb/search', {
      params: { query, page }
    });
    return response.data;
  },

  getPopularMovies: async (page = 1) => {
    const response = await api.get('/tmdb/popular', {
      params: { page }
    });
    return response.data;
  },

  getTrendingMovies: async () => {
    const response = await api.get('/tmdb/trending');
    return response.data;
  },

  getMovieDetails: async (tmdbId) => {
    const response = await api.get(`/tmdb/movie/${tmdbId}`);
    return response.data;
  },

  importMovie: async (tmdbId) => {
    const response = await api.post('/tmdb/import', { tmdbId });
    return response.data;
  }
};

export default tmdbAPI;
