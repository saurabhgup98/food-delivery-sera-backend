import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  avatar: {
    type: String,
    default: ''
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other']
    },
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  preferences: {
    dietaryRestrictions: [String],
    favoriteCuisines: [String],
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot']
    }
  },
  settings: {
    notifications: {
      email: { type: Boolean },
      push: { type: Boolean },
      sms: { type: Boolean }
    },
    preferences: {
      dietary: { type: String, enum: ['none', 'veg', 'non-veg', 'jain', 'vegan'] },
      spiceLevel: { type: String, enum: ['mild', 'medium', 'hot'] },
      language: { type: String },
      currency: { type: String }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.models.User || mongoose.model('User', userSchema);
