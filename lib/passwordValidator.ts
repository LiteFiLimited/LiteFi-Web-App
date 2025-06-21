/**
 * Password validation rules:
 * 1. Minimum length of 8 characters
 * 2. At least one uppercase letter
 * 3. At least one lowercase letter
 * 4. At least one digit
 * 5. At least one special character
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check for digit
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Calculate password strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (errors.length === 0) {
    strength = 'strong';
  } else if (errors.length <= 2) {
    strength = 'medium';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Password strength meter
 * Returns a number between 0 and 100 representing the password strength
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let score = 0;
  
  // Length contribution (up to 25 points)
  score += Math.min(25, password.length * 2);
  
  // Character variety contribution
  if (/[A-Z]/.test(password)) score += 10; // Uppercase
  if (/[a-z]/.test(password)) score += 10; // Lowercase
  if (/\d/.test(password)) score += 10;    // Digits
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 15; // Special chars
  
  // Variety of character types
  const charTypes = [/[A-Z]/, /[a-z]/, /\d/, /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/]
    .filter(regex => regex.test(password)).length;
  score += charTypes * 10;
  
  // Penalize repetitive patterns
  if (/(.)\1{2,}/.test(password)) score -= 10; // Same character repeated 3+ times
  
  // Cap the score at 100
  return Math.min(100, Math.max(0, score));
}

/**
 * Get color for password strength meter
 */
export function getPasswordStrengthColor(strength: number): string {
  if (strength < 30) return 'red';
  if (strength < 60) return 'orange';
  if (strength < 80) return 'yellow';
  return 'green';
} 