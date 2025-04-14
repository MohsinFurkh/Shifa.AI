import bcrypt from 'bcryptjs';

// Get the hashed passwords from static-data.js
import { users } from '../lib/static-data.js';

async function verifyPasswords() {
  console.log('Verifying passwords for all users...');
  
  const adminUser = users.find(user => user.userType === 'admin');
  const doctorUser = users.find(user => user.userType === 'doctor');
  const patientUser = users.find(user => user.userType === 'patient');
  
  console.log('\nAdmin user:');
  console.log('Email:', adminUser.email);
  console.log('Testing admin123:', await bcrypt.compare('admin123', adminUser.password));
  
  console.log('\nDoctor user:');
  console.log('Email:', doctorUser.email);
  console.log('Testing doctor123:', await bcrypt.compare('doctor123', doctorUser.password));
  
  console.log('\nPatient user:');
  console.log('Email:', patientUser.email);
  console.log('Testing patient123:', await bcrypt.compare('patient123', patientUser.password));
  console.log('Testing doctor123 (should work now):', await bcrypt.compare('doctor123', patientUser.password));
}

verifyPasswords().catch(console.error); 