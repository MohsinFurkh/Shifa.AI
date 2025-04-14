import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Path to the file where we'll store user data between server restarts
const USER_DATA_PATH = path.join(process.cwd(), 'data', 'users.json');
const HEALTH_METRICS_PATH = path.join(process.cwd(), 'data', 'health_metrics.json');
const APPOINTMENTS_PATH = path.join(process.cwd(), 'data', 'appointments.json');

// Make sure the data directory exists
try {
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
  }
} catch (error) {
  console.error('Error creating data directory:', error);
}

// Updated hashed password for admin (admin123)
const adminPasswordHash = '$2a$10$Yw7IUfNx54km97UWsTj6AOE2KDhlQqaOz6EE2wOcJmj6opz8iGxt2';

// Initial static users data
const initialUsers = [
  {
    id: 'admin-1',
    firstName: 'Mohsin',
    lastName: 'Furkh',
    email: 'admin@shifaai.com',
    password: adminPasswordHash,
    userType: 'admin',
    createdAt: new Date('2023-01-01').toISOString()
  },
  // Doctors
  {
    id: 'doctor-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'dr.sarah@shifaai.com',
    password: '$2a$10$6pH1FrPJBMVhnnl1DgKYRuX71luJ1/.8N9D0ldyuIUAlzdrE8U9A2', // password: doctor123
    userType: 'doctor',
    specialty: 'Cardiologist',
    experience: '12 years',
    education: 'MD, Harvard Medical School',
    createdAt: new Date('2023-02-15').toISOString()
  },
  {
    id: 'doctor-2',
    firstName: 'Michael',
    lastName: 'Lee',
    email: 'dr.michael@shifaai.com',
    password: '$2a$10$6pH1FrPJBMVhnnl1DgKYRuX71luJ1/.8N9D0ldyuIUAlzdrE8U9A2', // password: doctor123
    userType: 'doctor',
    specialty: 'Dermatologist',
    experience: '8 years',
    education: 'MD, Johns Hopkins University',
    createdAt: new Date('2023-03-10').toISOString()
  },
  {
    id: 'doctor-3',
    firstName: 'Amelia',
    lastName: 'Patel',
    email: 'dr.amelia@shifaai.com',
    password: '$2a$10$6pH1FrPJBMVhnnl1DgKYRuX71luJ1/.8N9D0ldyuIUAlzdrE8U9A2', // password: doctor123
    userType: 'doctor',
    specialty: 'Neurologist',
    experience: '15 years',
    education: 'MD, Stanford University',
    createdAt: new Date('2023-01-25').toISOString()
  },
  // Sample patients
  {
    id: 'patient-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: '$2a$10$6pH1FrPJBMVhnnl1DgKYRuX71luJ1/.8N9D0ldyuIUAlzdrE8U9A2', // password: patient123 (changed to be the same for simplicity)
    userType: 'patient',
    createdAt: new Date('2023-04-05').toISOString()
  }
];

// Initial health metrics data structure
const initialHealthMetrics = {};

// Initial appointments data structure
const initialAppointments = [];

