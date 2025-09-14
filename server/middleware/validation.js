const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Movie validation rules
const validateMovie = [
  body('title')
    .notEmpty()
    .withMessage('Movie title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('genre')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('genre.*')
    .isIn([
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
      'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller',
      'War', 'Western'
    ])
    .withMessage('Invalid genre'),
  body('releaseYear')
    .isInt({ min: 1888, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid release year'),
  body('director')
    .notEmpty()
    .withMessage('Director is required')
    .isLength({ max: 100 })
    .withMessage('Director name cannot exceed 100 characters'),
  body('cast')
    .isArray()
    .withMessage('Cast must be an array'),
  body('cast.*.name')
    .notEmpty()
    .withMessage('Cast member name is required'),
  body('synopsis')
    .notEmpty()
    .withMessage('Synopsis is required')
    .isLength({ max: 2000 })
    .withMessage('Synopsis cannot exceed 2000 characters'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  handleValidationErrors
];

// Review validation rules
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .notEmpty()
    .withMessage('Review text is required')
    .isLength({ max: 2000 })
    .withMessage('Review cannot exceed 2000 characters'),
  body('isSpoiler')
    .optional()
    .isBoolean()
    .withMessage('isSpoiler must be a boolean'),
  handleValidationErrors
];

// Query validation rules
// Query validation rules
const validateMovieQuery = [
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  query('genre')
    .optional({ checkFalsy: true }) // allow empty string
    .isIn([
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
      'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
      'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller',
      'War', 'Western'
    ])
    .withMessage('Invalid genre filter'),

  query('year')
    .optional({ checkFalsy: true })
    .isInt({ min: 1888, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid year filter'),

  query('minRating')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 5 })
    .withMessage('Minimum rating must be between 0 and 5'),

  query('sortBy')
    .optional({ checkFalsy: true })
    .isIn(['title', 'releaseYear', 'averageRating', 'createdAt'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional({ checkFalsy: true })
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  handleValidationErrors
];


// ID validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateMovie,
  validateReview,
  validateMovieQuery,
  validateObjectId,
  handleValidationErrors
};
