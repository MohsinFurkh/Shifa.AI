import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Check if User model already exists to prevent overwrite during hot reload
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  userType: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', '']
  },
  bloodType: {
    type: String
  },
  allergies: {
    type: String
  },
  medicalConditions: {
    type: String
  },
  medications: {
    type: String
  },
  // For doctors
  specialty: {
    type: String
  },
  experience: {
    type: String
  },
  education: {
    type: String
  },
  // Password reset fields
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Use mongoose.models to check if the model exists already to prevent overwrite error
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User; 