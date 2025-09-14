const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot exceed 5 stars']
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    maxlength: [2000, 'Review cannot exceed 2000 characters'],
    trim: true
  },
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isHelpful: {
      type: Boolean,
      required: true
    }
  }],
  isSpoiler: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one review per user per movie
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

// Index for movie reviews
reviewSchema.index({ movie: 1, createdAt: -1 });

// Index for user reviews
reviewSchema.index({ user: 1, createdAt: -1 });

// Update movie average rating when review is saved/updated/deleted
reviewSchema.post('save', async function() {
  const Movie = mongoose.model('Movie');
  const movie = await Movie.findById(this.movie);
  if (movie) {
    await movie.updateAverageRating();
  }
});

reviewSchema.post('findOneAndUpdate', async function() {
  const Movie = mongoose.model('Movie');
  const movie = await Movie.findById(this.movie);
  if (movie) {
    await movie.updateAverageRating();
  }
});

reviewSchema.post('findOneAndDelete', async function() {
  const Movie = mongoose.model('Movie');
  const movie = await Movie.findById(this.movie);
  if (movie) {
    await movie.updateAverageRating();
  }
});

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful.filter(h => h.isHelpful).length;
});

// Virtual for not helpful count
reviewSchema.virtual('notHelpfulCount').get(function() {
  return this.helpful.filter(h => !h.isHelpful).length;
});

module.exports = mongoose.model('Review', reviewSchema);
