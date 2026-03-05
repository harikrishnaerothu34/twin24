/**
 * Database Initialization Script
 * Sets up MongoDB collections with proper indexes and constraints
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Device from './src/models/Device.js';
import Metric from './src/models/Metric.js';
import Alert from './src/models/Alert.js';

dotenv.config();

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...\n');

    // Connect to MongoDB
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}\n`);

    // Get database and list existing collections
    const db = mongoose.connection.db;
    const existingCollections = await db.listCollections().toArray();
    console.log('📋 Existing collections:', existingCollections.map(c => c.name).join(', ') || 'None');

    // Create collections with schemas (if they don't exist)
    console.log('\n🔧 Setting up collections and indexes...\n');

    // Users collection
    console.log('👤 Setting up Users collection...');
    await User.createIndexes();
    const userCount = await User.countDocuments();
    console.log(`   ✓ Users collection ready (${userCount} documents)`);

    // Devices collection
    console.log('💻 Setting up Devices collection...');
    await Device.createIndexes();
    const deviceCount = await Device.countDocuments();
    console.log(`   ✓ Devices collection ready (${deviceCount} documents)`);

    // Metrics collection
    console.log('📊 Setting up Metrics collection...');
    await Metric.createIndexes();
    const metricCount = await Metric.countDocuments();
    console.log(`   ✓ Metrics collection ready (${metricCount} documents)`);

    // Alerts collection
    console.log('🔔 Setting up Alerts collection...');
    await Alert.createIndexes();
    const alertCount = await Alert.countDocuments();
    console.log(`   ✓ Alerts collection ready (${alertCount} documents)`);

    // List all collections after setup
    console.log('\n📋 Final collection list:');
    const finalCollections = await db.listCollections().toArray();
    finalCollections.forEach(col => {
      console.log(`   • ${col.name}`);
    });

    // Display indexes
    console.log('\n🔍 Collection Indexes:');
    
    const userIndexes = await User.collection.getIndexes();
    console.log('   Users:', Object.keys(userIndexes).join(', '));
    
    const deviceIndexes = await Device.collection.getIndexes();
    console.log('   Devices:', Object.keys(deviceIndexes).join(', '));
    
    const metricIndexes = await Metric.collection.getIndexes();
    console.log('   Metrics:', Object.keys(metricIndexes).join(', '));
    
    const alertIndexes = await Alert.collection.getIndexes();
    console.log('   Alerts:', Object.keys(alertIndexes).join(', '));

    console.log('\n============================================================');
    console.log('✅ DATABASE INITIALIZATION COMPLETE');
    console.log('============================================================');
    console.log('Your MongoDB database is ready for use!');
    console.log('Collections: users, devices, metrics, alerts');
    console.log('============================================================\n');

  } catch (error) {
    console.error('\n❌ Database initialization failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('IP')) {
      console.error('\n💡 IP Whitelist Issue:');
      console.error('   1. Go to MongoDB Atlas → Network Access');
      console.error('   2. Click "Add IP Address"');
      console.error('   3. Add your current IP or use 0.0.0.0/0 for development');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB\n');
  }
}

// Run initialization
initializeDatabase();
