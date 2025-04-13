// Script to test MongoDB connection
const connectDB = require('../lib/db');

async function testDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testDBConnection(); 