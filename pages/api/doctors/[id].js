import { findUserById } from '../../../lib/static-data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    // Find doctor by ID
    const doctor = findUserById(id);
    
    // Check if doctor exists and is of type 'doctor'
    if (!doctor || doctor.userType !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Return doctor info without sensitive data
    return res.status(200).json({
      success: true,
      data: {
        id: doctor.id,
        name: `${doctor.firstName} ${doctor.lastName}`,
        email: doctor.email,
        specialty: doctor.specialty,
        experience: doctor.experience,
        education: doctor.education
      }
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor'
    });
  }
} 