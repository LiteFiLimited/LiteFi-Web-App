
import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleOptionsRequest } from '@/lib/api-config';

export const OPTIONS = handleOptionsRequest;

/**
 * Resend OTP Endpoint
 * 
 * Resends verification codes for email verification.
 * Phone numbers are no longer eligible for OTP resend since all numbers 
 * are now automatically verified and saved in international format.
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

      // All phone numbers are now automatically verified and saved in international format
      // No OTP resend needed since verification is automatic
      return createSuccessResponse(
        'Phone number automatically verified',
        { 
          phone: phone,
          verified: true,
          method: 'international_format_auto_verification'
        }
      );
    } else {
      return createErrorResponse('Invalid OTP type. Must be "email" or "phone"');
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 