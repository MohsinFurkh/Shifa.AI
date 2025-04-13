import connectDB from '../../lib/db';

// Make sure this function is exported as default
export default async function handler(req, res) {
  try {
    await connectDB();
    
    // If we get here, the connection was successful
    res.status(200).json({ 
      success: true, 
      message: 'Successfully connected to MongoDB!'
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect to MongoDB', 
      error: error.message 
    });
  }
} 