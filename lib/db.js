const mongoose = require('mongoose');
const { ServerApiVersion } = require('mongodb');

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'shifa';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global variable to maintain connection across hot reloads
let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const opts = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      dbName: DB_NAME,
      bufferCommands: false,
    };

    cachedConnection.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`MongoDB connection successful to database: ${DB_NAME}!`);
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        throw error;
      });
  }
  
  cachedConnection.conn = await cachedConnection.promise;
  return cachedConnection.conn;
}

// Add a test connection function to verify the connection works
async function testConnection() {
  try {
    await connectDB();
    console.log('MongoDB connection test successful');
    return true;
  } catch (error) {
    console.error('MongoDB connection test failed:', error.message);
    return false;
  }
}

module.exports = connectDB;
module.exports.testConnection = testConnection; 