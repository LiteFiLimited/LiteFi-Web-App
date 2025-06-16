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
 */
export function isNigerianNumber(phone: string): boolean {
  if (!phone) return false;
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check for Nigerian patterns
  // +234 format: starts with 234
  if (cleanPhone.startsWith('234') && cleanPhone.length === 13) {
    return true;
  }
  
  // Local format: starts with 0 and has 11 digits
  if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    return true;
  }
  
  // Check for common Nigerian prefixes (without country code)
  const nigerianPrefixes = [
    '0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709',
    '0802', '0803', '0804', '0805', '0806', '0807', '0808', '0809',
    '0810', '0811', '0812', '0813', '0814', '0815', '0816', '0817', '0818', '0819',
    '0901', '0902', '0903', '0904', '0905', '0906', '0907', '0908', '0909',
    '0912', '0913', '0915', '0916', '0917', '0918'
  ];
  
  return nigerianPrefixes.some(prefix => cleanPhone.startsWith(prefix));
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Nigerian number formatting
  if (isNigerianNumber(phone)) {
    if (cleanPhone.startsWith('234')) {
      // +234 format
      return `+${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)} ${cleanPhone.slice(9)}`;
    } else if (cleanPhone.startsWith('0')) {
      // Local format
      return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
    }
  }
  
  // For international numbers, return as is with + prefix if not present
  return phone.startsWith('+') ? phone : `+${cleanPhone}`;
}

/**
 * Validate a phone number
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
  
  const isNigerian = isNigerianNumber(phone);
  const requiresVerification = isNigerian; // Only Nigerian numbers require OTP verification
  
  return {
    isValid,
    isNigerian,
    requiresVerification,
    formattedNumber,
    errors
  };
}

/**
 * Get phone number info for display
 */
export function getPhoneNumberInfo(phone: string): {
  country: string;
  requiresVerification: boolean;
  verificationMethod: string;
} {
  const isNigerian = isNigerianNumber(phone);
  
  if (isNigerian) {
    return {
      country: 'Nigeria',
      requiresVerification: true,
      verificationMethod: 'SMS OTP via KudiSMS'
    };
  } else {
    return {
      country: 'International',
      requiresVerification: false,
      verificationMethod: 'Manual verification by admin'
    };
  }
} 