const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check if the User model already exists to prevent overwriting during hot reloads
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  try {
    console.log('[MODEL] User: Pre-save hook executed');
    
    // Only hash the password if it's modified or new
    if (!this.isModified('password')) {
      console.log('[MODEL] User: Password not modified, skipping hash');
      return next();
    }
    
    console.log('[MODEL] User: Hashing password');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('[MODEL] User: Password hashed successfully');
    next();
  } catch (error) {
    console.error('[MODEL] User: Error hashing password:', error);
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('[MODEL] User: Comparing passwords');
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('[MODEL] User: Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('[MODEL] User: Error comparing passwords:', error);
    return false;
  }
};

// If model already exists, use it, otherwise create a new one
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User; 