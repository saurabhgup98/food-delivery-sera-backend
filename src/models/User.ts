import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IAddress, IUserPreferences } from '../types/index.js';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>({
  label: {
    type: String,
    required: [true, 'Address label is required'],
    trim: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  specialInstructions: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const userPreferencesSchema = new Schema<IUserPreferences>({
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'jain', 'non-vegetarian', 'gluten-free', 'dairy-free'],
  }],
  allergies: [{
    type: String,
    trim: true,
  }],
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot'],
    default: 'medium',
  },
  caloriePreference: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  preferredCuisines: [{
    type: String,
    trim: true,
  }],
});

const userSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
      'Please enter a valid phone number',
    ],
  },
  avatar: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'restaurant_owner'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  addresses: [addressSchema],
  preferences: {
    type: userPreferencesSchema,
    default: () => ({}),
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      if ('password' in ret) {
        delete (ret as any).password;
      }
      return ret;
    },
  },
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env['BCRYPT_ROUNDS'] || '12'));
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods['matchPassword'] = async function (enteredPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(enteredPassword, this['password']);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return this.name;
});

// Ensure only one default address per user
userSchema.pre('save', function (next) {
  if (this.addresses && this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
    if (defaultAddresses.length > 1) {
      // Keep only the first default address
      let foundFirst = false;
      this.addresses.forEach(addr => {
        if (addr.isDefault && !foundFirst) {
          foundFirst = true;
        } else if (addr.isDefault) {
          addr.isDefault = false;
        }
      });
    }
  }
  next();
});

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
