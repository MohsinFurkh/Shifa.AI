// Script to test MongoDB connection
import dotenv from 'dotenv';
import connectDB from '../lib/db.js';
import { getMongoClient } from '../lib/db.js';

// Load environment variables from .env.local
dotenv.config({ path: './.env.local' });

async function testDBConnection() {
  try {
    console.log('Testing MongoDB connections...');
    console.log('Using MongoDB URI:', process.env.MONGODB_URI ? 'URI defined' : 'URI not defined');
    
    // Test Mongoose connection
    console.log('\n--- Testing Mongoose Connection ---');
    await connectDB();
    console.log('✅ Mongoose connection successful!');
    
    // Test MongoDB driver connection
    console.log('\n--- Testing MongoDB Driver Connection ---');
    const { client, db } = await getMongoClient();
    await db.command({ ping: 1 });
    console.log("✅ MongoDB driver connection test successful!");
    console.log(`✅ Connected to database: ${process.env.DB_NAME || 'shifa'}`);
    
    // List collections as a test
    const collections = await db.listCollections().toArray();
    console.log(`\nCollections in database (${collections.length} found):`);
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testDBConnection(); 