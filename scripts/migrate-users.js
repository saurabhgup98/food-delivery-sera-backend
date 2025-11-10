/**
 * Data Migration Script: Migrate existing users to simple-auth service
 * 
 * This script helps migrate existing users from the food delivery app
 * to the simple authentication service.
 * 
 * Usage:
 * 1. Ensure both databases are accessible
 * 2. Run: node scripts/migrate-users.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Old User Schema (from food delivery app)
const oldUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  avatar: String,
  role: String,
  isVerified: Boolean,
  addresses: [{
    type: String,
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean,
    specialInstructions: String,
  }],
  preferences: {
    dietaryRestrictions: [String],
    allergies: [String],
    spiceLevel: String,
    caloriePreference: String,
    preferredCuisines: [String],
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
}, { timestamps: true });

const OldUser = mongoose.model('OldUser', oldUserSchema);

// New User Schema (simplified for food delivery app)
const newUserSchema = new mongoose.Schema({
  authUserId: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  avatar: String,
  addresses: [{
    label: String,
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean,
    specialInstructions: String,
  }],
  preferences: {
    dietaryRestrictions: [String],
    allergies: [String],
    spiceLevel: String,
    caloriePreference: String,
    preferredCuisines: [String],
  },
}, { timestamps: true });

const NewUser = mongoose.model('NewUser', newUserSchema);

// Simple Auth API configuration
const SIMPLE_AUTH_API_URL = 'https://simple-auth-service.vercel.app/api';
const FOOD_DELIVERY_APP_URL = 'https://food-delivery-app-frontend.vercel.app';

/**
 * Register user in simple-auth service
 */
async function registerUserInSimpleAuth(userData) {
  try {
    const response = await fetch(`${SIMPLE_AUTH_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password || 'TempPassword123!', // Temporary password
        appName: FOOD_DELIVERY_APP_URL,
        role: userData.role === 'restaurant_owner' ? 'business-user' : 'user',
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data.user.id;
    } else {
      console.error(`Failed to register user ${userData.email}:`, result.error);
      return null;
    }
  } catch (error) {
    console.error(`Error registering user ${userData.email}:`, error);
    return null;
  }
}

/**
 * Create new user record in food delivery app
 */
async function createNewUserRecord(oldUser, authUserId) {
  try {
    const newUser = new NewUser({
      authUserId,
      phone: oldUser.phone,
      avatar: oldUser.avatar,
      addresses: oldUser.addresses || [],
      preferences: oldUser.preferences || {},
      createdAt: oldUser.createdAt,
      updatedAt: oldUser.updatedAt,
    });

    await newUser.save();
    console.log(`✅ Created new user record for ${oldUser.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create new user record for ${oldUser.email}:`, error);
    return false;
  }
}

/**
 * Main migration function
 */
async function migrateUsers() {
  try {
    console.log('🚀 Starting user migration...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB');

    // Get all existing users
    const oldUsers = await OldUser.find({});
    console.log(`📋 Found ${oldUsers.length} users to migrate`);

    let successCount = 0;
    let errorCount = 0;

    for (const oldUser of oldUsers) {
      console.log(`\n🔄 Migrating user: ${oldUser.email}`);
      
      try {
        // Register user in simple-auth service
        const authUserId = await registerUserInSimpleAuth(oldUser);
        
        if (authUserId) {
          // Create new user record in food delivery app
          const created = await createNewUserRecord(oldUser, authUserId);
          
          if (created) {
            successCount++;
            console.log(`✅ Successfully migrated user: ${oldUser.email}`);
          } else {
            errorCount++;
          }
        } else {
          errorCount++;
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error migrating user ${oldUser.email}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} users`);
    console.log(`❌ Failed to migrate: ${errorCount} users`);
    console.log(`📋 Total users processed: ${oldUsers.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

/**
 * Rollback function (if needed)
 */
async function rollbackMigration() {
  try {
    console.log('🔄 Starting rollback...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Delete all new user records
    const result = await NewUser.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} new user records`);
    
    console.log('✅ Rollback completed');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run migration
if (process.argv[2] === 'rollback') {
  rollbackMigration();
} else {
  migrateUsers();
}