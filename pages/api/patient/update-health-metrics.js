import dbConnect from '../../../lib/db';
import HealthMetric from '../../../models/HealthMetric';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { userId, metrics } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // Verify user exists
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Create a new health metric record
    const healthMetric = new HealthMetric({
      userId,
      ...metrics,
      timestamp: new Date()
    });
    
    // Save to the database
    await healthMetric.save();
    
    // Get latest metrics for this user
    const latestMetrics = await HealthMetric.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);
    
    // Return the new metrics and history
    return res.status(200).json({
      success: true,
      data: {
        current: healthMetric,
        history: latestMetrics
      }
    });
  } catch (error) {
    console.error('Error updating health metrics:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update health metrics'
    });
  }
} 