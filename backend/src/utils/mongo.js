import mongoose from 'mongoose';

export default async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/digital_twin';

  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }

  mongoose.set('strictQuery', true);

  try {
    // MongoDB Atlas optimized connection settings
    const connectionPromise = mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // Increased for Atlas
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority'
    });

    await connectionPromise;
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error('  Error:', error.message);
    console.error('💡 Please check:');
    console.error('  1. Your IP is whitelisted in MongoDB Atlas');
    console.error('  2. Database credentials are correct');
    console.error('  3. Network connection is stable');
    throw error; // Don't continue without DB
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

