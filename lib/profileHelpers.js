import User from '../models/User.js';

// Complete user profile
export async function handleCompleteProfile(req, res, userId) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      addresses,
      preferences,
      settings
    } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and phone number are required' 
      });
    }

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 10-digit phone number' 
      });
    }

    // Validate date of birth (must be at least 13 years old)
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        return res.status(400).json({ 
          success: false, 
          message: 'You must be at least 13 years old to use this service' 
        });
      }
    }

    // Validate gender
    if (gender && !['male', 'female', 'other', 'prefer-not-to-say'].includes(gender)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid gender selection' 
      });
    }

    // Validate dietary preferences
    if (preferences?.dietary && !['none', 'veg', 'non-veg', 'jain', 'vegan'].includes(preferences.dietary)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid dietary preference' 
      });
    }

    // Validate spice level
    if (preferences?.spiceLevel && !['mild', 'medium', 'hot'].includes(preferences.spiceLevel)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid spice level preference' 
      });
    }

    // Validate addresses
    if (addresses && Array.isArray(addresses)) {
      for (const address of addresses) {
        if (!address.street || !address.city || !address.state || !address.pincode) {
          return res.status(400).json({ 
            success: false, 
            message: 'All address fields (street, city, state, pincode) are required' 
          });
        }
      }
    }

    // Update user profile
    const updateData = {
      name,
      phone,
      isProfileComplete: true
    };

    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (addresses) updateData.addresses = addresses;
    if (preferences) updateData.preferences = preferences;
    if (settings) updateData.settings = settings;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
