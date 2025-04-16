import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shifaai';
const MONGODB_DB = process.env.MONGODB_DB || 'shifaai';

// Check if MongoClient is correctly initialized
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Create cached connection
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
} 