const express = require('express');
const User = require('../models/User');
const Review = require('../models/Review');
const { validateObjectId } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -__v')
      .populate('watchlist.movie', 'title posterUrl releaseYear averageRating');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's review statistics
    const reviewStats = await Review.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const stats = reviewStats.length > 0 ? reviewStats[0] : { totalReviews: 0, averageRating: 0 };

    res.json({
      user: {
        ...user.toObject(),
        stats: {
          totalReviews: stats.totalReviews,
          averageRating: Math.round(stats.averageRating * 10) / 10
        }
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', auth, validateObjectId('id'), async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const { username, email, profilePicture } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field === 'email' ? 'Email' : 'Username'} already exists` 
      });
    }
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   GET /api/users/:id/watchlist
// @desc    Get user's watchlist
// @access  Private
router.get('/:id/watchlist', auth, validateObjectId('id'), async (req, res) => {
  try {
    // Check if user is accessing their own watchlist
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'You can only access your own watchlist' });
    }

    const user = await User.findById(req.params.id)
      .populate({
        path: 'watchlist.movie',
        select: 'title posterUrl releaseYear averageRating genre director'
      })
      .select('watchlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sort watchlist by date added (newest first)
    const sortedWatchlist = user.watchlist.sort((a, b) => b.dateAdded - a.dateAdded);

    res.json({ watchlist: sortedWatchlist });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Server error while fetching watchlist' });
  }
});

// @route   POST /api/users/:id/watchlist
// @desc    Add movie to watchlist
// @access  Private
router.post('/:id/watchlist', auth, validateObjectId('id'), async (req, res) => {
  try {
    // Check if user is updating their own watchlist
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own watchlist' });
    }

    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if movie is already in watchlist
    const existingItem = user.watchlist.find(item => 
      item.movie.toString() === movieId
    );

    if (existingItem) {
      return res.status(400).json({ message: 'Movie is already in your watchlist' });
    }

    // Add movie to watchlist
    user.watchlist.push({
      movie: movieId,
      dateAdded: new Date()
    });

    await user.save();

    // Populate the newly added movie
    await user.populate({
      path: 'watchlist.movie',
      select: 'title posterUrl releaseYear averageRating genre director'
    });

    const addedItem = user.watchlist[user.watchlist.length - 1];

    res.status(201).json({
      message: 'Movie added to watchlist successfully',
      watchlistItem: addedItem
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Server error while adding to watchlist' });
  }
});

// @route   DELETE /api/users/:id/watchlist/:movieId
// @desc    Remove movie from watchlist
// @access  Private
router.delete('/:id/watchlist/:movieId', auth, validateObjectId('id'), validateObjectId('movieId'), async (req, res) => {
  try {
    // Check if user is updating their own watchlist
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own watchlist' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove movie from watchlist
    const initialLength = user.watchlist.length;
    user.watchlist = user.watchlist.filter(item => 
      item.movie.toString() !== req.params.movieId
    );

    if (user.watchlist.length === initialLength) {
      return res.status(404).json({ message: 'Movie not found in watchlist' });
    }

    await user.save();

    res.json({ message: 'Movie removed from watchlist successfully' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Server error while removing from watchlist' });
  }
});

module.exports = router;
