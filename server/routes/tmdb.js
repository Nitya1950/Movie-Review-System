const express = require('express');
const tmdbService = require('../services/tmdbService');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tmdb/search
// @desc    Search movies from TMDB
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = await tmdbService.searchMovies(query, parseInt(page));
    res.json(results);
  } catch (error) {
    console.error('TMDB search error:', error);
    res.status(500).json({ message: 'Failed to search movies' });
  }
});

// @route   GET /api/tmdb/popular
// @desc    Get popular movies from TMDB
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const results = await tmdbService.getPopularMovies(parseInt(page));
    res.json(results);
  } catch (error) {
    console.error('TMDB popular movies error:', error);
    res.status(500).json({ message: 'Failed to fetch popular movies' });
  }
});

// @route   GET /api/tmdb/trending
// @desc    Get trending movies from TMDB
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const results = await tmdbService.getTrendingMovies();
    res.json(results);
  } catch (error) {
    console.error('TMDB trending movies error:', error);
    res.status(500).json({ message: 'Failed to fetch trending movies' });
  }
});

// @route   GET /api/tmdb/movie/:tmdbId
// @desc    Get detailed movie information from TMDB
// @access  Public
router.get('/movie/:tmdbId', async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const movie = await tmdbService.getMovieDetails(parseInt(tmdbId));
    res.json({ movie });
  } catch (error) {
    console.error('TMDB movie details error:', error);
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
});

// @route   POST /api/tmdb/import
// @desc    Import movie from TMDB to local database
// @access  Private (Admin only)
router.post('/import', auth, adminAuth, async (req, res) => {
  try {
    const { tmdbId } = req.body;
    
    if (!tmdbId) {
      return res.status(400).json({ message: 'TMDB ID is required' });
    }

    // Get movie details from TMDB
    const tmdbMovie = await tmdbService.getMovieDetails(tmdbId);
    
    // Check if movie already exists
    const Movie = require('../models/Movie');
    const existingMovie = await Movie.findOne({ tmdbId });
    
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie already exists in database' });
    }

    // Create movie in local database
    const movieData = {
      title: tmdbMovie.title,
      genre: tmdbMovie.genre,
      releaseYear: tmdbMovie.releaseYear,
      director: tmdbMovie.credits.crew.find(person => person.job === 'Director')?.name || 'Unknown',
      cast: tmdbMovie.credits.cast.slice(0, 5).map(actor => ({
        name: actor.name,
        character: actor.character
      })),
      synopsis: tmdbMovie.overview,
      posterUrl: tmdbMovie.posterUrl,
      trailerUrl: tmdbMovie.videos.length > 0 ? 
        `https://www.youtube.com/watch?v=${tmdbMovie.videos[0].key}` : '',
      duration: tmdbMovie.runtime,
      tmdbId: tmdbMovie.tmdbId
    };

    const movie = new Movie(movieData);
    await movie.save();

    res.status(201).json({
      message: 'Movie imported successfully',
      movie
    });
  } catch (error) {
    console.error('TMDB import error:', error);
    res.status(500).json({ message: 'Failed to import movie' });
  }
});

module.exports = router;
