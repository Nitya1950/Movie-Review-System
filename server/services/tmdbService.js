const axios = require('axios');
const NodeCache = require('node-cache');

// Cache for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseURL = 'https://api.themoviedb.org/3';
    this.imageBaseURL = 'https://image.tmdb.org/t/p';
  }

  async searchMovies(query, page = 1) {
    try {
      const cacheKey = `search_${query}_${page}`;
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const response = await axios.get(`${this.baseURL}/search/movie`, {
        params: {
          api_key: this.apiKey,
          query,
          page,
          include_adult: false
        }
      });

      const data = this.formatSearchResults(response.data);
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('TMDB search error:', error);
      throw new Error('Failed to search movies from TMDB');
    }
  }

  async getMovieDetails(tmdbId) {
    try {
      const cacheKey = `movie_${tmdbId}`;
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const response = await axios.get(`${this.baseURL}/movie/${tmdbId}`, {
        params: {
          api_key: this.apiKey,
          append_to_response: 'credits,videos'
        }
      });

      const data = this.formatMovieDetails(response.data);
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('TMDB movie details error:', error);
      throw new Error('Failed to fetch movie details from TMDB');
    }
  }

  async getPopularMovies(page = 1) {
    try {
      const cacheKey = `popular_${page}`;
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const response = await axios.get(`${this.baseURL}/movie/popular`, {
        params: {
          api_key: this.apiKey,
          page
        }
      });

      const data = this.formatSearchResults(response.data);
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('TMDB popular movies error:', error);
      throw new Error('Failed to fetch popular movies from TMDB');
    }
  }

  async getTrendingMovies() {
    try {
      const cacheKey = 'trending';
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const response = await axios.get(`${this.baseURL}/trending/movie/week`, {
        params: {
          api_key: this.apiKey
        }
      });

      const data = this.formatSearchResults(response.data);
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('TMDB trending movies error:', error);
      throw new Error('Failed to fetch trending movies from TMDB');
    }
  }

  formatSearchResults(data) {
    return {
      movies: data.results.map(movie => this.formatMovie(movie)),
      pagination: {
        currentPage: data.page,
        totalPages: data.total_pages,
        totalMovies: data.total_results
      }
    };
  }

  formatMovieDetails(data) {
    return {
      ...this.formatMovie(data),
      overview: data.overview,
      runtime: data.runtime,
      budget: data.budget,
      revenue: data.revenue,
      status: data.status,
      tagline: data.tagline,
      credits: {
        cast: data.credits.cast.slice(0, 10).map(actor => ({
          name: actor.name,
          character: actor.character,
          profile_path: actor.profile_path
        })),
        crew: data.credits.crew.filter(person => 
          ['Director', 'Producer', 'Writer'].includes(person.job)
        ).map(person => ({
          name: person.name,
          job: person.job
        }))
      },
      videos: data.videos.results.filter(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      ).map(video => ({
        key: video.key,
        name: video.name,
        type: video.type
      }))
    };
  }

  formatMovie(movie) {
    return {
      tmdbId: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview,
      releaseDate: movie.release_date,
      releaseYear: new Date(movie.release_date).getFullYear(),
      genre: movie.genre_ids ? this.mapGenreIds(movie.genre_ids) : [],
      posterUrl: movie.poster_path ? `${this.imageBaseURL}/w500${movie.poster_path}` : '',
      backdropUrl: movie.backdrop_path ? `${this.imageBaseURL}/w1280${movie.backdrop_path}` : '',
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity,
      adult: movie.adult,
      originalLanguage: movie.original_language
    };
  }

  mapGenreIds(genreIds) {
    const genreMap = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
      53: 'Thriller', 10752: 'War', 37: 'Western'
    };
    return genreIds.map(id => genreMap[id]).filter(Boolean);
  }

  getImageUrl(path, size = 'w500') {
    return path ? `${this.imageBaseURL}/${size}${path}` : '';
  }
}

module.exports = new TMDBService();
