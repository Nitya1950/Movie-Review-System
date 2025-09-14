const fs = require('fs');
const path = require('path');

// Create server .env file
const serverEnvContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-review-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
TMDB_API_KEY=your-tmdb-api-key-here
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;

// Create client .env file
const clientEnvContent = `REACT_APP_API_URL=http://localhost:5000/api`;

// Write server .env
fs.writeFileSync(path.join(__dirname, 'server', '.env'), serverEnvContent);
console.log('✅ Created server/.env file');

// Write client .env
fs.writeFileSync(path.join(__dirname, 'client', '.env'), clientEnvContent);
console.log('✅ Created client/.env file');

console.log('\n🎉 Environment files created successfully!');
console.log('\nNext steps:');
console.log('1. Install dependencies: npm run install-all');
console.log('2. Start MongoDB service');
console.log('3. Start the application: npm run dev');
console.log('\n📝 Note: Make sure to change the JWT_SECRET in production!');
