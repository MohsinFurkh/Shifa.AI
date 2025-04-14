import { getUserHealthMetrics, findUserById } from '../../../lib/static-data';

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // Verify user exists
    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get user's health metrics
    const metrics = getUserHealthMetrics(userId);
    
    // Return metrics
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error getting health metrics:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get health metrics'
    });
  }
} 