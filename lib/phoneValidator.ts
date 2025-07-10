/**
 * Phone number validation utilities
 */

export interface PhoneValidationResult {
  isValid: boolean;
  isNigerian: boolean;
  requiresVerification: boolean;
  formattedNumber: string;
  errors: string[];
}

/**
 * Check if a phone number is Nigerian
 * @deprecated This function is kept for backwards compatibility but all numbers are now treated uniformly
 */
export function isNigerianNumber(phone: string): boolean {
  // Always return false since we now treat all numbers as international
  return false;
}

/**
 * Format a phone number for display - now treats all numbers uniformly
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  // For all numbers, return as international format with + prefix if not present
  return phone.startsWith('+') ? phone : `+${cleanPhone}`;
}

/**
 * Validate a phone number - now treats all numbers uniformly
 */
export function validatePhoneNumber(phone: string): PhoneValidationResult {
  const errors: string[] = [];
  let isValid = true;
  let formattedNumber = '';
  
  if (!phone || phone.trim().length === 0) {
    errors.push('Phone number is required');
    isValid = false;
  } else {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check minimum length
    if (cleanPhone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
      isValid = false;
    }
    
    // Check maximum length
    if (cleanPhone.length > 15) {
      errors.push('Phone number cannot exceed 15 digits');
      isValid = false;
    }
    
    formattedNumber = formatPhoneNumber(phone);
  }
  
  // All numbers are now treated as international (no SMS verification required)
  const isNigerian = false;
  const requiresVerification = false;
  
  return {
    isValid,
    isNigerian,
    requiresVerification,
    formattedNumber,
    errors
  };
}

/**
 * Get phone number info for display - now treats all numbers uniformly
 */
export function getPhoneNumberInfo(phone: string): {
  country: string;
  requiresVerification: boolean;
  verificationMethod: string;
} {
  // All numbers are now treated as international
  return {
    country: 'International',
    requiresVerification: false,
    verificationMethod: 'Automatic verification (saved in international format)'
  };
} 