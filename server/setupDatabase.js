// setupDatabase.js - Complete database setup and seeding script
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Review = require('./models/Review');
const User = require('./models/User');
const importMoviesWithReviews = require('./importMoviesWithReviews');
require('dotenv').config();

async function checkDatabaseConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    return false;
  }
}

async function checkDatabaseStatus() {
  try {
    const movieCount = await Movie.countDocuments();
    const reviewCount = await Review.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log('\n📊 Database Status:');
    console.log(`   Movies: ${movieCount}`);
    console.log(`   Reviews: ${reviewCount}`);
    console.log(`   Users: ${userCount}`);
    
    return { movieCount, reviewCount, userCount };
  } catch (error) {
    console.error('❌ Error checking database status:', error.message);
    return null;
  }
}

async function createAdminUser() {
  try {
    // Check if admin user exists
    let adminUser = await User.findOne({ isAdmin: true });
    
    if (adminUser) {
      console.log('✅ Admin user already exists');
      return adminUser;
    }
    
    // Create admin user
    adminUser = new User({
      username: 'admin',
      email: 'admin@moviereview.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      profilePicture: '',
      isAdmin: true
    });
    
    await adminUser.save();
    console.log('✅ Created admin user (email: admin@moviereview.com, password: admin123)');
    return adminUser;
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    return null;
  }
}

async function setupDatabase() {
  console.log('🚀 Starting Movie Review Platform Database Setup...\n');
  
  // Check database connection
  const connected = await checkDatabaseConnection();
  if (!connected) {
    console.log('❌ Cannot proceed without database connection');
    process.exit(1);
  }
  
  // Check current database status
  const status = await checkDatabaseStatus();
  if (!status) {
    console.log('❌ Cannot check database status');
    await mongoose.disconnect();
    process.exit(1);
  }
  
  // Create admin user
  await createAdminUser();
  
  // If we have no movies or very few reviews, run the full import
  if (status.movieCount === 0 || status.reviewCount < 100) {
    console.log('\n🎬 Database needs seeding. Starting movie and review import...\n');
    await importMoviesWithReviews();
  } else {
    console.log('\n✅ Database already has sufficient data');
    console.log('💡 To re-seed the database, delete existing data first or run individual scripts:');
    console.log('   - node importMoviesWithReviews.js (for movies + reviews)');
    console.log('   - node seedReviews.js (for reviews only)');
  }
  
  // Final status check
  console.log('\n📊 Final Database Status:');
  await checkDatabaseStatus();
  
  await mongoose.disconnect();
  console.log('\n✅ Database setup complete!');
  console.log('\n🚀 You can now start your application:');
  console.log('   Backend: npm run dev (in server directory)');
  console.log('   Frontend: npm start (in client directory)');
}

// Run the setup function
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = setupDatabase;
