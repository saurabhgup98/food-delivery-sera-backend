import mongoose, { Document, Schema } from 'mongoose';
import { IUser, IAddress, IPersonalDetails, IFoodPreferences } from '../types/index.js';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: string;
  email: string;
  authUserId: string;
}

// Personal Details Schema
const personalDetailsSchema = new Schema<IPersonalDetails>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'],
    trim: true,
  },
  countryCode: {
    type: String,
    required: [true, 'Country code is required'],
    match: [/^\+[1-9]\d{0,3}$/, 'Invalid country code format'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    optional: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    optional: true,
  },
});

// Address Schema
const addressSchema = new Schema<IAddress>({
  addressType: {
    type: String,
    required: [true, 'Address type is required'],
    enum: ['Home', 'Work', 'Other'],
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
    match: [/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
  },
  deliveryInstructions: {
    type: String,
    trim: true,
    optional: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Food Preferences Schema
const foodPreferencesSchema = new Schema<IFoodPreferences>({
  dietaryPreferences: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'jain', 'halal', 'kosher', 'gluten-free', 'dairy-free', 'nut-free'],
  }],
  allergies: {
    fixed: [{
      type: String,
      enum: ['nuts', 'dairy', 'gluten', 'seafood', 'eggs'],
    }],
    custom: [{
      type: String,
      trim: true,
    }],
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra-hot'],
    default: 'medium',
  },
  caloriePreference: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate',
  },
  preferredCuisines: [{
    type: String,
    enum: ['indian', 'chinese', 'italian', 'mexican', 'thai', 'japanese', 'mediterranean', 'american'],
  }],
});

const userSchema = new Schema<IUserDocument>({
  // Primary bridge key - email from simple-auth
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  // Reference to simple-auth user ID
  authUserId: {
    type: String,
    required: [true, 'Auth user ID is required'],
    unique: true,
    index: true,
  },
  // Personal details
  personalDetails: {
    type: personalDetailsSchema,
    required: true,
  },
  // Delivery addresses
  addresses: [addressSchema],
  // Food preferences
  foodPreferences: {
    type: foodPreferencesSchema,
    default: () => ({
      dietaryPreferences: [],
      allergies: {
        fixed: [],
        custom: [],
      },
      spiceLevel: 'medium',
      caloriePreference: 'moderate',
      preferredCuisines: [],
    }),
  },
  // Optional avatar
  avatar: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ authUserId: 1 });
userSchema.index({ 'personalDetails.phone': 1 });

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
