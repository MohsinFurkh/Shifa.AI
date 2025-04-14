import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Path to the file where we'll store user data between server restarts
const USER_DATA_PATH = path.join(process.cwd(), 'data', 'users.json');

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

// Export users from the loaded data
export const users = loadUsers();

// Static in-memory database
let usersDb = [...users];

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
  const newUser = {
    id: `patient-${Date.now()}`,
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  // Add to in-memory database
  usersDb.push(newUser);
  
  // Also add to the original users array
  users.push(newUser);
  
  // Persist to file system
  saveUsers(users);
  
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
  return usersDb;
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