import mongoose from 'mongoose';

export default async function connectMongo() {
  const uri = (process.env.MONGO_URI || 'mongodb://localhost:27017/digital_twin').trim();

  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('MONGO_URI must start with mongodb:// or mongodb+srv://');
  }

  mongoose.set('strictQuery', true);

  try {
    // Works for both local MongoDB and Atlas.
    const connectionPromise = mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });

    await connectionPromise;
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('MongoDB connection failed');
    console.error('Error:', error.message);
    console.error('Please check:');
    console.error('1. MongoDB service is running for local URIs');
    console.error('2. Atlas IP whitelist and credentials for cloud URIs');
    console.error('3. URI includes the expected database name');
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

