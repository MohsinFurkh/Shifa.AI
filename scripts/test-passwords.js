import bcrypt from 'bcryptjs';

// These are the password hashes from static-data.js
const adminPasswordHash = '$2a$10$FFQkquS2SZlQlWP3hf7CK.MgPnmrdqVEXI7NjgRnq3FRlHjJ4Rwey';
const doctorPasswordHash = '$2a$10$X6aVmLhxHVEQHGCHNwDUxOXKuAYQyI54Ko8P.vyjDj1qhtkVbUbSe';

// Test different password combinations
async function testPasswords() {
  console.log('Testing admin password:');
  console.log('1309#Mohsin:', await bcrypt.compare('1309#Mohsin', adminPasswordHash));
  console.log('admin123:', await bcrypt.compare('admin123', adminPasswordHash));
  
  console.log('\nTesting doctor password:');
  console.log('doctor123:', await bcrypt.compare('doctor123', doctorPasswordHash));
  
  // Generate new hashes for admin and doctor passwords
  console.log('\nGenerating new hashes for reference:');
  const salt = await bcrypt.genSalt(10);
  console.log('New hash for 1309#Mohsin:', await bcrypt.hash('1309#Mohsin', salt));
  console.log('New hash for admin123:', await bcrypt.hash('admin123', salt));
  console.log('New hash for doctor123:', await bcrypt.hash('doctor123', salt));
}

testPasswords().catch(console.error); 