// Load users from file or use initial static data if file doesn't exist
function loadUsers() {
  try {
    if (fs.existsSync(USER_DATA_PATH)) {
      const userData = fs.readFileSync(USER_DATA_PATH, 'utf8');
      return JSON.parse(userData);
    } else {
      // First run, save initial users to file
      fs.writeFileSync(USER_DATA_PATH, JSON.stringify(initialUsers, null, 2));
      return [...initialUsers];
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    return [...initialUsers];
  }
}

// Save users to file for persistence
function saveUsers(users) {
  try {
    fs.writeFileSync(USER_DATA_PATH, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// Load health metrics from file or initialize empty object if file doesn't exist
function loadHealthMetrics() {
  try {
    if (fs.existsSync(HEALTH_METRICS_PATH)) {
      const metricsData = fs.readFileSync(HEALTH_METRICS_PATH, 'utf8');
      return JSON.parse(metricsData);
    } else {
      // First run, create empty health metrics data
      fs.writeFileSync(HEALTH_METRICS_PATH, JSON.stringify(initialHealthMetrics, null, 2));
      return { ...initialHealthMetrics };
    }
  } catch (error) {
    console.error('Error loading health metrics data:', error);
    return { ...initialHealthMetrics };
  }
}

// Save health metrics to file for persistence
function saveHealthMetrics(metrics) {
  try {
    fs.writeFileSync(HEALTH_METRICS_PATH, JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error('Error saving health metrics data:', error);
  }
}

// Load appointments from file or initialize empty array if file doesn't exist
function loadAppointments() {
  try {
    if (fs.existsSync(APPOINTMENTS_PATH)) {
      const appointmentsData = fs.readFileSync(APPOINTMENTS_PATH, 'utf8');
      return JSON.parse(appointmentsData);
    } else {
      // First run, create empty appointments data
      fs.writeFileSync(APPOINTMENTS_PATH, JSON.stringify(initialAppointments, null, 2));
      return [...initialAppointments];
    }
  } catch (error) {
    console.error('Error loading appointments data:', error);
    return [...initialAppointments];
  }
}

// Save appointments to file for persistence
function saveAppointments(appointments) {
  try {
    fs.writeFileSync(APPOINTMENTS_PATH, JSON.stringify(appointments, null, 2));
  } catch (error) {
    console.error('Error saving appointments data:', error);
  }
}

// Export users from the loaded data
export const users = loadUsers();

// Static in-memory database
let usersDb = [...users];

// Load in-memory copies
export const healthMetrics = loadHealthMetrics();
export const appointments = loadAppointments();

// Find user by email
export function findUserByEmail(email) {
  return usersDb.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Find user by id
export function findUserById(id) {
  return usersDb.find(user => user.id === id);
}

// Create new user
export function createUser(userData) {
  // Generate ID based on user type
  const userType = userData.userType || 'patient';
  const newUser = {
    id: `${userType}-${Date.now()}`,
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  // Load the latest users from file to ensure we have the most current data
  const currentUsers = loadUsers();
  
  // Add to the users array
  currentUsers.push(newUser);
  
  // Persist to file system
  saveUsers(currentUsers);
  
  // Update in-memory database
  usersDb = [...currentUsers];
  
  return newUser;
}

// Compare password
export async function comparePassword(hashedPassword, plainPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Get all doctors
export function getAllDoctors() {
  return usersDb.filter(user => user.userType === 'doctor');
}

// Get all users (admin only)
export function getAllUsers() {
  // Reload from file to ensure we have the latest data
  const currentUsers = loadUsers();
  usersDb = [...currentUsers];
  return usersDb;
}

// Get dashboard stats
export function getDashboardStats() {
  // Reload from file to ensure we have the latest data
  const currentUsers = loadUsers();
  usersDb = [...currentUsers];
  
  const totalUsers = currentUsers.length;
  const activeDoctors = currentUsers.filter(user => user.userType === 'doctor').length;
  const activePatients = currentUsers.filter(user => user.userType === 'patient').length;
  
  // For consultations, we would normally have a separate table/collection
  // For now, we'll return a placeholder
  const consultations = 0;
  
  return {
    totalUsers,
    activeDoctors,
    activePatients,
    consultations
  };
}

// Get recent users
export function getRecentUsers(limit = 5) {
  // Reload from file to ensure we have the latest data
  const currentUsers = loadUsers();
  usersDb = [...currentUsers];
  
  // Sort by createdAt date (newest first) and take the specified limit
  return currentUsers
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      type: user.userType,
      status: 'active', // For simplicity, all users are active
      date: new Date(user.createdAt).toISOString().split('T')[0] // Format date as YYYY-MM-DD
    }));
}

// Sample users data (doctors and patients)
const sampleUsers = [
  {
    id: "d1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    userType: "doctor",
    specialty: "Cardiology",
    experience: "10 years",
    education: "Harvard Medical School",
    rating: 4.8,
    consultationFee: 150,
    availability: [
      { day: "Monday", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "12:00 PM", "4:00 PM"] }
    ]
  },
  {
    id: "d2",
    firstName: "Michael",
    lastName: "Lee",
    email: "michael.lee@example.com",
    userType: "doctor",
    specialty: "Dermatology",
    experience: "8 years",
    education: "Johns Hopkins University",
    rating: 4.6,
    consultationFee: 130,
    availability: [
      { day: "Tuesday", slots: ["9:00 AM", "11:30 AM", "2:30 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "1:30 PM", "4:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM", "12:00 PM"] }
    ]
  },
  {
    id: "d3",
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@example.com",
    userType: "doctor",
    specialty: "Pediatrics",
    experience: "12 years",
    education: "Stanford University School of Medicine",
    rating: 4.9,
    consultationFee: 140,
    availability: [
      { day: "Monday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["9:00 AM", "12:00 PM", "3:00 PM"] },
      { day: "Friday", slots: ["11:00 AM", "2:00 PM"] }
    ]
  },
  {
    id: "d4",
    firstName: "Robert",
    lastName: "Williams",
    email: "robert.williams@example.com",
    userType: "doctor",
    specialty: "Orthopedics",
    experience: "15 years",
    education: "Yale School of Medicine",
    rating: 4.7,
    consultationFee: 160,
    availability: [
      { day: "Tuesday", slots: ["9:00 AM", "12:00 PM", "3:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Saturday", slots: ["9:00 AM", "11:00 AM"] }
    ]
  },
  {
    id: "d5",
    firstName: "Lisa",
    lastName: "Rodriguez",
    email: "lisa.rodriguez@example.com",
    userType: "doctor",
    specialty: "Neurology",
    experience: "9 years",
    education: "Columbia University College of Physicians and Surgeons",
    rating: 4.5,
    consultationFee: 170,
    availability: [
      { day: "Monday", slots: ["9:00 AM", "12:00 PM", "3:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Friday", slots: ["11:00 AM", "2:00 PM"] }
    ]
  },
  {
    id: "p1",
    firstName: "James",
    lastName: "Smith",
    email: "james.smith@example.com",
    userType: "patient"
  }
];

// Find doctor by specialty
export function findDoctorsBySpecialty(specialty) {
  return sampleUsers.filter(user => 
    user.userType === "doctor" && 
    user.specialty.toLowerCase() === specialty.toLowerCase()
  );
}

// Get all specialties
export function getAllSpecialties() {
  const specialties = new Set();
  sampleUsers.forEach(user => {
    if (user.userType === "doctor" && user.specialty) {
      specialties.add(user.specialty);
    }
  });
  return Array.from(specialties);
}

// Update user health metrics
export function updateUserHealthMetrics(userId, metricsData) {
  // Load the latest metrics from file to ensure we have the most current data
  const currentMetrics = loadHealthMetrics();
  
  // Create a metrics object for this user if it doesn't exist
  if (!currentMetrics[userId]) {
    currentMetrics[userId] = {
      history: []
    };
  }
  
  // Add a timestamp to the new metrics
  const newMetricsEntry = {
    ...metricsData,
    timestamp: new Date().toISOString()
  };
  
  // Add the new metrics to the history
  currentMetrics[userId].history = currentMetrics[userId].history || [];
  currentMetrics[userId].history.push(newMetricsEntry);
  
  // Set the current metrics
  currentMetrics[userId].current = newMetricsEntry;
  
  // Persist to file system
  saveHealthMetrics(currentMetrics);
  
  return currentMetrics[userId];
}

// Get user health metrics
export function getUserHealthMetrics(userId) {
  // Load the latest metrics from file to ensure we have the most current data
  const currentMetrics = loadHealthMetrics();
  
  // Return the user's metrics or a default empty object
  return currentMetrics[userId] || { current: {}, history: [] };
}

// Create new appointment
export function createAppointment(appointmentData) {
  // Load the latest appointments from file to ensure we have the most current data
  const currentAppointments = loadAppointments();
  
  // Create a new appointment with ID and created date
  const newAppointment = {
    id: `appointment-${Date.now()}`,
    ...appointmentData,
    createdAt: new Date().toISOString()
  };
  
  // Add to appointments array
  currentAppointments.push(newAppointment);
  
  // Persist to file system
  saveAppointments(currentAppointments);
  
  return newAppointment;
}

// Update appointment (e.g. for cancellation or rescheduling)
export function updateAppointment(appointmentId, updatedData) {
  // Load the latest appointments from file to ensure we have the most current data
  const currentAppointments = loadAppointments();
  
  // Find the appointment index
  const appointmentIndex = currentAppointments.findIndex(appt => appt.id === appointmentId);
  
  // If appointment not found, return null
  if (appointmentIndex === -1) {
    return null;
  }
  
  // Update the appointment with new data
  const updatedAppointment = {
    ...currentAppointments[appointmentIndex],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };
  
  // Replace the old appointment
  currentAppointments[appointmentIndex] = updatedAppointment;
  
  // Persist to file system
  saveAppointments(currentAppointments);
  
  return updatedAppointment;
}

// Get user appointments
export function getUserAppointments(userId) {
  // Load the latest appointments from file to ensure we have the most current data
  const currentAppointments = loadAppointments();
  
  // Filter appointments for the specified user
  return currentAppointments.filter(appt => appt.patientId === userId);
}

// Get all appointments
export function getAllAppointments() {
  // Load the latest appointments from file to ensure we have the most current data
  return loadAppointments();
}

// Update user profile with health metrics
export function updateUserProfile(userId, profileData) {
  // Load the latest users from file to ensure we have the most current data
  const currentUsers = loadUsers();
  
  // Find the user
  const userIndex = currentUsers.findIndex(user => user.id === userId);
  
  // If user not found, return null
  if (userIndex === -1) {
    return null;
  }
  
  // Create a new user object with the updated data
  const updatedUser = {
    ...currentUsers[userIndex],
    ...profileData,
    updatedAt: new Date().toISOString()
  };
  
  // Replace the old user data
  currentUsers[userIndex] = updatedUser;
  
  // Persist to file system
  saveUsers(currentUsers);
  
  // Update in-memory database
  usersDb = [...currentUsers];
  
  return updatedUser;
} 