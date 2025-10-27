// Migration script for User schema updates
// This script helps migrate existing user data to the new comprehensive schema

import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

interface LegacyUser {
  _id: string;
  authUserId: string;
  phone?: string;
  avatar?: string;
  addresses?: any[];
  preferences?: any;
  createdAt: Date;
  updatedAt: Date;
}

async function migrateUserSchema() {
  try {
    console.log('🔄 Starting User schema migration...');
    
    // Connect to database
    await connectDB();
    
    // Get all existing users
    const existingUsers = await User.find({});
    console.log(`📊 Found ${existingUsers.length} existing users to migrate`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const user of existingUsers) {
      try {
        const legacyUser = user as any;
        
        // Check if user already has new schema structure
        if (legacyUser.email && legacyUser.personalDetails) {
          console.log(`⏭️  User ${legacyUser._id} already migrated, skipping...`);
          continue;
        }
        
        // Create migration data
        const migrationData: any = {};
        
        // Add email field (this should come from simple-auth service)
        if (!legacyUser.email) {
          // For existing users without email, we'll need to fetch from simple-auth
          // This is a placeholder - in production, you'd call the simple-auth API
          migrationData.email = `migrated_${legacyUser.authUserId}@example.com`;
          console.log(`⚠️  Warning: User ${legacyUser._id} missing email, using placeholder`);
        }
        
        // Migrate personal details
        migrationData.personalDetails = {
          fullName: 'Migrated User', // This should come from simple-auth
          phone: legacyUser.phone || '+1000000000',
          countryCode: '+1', // Default, should be extracted from phone
          dateOfBirth: undefined,
          gender: undefined
        };
        
        // Migrate addresses
        if (legacyUser.addresses && legacyUser.addresses.length > 0) {
          migrationData.addresses = legacyUser.addresses.map((addr: any) => ({
            addressType: addr.label || 'Other',
            fullName: addr.fullName || 'User',
            phone: addr.phone || migrationData.personalDetails.phone,
            address: addr.address,
            country: 'United States', // Default, should be extracted
            state: addr.state,
            city: addr.city,
            pincode: addr.pincode,
            deliveryInstructions: addr.specialInstructions,
            isDefault: addr.isDefault || false
          }));
        }
        
        // Migrate food preferences
        if (legacyUser.preferences) {
          migrationData.foodPreferences = {
            dietaryPreferences: legacyUser.preferences.dietaryRestrictions || [],
            allergies: {
              fixed: [],
              custom: legacyUser.preferences.allergies || []
            },
            spiceLevel: legacyUser.preferences.spiceLevel || 'medium',
            caloriePreference: legacyUser.preferences.caloriePreference || 'moderate',
            preferredCuisines: legacyUser.preferences.preferredCuisines || []
          };
        } else {
          // Default food preferences
          migrationData.foodPreferences = {
            dietaryPreferences: [],
            allergies: {
              fixed: [],
              custom: []
            },
            spiceLevel: 'medium',
            caloriePreference: 'moderate',
            preferredCuisines: []
          };
        }
        
        // Update user with new schema
        await User.findByIdAndUpdate(
          legacyUser._id,
          { $set: migrationData },
          { new: true, runValidators: true }
        );
        
        migratedCount++;
        console.log(`✅ Migrated user ${legacyUser._id}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating user ${user._id}:`, error);
      }
    }
    
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📊 Total processed: ${existingUsers.length} users`);
    
    if (errorCount > 0) {
      console.log('\n⚠️  Some users failed to migrate. Please check the errors above.');
    } else {
      console.log('\n🎉 All users migrated successfully!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateUserSchema()
    .then(() => {
      console.log('🏁 Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default migrateUserSchema;