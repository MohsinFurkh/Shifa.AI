import { updateUserHealthMetrics, findUserById } from '../../../lib/static-data';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { userId, metrics } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // Verify user exists
    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update health metrics
    const updatedMetrics = updateUserHealthMetrics(userId, metrics);
    
    // Return updated metrics
    return res.status(200).json({
      success: true,
      data: updatedMetrics
    });
  } catch (error) {
    console.error('Error updating health metrics:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update health metrics'
    });
  }
} 