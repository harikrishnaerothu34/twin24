import mongoose from 'mongoose';

export default async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/digital_twin';

  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }

  mongoose.set('strictQuery', true);

  try {
    // Set a 5-second timeout for MongoDB connection
    const connectionPromise = mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    await connectionPromise;
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.warn('⚠ MongoDB connection failed. Running in mock/demo mode.');
    console.warn('  Error:', error.message);
    console.log('💡 For full functionality, ensure MongoDB is running on', uri);
    // Continue anyway for demo/testing
  }
}

