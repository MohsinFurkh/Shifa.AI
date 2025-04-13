// Convert CommonJS imports to ES modules
import { getMongoClient } from '../../lib/db';

// Make sure this function is exported as default
export default async function handler(req, res) {
  try {
    // Get MongoDB client and database
    const { client, db } = await getMongoClient();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    
    // Sample query to users collection (if it exists)
    let users = [];
    if (collections.some(c => c.name === 'users')) {
      users = await db.collection('users').find({}).limit(5).toArray();
    }
    
    return res.status(200).json({
      success: true,
      message: 'MongoDB driver connection successful',
      data: {
        databaseName: db.databaseName,
        collections: collections.map(c => c.name),
        userCount: users.length,
        users: users.map(user => ({
          id: user._id,
          email: user.email,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
          type: user.userType
        }))
      }
    });
  } catch (error) {
    console.error('MongoDB API test failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to MongoDB',
      error: error.message
    });
  }
} 