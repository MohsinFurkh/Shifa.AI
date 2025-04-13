const connectDB = require('../../../lib/db');

module.exports = async function handler(req, res) {
  console.log('[API] Debug: Request received');
  
  try {
    // Test database connection
    console.log('[API] Debug: Testing database connection');
    try {
      await connectDB();
      console.log('[API] Debug: Database connection successful');
    } catch (dbError) {
      console.error('[API] Debug: Database connection failed', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: dbError.message
      });
    }
    
    // Return success with diagnostic information
    return res.status(200).json({
      success: true,
      message: 'API routes are working',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers['content-type'],
        body: req.body || {},
        query: req.query || {}
      }
    });
  } catch (error) {
    console.error('[API] Debug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Debug API failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 