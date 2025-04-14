import dbConnect from '../../../lib/db';
import HealthMetric from '../../../models/HealthMetric';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // Verify user exists
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get the most recent health metric
    const currentMetric = await HealthMetric.findOne({ userId })
      .sort({ timestamp: -1 });
    
    // Get historical metrics
    const history = await HealthMetric.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);
    
    // Return metrics
    return res.status(200).json({
      success: true,
      data: {
        current: currentMetric || null,
        history: history || []
      }
    });
  } catch (error) {
    console.error('Error getting health metrics:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get health metrics'
    });
  }
} 