/**
 * User Validation Module
 * Contains all validation functions for user-related operations
 */

export function validateProfileUpdate(data) {
  const { name, email, phone, avatar } = data;
  
  if (email && !isValidEmail(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  if (phone && !isValidPhone(phone)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }
  
  return { isValid: true };
}

export function validateCompleteProfile(data) {
  const { name, phone, dateOfBirth, gender, addresses, preferences } = data;
  
  if (!name || !phone) {
    return { isValid: false, error: 'Name and phone number are required' };
  }
  
  // Validate phone number format
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
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
      return { isValid: false, error: 'You must be at least 13 years old to use this service' };
    }
  }
  
  // Validate gender
  if (gender && !['male', 'female', 'other', 'prefer-not-to-say'].includes(gender)) {
    return { isValid: false, error: 'Invalid gender selection' };
  }
  
  // Validate dietary preferences
  if (preferences?.dietary && !['none', 'veg', 'non-veg', 'jain', 'vegan'].includes(preferences.dietary)) {
    return { isValid: false, error: 'Invalid dietary preference' };
  }
  
  // Validate spice level
  if (preferences?.spiceLevel && !['mild', 'medium', 'hot'].includes(preferences.spiceLevel)) {
    return { isValid: false, error: 'Invalid spice level preference' };
  }
  
  // Validate addresses
  if (addresses && Array.isArray(addresses)) {
    for (const address of addresses) {
      if (!address.street || !address.city || !address.state || !address.pincode) {
        return { isValid: false, error: 'All address fields (street, city, state, pincode) are required' };
      }
    }
  }
  
  return { isValid: true };
}

export function validateAddress(data) {
  const { label, fullName, phone, address, city, state, pincode } = data;
  
  if (!label || !fullName || !phone || !address || !city || !state || !pincode) {
    return { isValid: false, error: 'Missing required fields' };
  }
  
  if (!isValidPhone(phone)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }
  
  return { isValid: true };
}

export function validateAddressUpdate(data) {
  const { fullName, phone, address, city, state, pincode } = data;
  
  if (fullName && fullName.trim() === '') {
    return { isValid: false, error: 'Full name cannot be empty' };
  }
  
  if (phone && !isValidPhone(phone)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }
  
  if (address && address.trim() === '') {
    return { isValid: false, error: 'Address cannot be empty' };
  }
  
  if (city && city.trim() === '') {
    return { isValid: false, error: 'City cannot be empty' };
  }
  
  if (state && state.trim() === '') {
    return { isValid: false, error: 'State cannot be empty' };
  }
  
  if (pincode && pincode.trim() === '') {
    return { isValid: false, error: 'Pincode cannot be empty' };
  }
  
  return { isValid: true };
}

export function validatePasswordChange(data) {
  const { currentPassword, newPassword } = data;
  
  if (!currentPassword || !newPassword) {
    return { isValid: false, error: 'Current password and new password are required' };
  }
  
  if (newPassword.length < 6) {
    return { isValid: false, error: 'New password must be at least 6 characters long' };
  }
  
  return { isValid: true };
}

// Helper validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

export { isValidEmail, isValidPhone };
