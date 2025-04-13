const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'shifa';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global variables to maintain connections across hot reloads
let cachedMongoose = global.mongoose;
let cachedMongoClient = global.mongoClient;

if (!cachedMongoose) {
  cachedMongoose = global.mongoose = { conn: null, promise: null };
}

if (!cachedMongoClient) {
  cachedMongoClient = global.mongoClient = { client: null, db: null, promise: null };
}

// MongoDB Client initialization for direct driver access
const getMongoClient = async () => {
  if (cachedMongoClient.client && cachedMongoClient.db) {
    return { client: cachedMongoClient.client, db: cachedMongoClient.db };
  }

  if (!cachedMongoClient.promise) {
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    cachedMongoClient.promise = client.connect()
      .then(() => {
        console.log("MongoDB client connected successfully!");
        const db = client.db(DB_NAME);
        cachedMongoClient.client = client;
        cachedMongoClient.db = db;
        return { client, db };
      })
      .catch((error) => {
        console.error('MongoDB client connection failed:', error.message);
        throw error;
      });
  }

  const { client, db } = await cachedMongoClient.promise;
  return { client, db };
};

// Mongoose connection for schema-based models
async function connectDB() {
  if (cachedMongoose.conn) {
    return cachedMongoose.conn;
  }

  if (!cachedMongoose.promise) {
    const opts = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      dbName: DB_NAME,
      bufferCommands: false,
    };

    cachedMongoose.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`Mongoose connected successfully to database: ${DB_NAME}!`);
        return mongoose;
      })
      .catch((error) => {
        console.error('Mongoose connection failed:', error.message);
        throw error;
      });
  }
  
  cachedMongoose.conn = await cachedMongoose.promise;
  return cachedMongoose.conn;
}

// Test connection function to verify both connections work
async function testConnection() {
  try {
    // Test Mongoose connection
    await connectDB();
    console.log('✅ Mongoose connection test successful');
    
    // Test MongoDB driver connection
    const { client, db } = await getMongoClient();
    await db.command({ ping: 1 });
    console.log("✅ MongoDB driver connection test successful!");
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    return false;
  }
}

module.exports = connectDB;
module.exports.getMongoClient = getMongoClient;
module.exports.testConnection = testConnection; 