const express = require('express');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const { validateMovie, validateMovieQuery, validateObjectId } = require('../middleware/validation');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies with pagination and filtering
// @access  Public
router.get('/', validateMovieQuery, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      genre,
      year,
      minRating,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (genre) {
      filter.genre = genre;
    }

    if (year) {
      filter.releaseYear = parseInt(year);
    }

    if (minRating) {
      filter.averageRating = { $gte: parseFloat(minRating) };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const movies = await Movie.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Movie.countDocuments(filter);

    res.json({
      movies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalMovies: total,
        hasNext: skip + movies.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error while fetching movies' });
  }
});

// @route   GET /api/movies/featured
// @desc    Get featured movies (highest rated, recent)
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    // First try to get highly rated movies (4.0+ stars)
    let featuredMovies = await Movie.find({ averageRating: { $gte: 4.0 } })
      .sort({ averageRating: -1, releaseYear: -1 })
      .limit(6)
      .select('title posterUrl averageRating releaseYear genre');

    // If not enough highly rated movies, include movies with 3.5+ stars
    if (featuredMovies.length < 6) {
      const additionalMovies = await Movie.find({ 
        averageRating: { $gte: 3.5, $lt: 4.0 },
        _id: { $nin: featuredMovies.map(m => m._id) }
      })
        .sort({ averageRating: -1, releaseYear: -1 })
        .limit(6 - featuredMovies.length)
        .select('title posterUrl averageRating releaseYear genre');
      
      featuredMovies = [...featuredMovies, ...additionalMovies];
    }

    // If still not enough, include any rated movies
    if (featuredMovies.length < 6) {
      const moreMovies = await Movie.find({ 
        averageRating: { $gt: 0 },
        _id: { $nin: featuredMovies.map(m => m._id) }
      })
        .sort({ averageRating: -1, totalRatings: -1 })
        .limit(6 - featuredMovies.length)
        .select('title posterUrl averageRating releaseYear genre');
      
      featuredMovies = [...featuredMovies, ...moreMovies];
    }

    // If still not enough movies, get the most recent movies
    if (featuredMovies.length < 6) {
      const recentMovies = await Movie.find({
        _id: { $nin: featuredMovies.map(m => m._id) }
      })
        .sort({ createdAt: -1 })
        .limit(6 - featuredMovies.length)
        .select('title posterUrl averageRating releaseYear genre');
      
      featuredMovies = [...featuredMovies, ...recentMovies];
    }

    res.json({ movies: featuredMovies });
  } catch (error) {
    console.error('Get featured movies error:', error);
    res.status(500).json({ message: 'Server error while fetching featured movies' });
  }
});

// @route   GET /api/movies/trending
// @desc    Get trending movies (most reviewed recently)
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // First try to get movies with recent reviews
    let trendingMovies = await Movie.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'movie',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          recentReviews: {
            $filter: {
              input: '$reviews',
              cond: { $gte: ['$$this.createdAt', thirtyDaysAgo] }
            }
          }
        }
      },
      {
        $addFields: {
          recentReviewCount: { $size: '$recentReviews' }
        }
      },
      {
        $match: {
          recentReviewCount: { $gt: 0 }
        }
      },
      {
        $sort: { recentReviewCount: -1, averageRating: -1 }
      },
      {
        $limit: 6
      },
      {
        $project: {
          title: 1,
          posterUrl: 1,
          averageRating: 1,
          releaseYear: 1,
          genre: 1,
          recentReviewCount: 1
        }
      }
    ]);

    // If no movies with recent reviews, fallback to highest rated movies
    if (trendingMovies.length === 0) {
      console.log('No movies with recent reviews found, falling back to highest rated movies');
      trendingMovies = await Movie.find({ averageRating: { $gt: 0 } })
        .sort({ averageRating: -1, totalRatings: -1 })
        .limit(6)
        .select('title posterUrl averageRating releaseYear genre totalRatings');
      
      // Add recentReviewCount field for consistency
      trendingMovies = trendingMovies.map(movie => ({
        ...movie.toObject(),
        recentReviewCount: movie.totalRatings || 0
      }));
    }

    // If still no movies, get the most recent movies
    if (trendingMovies.length === 0) {
      console.log('No rated movies found, falling back to recent movies');
      trendingMovies = await Movie.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select('title posterUrl averageRating releaseYear genre');
      
      trendingMovies = trendingMovies.map(movie => ({
        ...movie.toObject(),
        recentReviewCount: 0
      }));
    }

    res.json({ movies: trendingMovies });
  } catch (error) {
    console.error('Get trending movies error:', error);
    res.status(500).json({ message: 'Server error while fetching trending movies' });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie by ID
// @access  Public
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ movie });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error while fetching movie' });
  }
});

// @route   POST /api/movies
// @desc    Create a new movie
// @access  Private (Admin only)
router.post('/', auth, adminAuth, validateMovie, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json({
      message: 'Movie created successfully',
      movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Movie with this TMDB ID already exists' });
    }
    res.status(500).json({ message: 'Server error while creating movie' });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update a movie
// @access  Private (Admin only)
router.put('/:id', auth, adminAuth, validateObjectId('id'), validateMovie, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ message: 'Server error while updating movie' });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete a movie
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, validateObjectId('id'), async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Also delete all reviews for this movie
    await Review.deleteMany({ movie: req.params.id });

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ message: 'Server error while deleting movie' });
  }
});

module.exports = router;
