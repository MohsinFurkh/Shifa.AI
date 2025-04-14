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
    // Handle case where URI is already properly formatted
    if (!uri.includes('@') || uri.split('@').length <= 2) {
      return uri;
    }
    
    // For URIs with multiple @ symbols (likely one in password and one as separator)
    const protocolParts = uri.split('://');
    const protocol = protocolParts[0];
    const restOfUri = protocolParts[1];
    
    // Find the position of the first colon (after username)
    const firstColonPos = restOfUri.indexOf(':');
    // Extract username
    const username = restOfUri.substring(0, firstColonPos);
    
    // Find the last @ which separates credentials from host
    const lastAtPos = restOfUri.lastIndexOf('@');
    // Extract the part that contains the password (between first colon and last @)
    const encodedPassword = encodeURIComponent(restOfUri.substring(firstColonPos + 1, lastAtPos));
    
    // Get the host part (everything after the last @)
    const hostPart = restOfUri.substring(lastAtPos + 1);
    
    // Reconstruct URI with encoded password
    return `${protocol}://${username}:${encodedPassword}@${hostPart}`;
  } catch (e) {
    console.error('Error fixing MongoDB URI:', e);
    console.log('Falling back to original URI');
    return uri;
  }
}

// Use a more robust approach to handle the MongoDB URI
function getCleanURI(uri) {
  if (!uri) return null;
  
  try {
    // For direct troubleshooting, log a sanitized version (hide actual password)
    const sanitizedUri = uri.replace(/:[^:@]+@/, ':***@');
    console.log('Connecting with sanitized URI:', sanitizedUri);
    
    // Most reliable approach: manually construct the connection string
    // Parse the URI to extract components
    const [protocol, rest] = uri.split('://');
    
    // Find position of last @ symbol (which separates auth from host)
    const lastAtIndex = rest.lastIndexOf('@');
    
    if (lastAtIndex === -1) {
      // No authentication in the URI
      return uri;
    }
    
    // Split into auth part and host part
    const authPart = rest.substring(0, lastAtIndex);
    const hostPart = rest.substring(lastAtIndex + 1);
    
    // Find the username and password
    const colonIndex = authPart.indexOf(':');
    
    if (colonIndex === -1) {
      // No password in the URI
      return uri;
    }
    
    const username = authPart.substring(0, colonIndex);
    const password = authPart.substring(colonIndex + 1);
    
    // Ensure password is properly encoded
    const encodedPassword = encodeURIComponent(password);
    
    // Rebuild the connection string
    return `${protocol}://${username}:${encodedPassword}@${hostPart}`;
  } catch (error) {
    console.error('Error cleaning MongoDB URI:', error);
    return uri; // Return original if parsing fails
  }
}

const fixedURI = getCleanURI(MONGODB_URI);

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