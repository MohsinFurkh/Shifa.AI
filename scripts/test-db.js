// Script to test MongoDB connection
require('dotenv').config({ path: './.env.local' });
const connectDB = require('../lib/db');

async function testDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Using MongoDB URI:', process.env.MONGODB_URI ? 'URI defined' : 'URI not defined');
    await connectDB();
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testDBConnection(); 