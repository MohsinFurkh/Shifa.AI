import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Path to our persisted users file
const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'registered-users.json');

// Function to read persisted users
function readPersistedUsers() {
  try {
    // Check if the file exists
    if (!fs.existsSync(USERS_FILE_PATH)) {
      // Create the directory if it doesn't exist
      const dir = path.dirname(USERS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Create the file with an empty array
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([]));
      return [];
    }
    
    const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading persisted users:', error);
    return [];
  }
}

// Function to write persisted users
function writePersistedUsers(users) {
  try {
    // Create the directory if it doesn't exist
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing persisted users:', error);
    return false;
  }
}

// Hashed password for admin (1309#Mohsin)
const adminPasswordHash = '$2a$10$FFQkquS2SZlQlWP3hf7CK.MgPnmrdqVEXI7NjgRnq3FRlHjJ4Rwey';

// Static users data
export const users = [
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
    password: '$2a$10$X6aVmLhxHVEQHGCHNwDUxOXKuAYQyI54Ko8P.vyjDj1qhtkVbUbSe', // password: doctor123
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
    password: '$2a$10$X6aVmLhxHVEQHGCHNwDUxOXKuAYQyI54Ko8P.vyjDj1qhtkVbUbSe', // password: doctor123
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
    password: '$2a$10$X6aVmLhxHVEQHGCHNwDUxOXKuAYQyI54Ko8P.vyjDj1qhtkVbUbSe', // password: doctor123
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

// Load any persisted users
const persistedUsers = readPersistedUsers();

// Static in-memory database - combine static users with persisted users
// Avoid duplicates by email
let usersDb = [...users];

// Add persisted users, checking for duplicates by email
persistedUsers.forEach(persistedUser => {
  const exists = usersDb.some(user => user.email.toLowerCase() === persistedUser.email.toLowerCase());
  if (!exists) {
    usersDb.push(persistedUser);
  }
});

// Find user by email
export function findUserByEmail(email) {
  return usersDb.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Find user by id
export function findUserById(id) {
  return usersDb.find(user => user.id === id);
}

// Create new user - now persists the user to a file
export function createUser(userData) {
  const newUser = {
    id: `patient-${Date.now()}`,
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  // Add to in-memory database
  usersDb.push(newUser);
  
  // Persist to file
  const currentUsers = readPersistedUsers();
  currentUsers.push(newUser);
  writePersistedUsers(currentUsers);
  
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