require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function testConnection() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    console.log('Successfully connected to MongoDB!');
    
    // Test creating a user
    const users = db.collection('users');
    const result = await users.insertOne({
      name: 'Test User',
      email: 'test@example.com',
      role: 'patient',
      createdAt: new Date(),
    });
    
    console.log('Successfully created test user:', result.insertedId);
    
    // Clean up
    await users.deleteOne({ email: 'test@example.com' });
    console.log('Cleaned up test data');
    
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

testConnection(); 