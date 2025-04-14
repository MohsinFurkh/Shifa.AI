import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

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
export const getMongoClient = async () => {
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

// Replace special characters in the password to fix connection URL
function getFixedURI(uri) {
  // MongoDB Atlas URL with @ in password needs special handling
  try {
    // Extract parts of the connection string
    const [protocol, rest] = uri.split('://');
    const [credentials, hostAndParams] = rest.split('@');
    
    // Split username and password
    let [username, password] = credentials.split(':');
    
    // Encode the password to handle special characters
    password = encodeURIComponent(password);
    
    // Reconstruct the connection string
    return `${protocol}://${username}:${password}@${hostAndParams}`;
  } catch (e) {
    console.error('Error fixing MongoDB URI:', e);
    return uri;
  }
}

const fixedURI = getFixedURI(MONGODB_URI);

if (!fixedURI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(fixedURI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Test connection function to verify both connections work
export async function testConnection() {
  try {
    // Test Mongoose connection
    await dbConnect();
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

export default dbConnect; 