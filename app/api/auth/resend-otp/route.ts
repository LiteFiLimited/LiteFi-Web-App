
import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleOptionsRequest } from '@/lib/api-config';

// Helper function to check if a phone number is Nigerian
function isNigerianNumber(phone: string): boolean {
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
  const nigerianPrefixes = ['0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709',
                           '0802', '0803', '0804', '0805', '0806', '0807', '0808', '0809',
                           '0810', '0811', '0812', '0813', '0814', '0815', '0816', '0817', '0818', '0819',
                           '0901', '0902', '0903', '0904', '0905', '0906', '0907', '0908', '0909',
                           '0912', '0913', '0915', '0916', '0917', '0918'];
  
  return nigerianPrefixes.some(prefix => cleanPhone.startsWith(prefix));
}

/**
 * Handle CORS preflight requests for resend OTP endpoint
 */
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}

/**
 * Resend OTP Endpoint
 * 
 * Resends verification codes for email or phone number verification.
 * For phone OTP, this endpoint now delegates to the send-phone-otp flow.
 * 
 * @param request - HTTP request containing email/phone and OTP type
 * @returns JSON response confirming OTP was resent
 */
export async function POST(request: NextRequest) {
  try {
    // Extract OTP resend data from request body
    const body = await request.json();
    const { email, phone, type } = body;

    // Determine OTP type based on provided parameters
    let otpType = type;
    if (!otpType) {
      if (email) {
        otpType = 'email';
      } else if (phone) {
        otpType = 'phone';
      } else {
        return createErrorResponse('Either email or phone must be provided');
      }
    }

    if (otpType === 'email') {
      // Validate email format if provided
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return createErrorResponse('Invalid email format');
        }
      }

      // Resend email verification OTP
      // Database operations would include:
      // 1. Get user info from email
      // 2. Check if email is already verified
      // 3. If already verified, return success with appropriate message
      // 4. If not verified, generate a new email OTP
      // 5. Send the verification email
      // 6. Update the database with the new OTP

      return createSuccessResponse('Verification email sent successfully');
    } else if (otpType === 'phone') {
      if (!phone) {
        return createErrorResponse('Phone number is required for phone OTP');
      }

      // In real implementation, check if phone is already verified
      // For demo purposes, simulate already verified phone for specific case
      if (phone === '+2348012345678' || phone === '08012345678') {
        return createSuccessResponse('Phone already verified', { alreadyVerified: true });
      }

      // Check if phone number is Nigerian for SMS OTP eligibility
      const isNigerian = isNigerianNumber(phone);

      if (isNigerian) {
        // For Nigerian numbers, generate new verification ID and send SMS OTP
        // This follows the same flow as send-phone-otp endpoint
        const verificationId = `VER${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
        
        // Database operations would include:
        // 1. Check if phone is already verified
        // 2. If already verified, return success with appropriate message
        // 3. If not verified, generate a new SMS OTP and verification ID
        // 4. Send the OTP via KudiSMS API
        // 5. Update the database with the new OTP and verification ID

        return createSuccessResponse(
          'SMS OTP sent successfully',
          {
            isNigerianNumber: true,
            requiresOtp: true,
            verificationId,
            phone
          }
        );
      } else {
        // International numbers don't require OTP (auto-verified)
        return createErrorResponse('OTP not required for international numbers');
      }
    } else {
      return createErrorResponse('Invalid OTP type. Must be "email" or "phone"');
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 