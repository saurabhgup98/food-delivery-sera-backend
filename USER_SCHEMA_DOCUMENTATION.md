# User Schema Documentation

## Overview
The User schema has been completely restructured to support comprehensive personal details for the food delivery application. The schema uses email as the primary bridge key to connect with the simple-authentication service.

## Schema Structure

### Primary Identifiers
- **email**: Primary bridge key from simple-auth service (unique, indexed)
- **authUserId**: Reference to simple-auth user ID (unique, indexed)

### Personal Details
- **fullName**: User's full name (required)
- **phone**: Phone number with country code (required, validated)
- **countryCode**: Country code (required, validated)
- **dateOfBirth**: Date of birth (optional)
- **gender**: Gender preference (optional: male, female, other, prefer-not-to-say)

### Delivery Addresses (Array)
Each address contains:
- **addressType**: Home, Work, or Other
- **fullName**: Name for delivery
- **phone**: Contact phone number
- **address**: Street address
- **country**: Country name
- **state**: State/Province
- **city**: City name
- **pincode**: Postal/ZIP code
- **deliveryInstructions**: Special delivery instructions (optional)
- **isDefault**: Boolean flag for default address

### Food Preferences
- **dietaryPreferences**: Array of dietary restrictions
  - Options: vegetarian, vegan, jain, halal, kosher, gluten-free, dairy-free, nut-free
- **allergies**: Object with fixed and custom allergies
  - **fixed**: Predefined allergies (nuts, dairy, gluten, seafood, eggs)
  - **custom**: User-defined allergies (free text)
- **spiceLevel**: Spice preference (mild, medium, hot, extra-hot)
- **caloriePreference**: Calorie preference (low, moderate, high)
- **preferredCuisines**: Array of preferred cuisines
  - Options: indian, chinese, italian, mexican, thai, japanese, mediterranean, american

## Database Indexes
- `email` (unique)
- `authUserId` (unique)
- `personalDetails.phone`

## Validation Rules
- Email: Required, unique, lowercase, trimmed
- Phone: Required, international format validation
- Country Code: Required, format validation
- Address Type: Required, enum validation
- All enum fields: Strict validation against predefined options

## Sample Data Structure

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john.doe@example.com",
  "authUserId": "auth_123456789",
  "personalDetails": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "countryCode": "+1",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "gender": "male"
  },
  "addresses": [
    {
      "_id": "address_1",
      "addressType": "Home",
      "fullName": "John Doe",
      "phone": "+1234567890",
      "address": "123 Main Street, Apt 4B",
      "country": "United States",
      "state": "California",
      "city": "San Francisco",
      "pincode": "94102",
      "deliveryInstructions": "Ring doorbell twice",
      "isDefault": true
    }
  ],
  "foodPreferences": {
    "dietaryPreferences": ["vegetarian", "gluten-free"],
    "allergies": {
      "fixed": ["nuts", "dairy"],
      "custom": ["sesame", "mustard"]
    },
    "spiceLevel": "medium",
    "caloriePreference": "moderate",
    "preferredCuisines": ["indian", "italian", "thai"]
  },
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:45:00.000Z"
}
```

## Migration
A migration script is available at `src/scripts/migrateUserSchema.ts` to help migrate existing user data to the new schema structure.

## Integration with Simple-Auth
The schema is designed to work seamlessly with the simple-authentication service:
1. User logs in through simple-auth
2. JWT token contains userId and email
3. Food delivery backend uses email to find/update user data
4. All user-specific data is stored in the food delivery database

## Files Modified
- `src/types/index.ts` - Updated TypeScript interfaces
- `src/models/User.ts` - Updated MongoDB schema
- `src/samples/userSampleData.ts` - Sample data examples
- `src/scripts/migrateUserSchema.ts` - Migration script

## Next Steps
1. Run the migration script to update existing data
2. Update authentication middleware to extract email from JWT
3. Create user controllers for CRUD operations
4. Implement user sync service for automatic user creation
