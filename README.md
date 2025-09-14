# Movie Review Platform

A full-stack movie review platform built with React and Node.js, allowing users to discover, rate, and review movies while maintaining a personal watchlist. The platform fetches all movie data from a local MongoDB database (seeded from TMDB) rather than making direct API calls to external services.

## Features

### Frontend
- Browse and search movies
- Filter by genre, year, and rating
- User authentication (login/register)
- Add reviews and ratings
- Personal watchlist

### Backend
- RESTful API with Express
- MongoDB database seeded with TMDB movies
- JWT-based authentication
- Validation and error handling

### Known Limitations
- Movie details pages and reviews are partially implemented
- Trending and featured calculations are basic and may not reflect all logic
- Some filters and search edge cases may not work fully

## Tech Stack
- **Frontend:** React, Redux Toolkit, React Router, Styled Components
- **Backend:** Node.js, Express, MongoDB, JWT, Bcrypt

## Setup

### Prerequisites
- Node.js v14+
- MongoDB
- npm or yarn

### Backend
```bash
cd server
npm install
# Create .env file with MONGODB_URI, JWT_SECRET, TMDB_API_KEY, etc.
npm run dev

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-review-platform
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
TMDB_API_KEY=your-tmdb-api-key-here
```

**Note**: You'll need a TMDB API key to import movies. Get one free at [TMDB API](https://www.themoviedb.org/settings/api).

4. Start the server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The client will start on `http://localhost:3000`

## Database Setup and Seeding

### Quick Setup (Recommended)
Run the automated setup script to create admin user, import movies, and seed reviews:

```bash
cd server
npm run setup
```

This will:
- Create an admin user (email: `admin@moviereview.com`, password: `admin123`)
- Import popular movies from TMDB
- Create sample users and reviews
- Set up the complete database structure

### Manual Setup Options

#### Import Movies Only
```bash
cd server
npm run import-movies
```

#### Seed Reviews Only (if movies already exist)
```bash
cd server
npm run seed-reviews
```

#### Test Integration
```bash
cd server
npm run test-integration
```

### Database Architecture

#### How Movie Data is Fetched
- **All movie data comes from your MongoDB database**, not directly from TMDB
- Frontend Redux actions call your backend API endpoints
- Backend serves data from MongoDB with smart fallbacks
- TMDB is only used for importing new movies (admin feature)

#### Featured Movies Logic
1. **Primary**: Movies with 4.0+ star ratings
2. **Fallback**: Movies with 3.5+ star ratings
3. **Fallback**: Any rated movies (sorted by rating + review count)
4. **Final Fallback**: Most recently added movies

#### Trending Movies Logic
1. **Primary**: Movies with recent reviews (last 30 days)
2. **Fallback**: Highest rated movies with most reviews
3. **Final Fallback**: Most recently added movies

#### Sample Data Included
- **40+ Popular Movies** from TMDB (Fight Club, The Godfather, Parasite, etc.)
- **5 Sample Users** with realistic usernames
- **200+ Sample Reviews** with varied ratings and realistic content
- **Admin User** for managing the platform

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-review-platform
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Set up environment variables (see above)

4. Set up the database:
```bash
cd server
npm run setup
```

5. Start both frontend and backend:
```bash
npm run dev
```

**That's it!** Your movie review platform will be running with:
- 40+ movies imported from TMDB
- Sample users and reviews
- Admin account ready to use
- All data served from your local MongoDB database

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user (requires authentication)

### Movie Endpoints

#### GET /api/movies
Get all movies with pagination and filtering
Query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `search` - Search term
- `genre` - Filter by genre
- `year` - Filter by release year
- `minRating` - Minimum rating filter
- `sortBy` - Sort field (title, releaseYear, averageRating, createdAt)
- `sortOrder` - Sort order (asc, desc)

#### GET /api/movies/:id
Get single movie by ID

#### GET /api/movies/featured
Get featured movies (highest rated)

#### GET /api/movies/trending
Get trending movies (most reviewed recently)

### Review Endpoints

#### GET /api/movies/:id/reviews
Get reviews for a specific movie

#### POST /api/movies/:id/reviews
Submit a new review (requires authentication)
```json
{
  "rating": 5,
  "reviewText": "Great movie!",
  "isSpoiler": false
}
```

#### PUT /api/reviews/:id
Update a review (requires authentication)

#### DELETE /api/reviews/:id
Delete a review (requires authentication)

#### POST /api/reviews/:id/helpful
Mark a review as helpful/not helpful (requires authentication)

### User Endpoints

#### GET /api/users/:id
Get user profile

#### PUT /api/users/:id
Update user profile (requires authentication)

#### GET /api/users/:id/watchlist
Get user's watchlist (requires authentication)

#### POST /api/users/:id/watchlist
Add movie to watchlist (requires authentication)
```json
{
  "movieId": "movie_id_here"
}
```

#### DELETE /api/users/:id/watchlist/:movieId
Remove movie from watchlist (requires authentication)

```javascript
{
  user: ObjectId (ref: User)
  movie: ObjectId (ref: Movie)
  rating: Number (1-5, required)
  reviewText: String (required)
  helpful: [{
    user: ObjectId (ref: User)
    isHelpful: Boolean
  }]
  isSpoiler: Boolean
}
```

## Environment Variables

### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time
- `BCRYPT_ROUNDS` - Bcrypt salt rounds
- `RATE_LIMIT_WINDOW_MS` - Rate limit window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window
- `TMDB_API_KEY` - TMDB API key for importing movies

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL

### Common Issues

#### "No movies found" or empty movie lists
- Run the database setup: `cd server && npm run setup`
- Check if MongoDB is running and accessible
- Verify your `MONGODB_URI` in the `.env` file

#### TMDB API errors during import
- Verify your `TMDB_API_KEY` is correct in the `.env` file
- Check if you've exceeded TMDB rate limits (wait a few minutes)
- Ensure your TMDB API key has the correct permissions

#### Trending movies showing as empty
- This is normal if you have no reviews yet
- The system will fallback to highest-rated movies
- Run `npm run seed-reviews` to add sample reviews

#### Frontend not connecting to backend
- Verify `REACT_APP_API_URL` in client `.env` file
- Ensure backend is running on the correct port (default: 5000)
- Check browser console for CORS errors

#### Database connection issues
- Ensure MongoDB is installed and running
- Check if the database name in `MONGODB_URI` exists
- Try connecting to MongoDB directly: `mongosh mongodb://localhost:27017/movie-review-platform`

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Ensure CORS is configured for your frontend domain

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages
3. Configure environment variables for production API URL

## License

This project is licensed under the MIT License - see the LICENSE file for details.