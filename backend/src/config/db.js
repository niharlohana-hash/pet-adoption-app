const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;

    // If explicit memory DB requested or no URI provided, use MongoMemoryServer for instant zero-config setup (dev only)
    if ((!mongoURI || process.env.USE_MEMORY_DB === 'true') && process.env.NODE_ENV !== 'production') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        mongoURI = mongod.getUri();
        console.log('📦 Using MongoDB In-Memory Server at:', mongoURI);
      } catch (memErr) {
        console.warn('⚠️ Could not start MongoMemoryServer, falling back to default localhost URI:', memErr.message);
        mongoURI = mongoURI || 'mongodb://127.0.0.1:27017/pet_adoption';
      }
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If standard connection fails and memory server wasn't tried, attempt memory server fallback ONLY in dev
    if (!mongod && process.env.NODE_ENV !== 'production' && process.env.USE_MEMORY_DB === 'true') {
      try {
        console.log('🔄 Attempting fallback to MongoMemoryServer...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const fallbackURI = mongod.getUri();
        const conn = await mongoose.connect(fallbackURI);
        console.log(`✅ MongoDB Fallback In-Memory Connected at: ${fallbackURI}`);
        return conn;
      } catch (fallbackErr) {
        console.error('❌ Fallback to In-Memory DB failed:', fallbackErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
    console.log('MongoDB connection closed.');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
