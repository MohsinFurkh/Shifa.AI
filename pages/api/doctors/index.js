import { getAllDoctors } from '../../../lib/static-data';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get all doctors from static data
    const doctors = getAllDoctors();
    
    // Return list of doctors without sensitive data
    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors.map(doctor => ({
        id: doctor.id,
        name: `${doctor.firstName} ${doctor.lastName}`,
        email: doctor.email,
        specialty: doctor.specialty,
        experience: doctor.experience,
        education: doctor.education
      }))
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors'
    });
  }
} 