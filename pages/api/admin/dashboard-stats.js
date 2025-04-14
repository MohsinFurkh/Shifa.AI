import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import Appointment from '../../../models/Appointment';

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Get counts from database
    const totalUsers = await User.countDocuments();
    const activeDoctors = await User.countDocuments({ userType: 'doctor' });
    const activePatients = await User.countDocuments({ userType: 'patient' });
    const consultations = await Appointment.countDocuments({ status: { $ne: 'cancelled' } });
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .then(users => users.map(user => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        type: user.userType,
        status: 'active', // For simplicity, all users are active
        date: new Date(user.createdAt).toISOString().split('T')[0] // Format date as YYYY-MM-DD
      })));
    
    // Return the data
    return res.status(200).json({
      success: true,
      totalUsers,
      activeDoctors,
      activePatients,
      consultations,
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