// Sample User Data for Food Delivery App
// This file demonstrates how the User schema works with comprehensive personal details

import { IUser } from '../types/index.js';

export const sampleUserData: IUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'john.doe@example.com',
  authUserId: 'auth_123456789',
  
  // Personal Details
  personalDetails: {
    fullName: 'John Doe',
    phone: '+1234567890',
    countryCode: '+1',
    dateOfBirth: new Date('1990-05-15'),
    gender: 'male'
  },
  
  // Delivery Addresses
  addresses: [
    {
      _id: 'address_1',
      addressType: 'Home',
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '123 Main Street, Apt 4B',
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      pincode: '94102',
      deliveryInstructions: 'Ring doorbell twice, leave at door if no answer',
      isDefault: true
    },
    {
      _id: 'address_2',
      addressType: 'Work',
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '456 Business Avenue, Floor 10, Suite 1001',
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      pincode: '94105',
      deliveryInstructions: 'Leave at reception desk, ask for Sarah',
      isDefault: false
    },
    {
      _id: 'address_3',
      addressType: 'Other',
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '789 Weekend Retreat, Cabin 12',
      country: 'United States',
      state: 'California',
      city: 'Lake Tahoe',
      pincode: '96150',
      deliveryInstructions: 'Gate code: 1234, leave at cabin door',
      isDefault: false
    }
  ],
  
  // Food Preferences
  foodPreferences: {
    dietaryPreferences: ['vegetarian', 'gluten-free'],
    allergies: {
      fixed: ['nuts', 'dairy'],
      custom: ['sesame', 'mustard', 'sulfites']
    },
    spiceLevel: 'medium',
    caloriePreference: 'moderate',
    preferredCuisines: ['indian', 'italian', 'thai', 'mediterranean']
  },
  
  // Optional fields
  avatar: 'https://example.com/avatars/john-doe.jpg',
  
  // Timestamps
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-20T14:45:00Z')
};

// Sample data for different user types
export const sampleVeganUser: Partial<IUser> = {
  email: 'jane.vegan@example.com',
  authUserId: 'auth_987654321',
  personalDetails: {
    fullName: 'Jane Smith',
    phone: '+1987654321',
    countryCode: '+1',
    dateOfBirth: new Date('1995-08-22'),
    gender: 'female'
  },
  foodPreferences: {
    dietaryPreferences: ['vegan', 'gluten-free'],
    allergies: {
      fixed: ['dairy', 'eggs'],
      custom: ['soy', 'quinoa']
    },
    spiceLevel: 'hot',
    caloriePreference: 'low',
    preferredCuisines: ['indian', 'thai', 'mediterranean']
  }
};

export const sampleJainUser: Partial<IUser> = {
  email: 'raj.jain@example.com',
  authUserId: 'auth_456789123',
  personalDetails: {
    fullName: 'Raj Patel',
    phone: '+919876543210',
    countryCode: '+91',
    dateOfBirth: new Date('1988-12-03'),
    gender: 'male'
  },
  foodPreferences: {
    dietaryPreferences: ['jain', 'vegetarian'],
    allergies: {
      fixed: ['nuts'],
      custom: ['onion', 'garlic', 'root vegetables']
    },
    spiceLevel: 'mild',
    caloriePreference: 'moderate',
    preferredCuisines: ['indian', 'italian']
  }
};

// Sample data for testing different scenarios
export const sampleMinimalUser: Partial<IUser> = {
  email: 'minimal@example.com',
  authUserId: 'auth_minimal_123',
  personalDetails: {
    fullName: 'Minimal User',
    phone: '+1555123456',
    countryCode: '+1'
    // No optional fields
  },
  foodPreferences: {
    dietaryPreferences: [],
    allergies: {
      fixed: [],
      custom: []
    },
    spiceLevel: 'medium',
    caloriePreference: 'moderate',
    preferredCuisines: []
  }
};

// Export all sample data
export const allSampleUsers = [
  sampleUserData,
  sampleVeganUser,
  sampleJainUser,
  sampleMinimalUser
];
