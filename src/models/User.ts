import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IAddress, IUserPreferences } from '../types/index.js';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: string;
  authUserId: string;
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
  // Reference to simple-auth user ID
  authUserId: {
    type: String,
    required: [true, 'Auth user ID is required'],
    unique: true,
    index: true,
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
  addresses: [addressSchema],
  preferences: {
    type: userPreferencesSchema,
    default: () => ({}),
  },
}, {
  timestamps: true,
});

// Index for better query performance
userSchema.index({ authUserId: 1 });
userSchema.index({ phone: 1 });

// Virtual for full name (will be fetched from simple-auth service)
userSchema.virtual('fullName').get(function () {
  return 'User'; // Placeholder, actual name will come from simple-auth
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
