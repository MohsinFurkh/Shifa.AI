import { getDashboardStats, getRecentUsers } from '../../../lib/static-data';

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get dashboard stats
    const stats = getDashboardStats();
    
    // Get recent users
    const recentUsers = getRecentUsers(5);
    
    // Return the data
    return res.status(200).json({
      success: true,
      totalUsers: stats.totalUsers,
      activeDoctors: stats.activeDoctors,
      activePatients: stats.activePatients,
      consultations: stats.consultations,
      recentUsers
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get dashboard stats'
    });
  }
} 