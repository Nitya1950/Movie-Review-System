const express = require('express');
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { validateReview, validateObjectId } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies/:id/reviews
// @desc    Get reviews for a specific movie
// @access  Public
router.get('/movies/:id/reviews', validateObjectId('id'), async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find({ movie: req.params.id })
      .populate('user', 'username profilePicture')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Review.countDocuments({ movie: req.params.id });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReviews: total,
        hasNext: skip + reviews.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get movie reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

// @route   POST /api/movies/:id/reviews
// @desc    Submit a new review for a movie
// @access  Private
router.post('/movies/:id/reviews', auth, validateObjectId('id'), validateReview, async (req, res) => {
  try {
    const { rating, reviewText, isSpoiler = false } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: req.user._id,
      movie: req.params.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    // Create new review
    const review = new Review({
      user: req.user._id,
      movie: req.params.id,
      rating,
      reviewText,
      isSpoiler
    });

    await review.save();
    await review.populate('user', 'username profilePicture');

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Server error while submitting review' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, validateObjectId('id'), validateReview, async (req, res) => {
  try {
    const { rating, reviewText, isSpoiler } = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { rating, reviewText, isSpoiler },
      { new: true, runValidators: true }
    ).populate('user', 'username profilePicture');

    if (!review) {
      return res.status(404).json({ message: 'Review not found or you are not authorized to edit it' });
    }

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error while updating review' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, validateObjectId('id'), async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or you are not authorized to delete it' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error while deleting review' });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark a review as helpful or not helpful
// @access  Private
router.post('/:id/helpful', auth, validateObjectId('id'), async (req, res) => {
  try {
    const { isHelpful } = req.body;

    if (typeof isHelpful !== 'boolean') {
      return res.status(400).json({ message: 'isHelpful must be a boolean value' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already marked this review
    const existingHelpful = review.helpful.find(h => h.user.toString() === req.user._id.toString());

    if (existingHelpful) {
      // Update existing helpful vote
      existingHelpful.isHelpful = isHelpful;
    } else {
      // Add new helpful vote
      review.helpful.push({
        user: req.user._id,
        isHelpful
      });
    }

    await review.save();

    res.json({
      message: 'Helpful vote updated successfully',
      helpfulCount: review.helpfulCount,
      notHelpfulCount: review.notHelpfulCount
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error while updating helpful vote' });
  }
});

// @route   GET /api/users/:id/reviews
// @desc    Get reviews by a specific user
// @access  Public
router.get('/users/:id/reviews', validateObjectId('id'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ user: req.params.id })
      .populate('movie', 'title posterUrl releaseYear')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Review.countDocuments({ user: req.params.id });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReviews: total,
        hasNext: skip + reviews.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching user reviews' });
  }
});

module.exports = router;
