import { 
  getUserAppointments, 
  createAppointment, 
  updateAppointment, 
  findUserById 
} from '../../../lib/static-data';

export default async function handler(req, res) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getAppointments(req, res);
    case 'POST':
      return createNewAppointment(req, res);
    case 'PUT':
      return updateExistingAppointment(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

// Get a user's appointments
async function getAppointments(req, res) {
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
    
    // Get user's appointments
    const userAppointments = getUserAppointments(userId);
    
    // Return appointments
    return res.status(200).json({
      success: true,
      data: userAppointments
    });
  } catch (error) {
    console.error('Error getting appointments:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get appointments'
    });
  }
}

// Create a new appointment
async function createNewAppointment(req, res) {
  try {
    const appointmentData = req.body;
    
    if (!appointmentData.patientId) {
      return res.status(400).json({ success: false, message: 'Patient ID is required' });
    }
    
    // Verify patient exists
    const patient = findUserById(appointmentData.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    // Create new appointment
    const newAppointment = createAppointment(appointmentData);
    
    // Return the new appointment
    return res.status(201).json({
      success: true,
      data: newAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create appointment'
    });
  }
}

// Update an existing appointment
async function updateExistingAppointment(req, res) {
  try {
    const { appointmentId, ...updatedData } = req.body;
    
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }
    
    // Update the appointment
    const updatedAppointment = updateAppointment(appointmentId, updatedData);
    
    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Return the updated appointment
    return res.status(200).json({
      success: true,
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update appointment'
    });
  }
} 