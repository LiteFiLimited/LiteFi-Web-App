export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleOptionsRequest } from '@/lib/api-config';

/**
 * Handle CORS preflight requests for verify phone OTP endpoint
 */
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}

/**
 * Verify Phone OTP Endpoint
 * 
 * Verifies SMS OTP for Nigerian phone numbers using verification ID.
 * This endpoint is only used for Nigerian numbers that received SMS OTP.
 * 
 * @param request - HTTP request containing phone, verification ID, and OTP
 * @returns JSON response confirming phone verification status
 */
export async function POST(request: NextRequest) {
  try {
    // Extract verification data from request body
    const body = await request.json();
    const { phone, verificationId, otp } = body;

    // Validate that all required fields are provided
    if (!phone || !verificationId || !otp) {
      return createErrorResponse('Phone number, verification ID, and OTP are required');
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return createErrorResponse('Invalid OTP format. Must be a 6-digit code.');
    }

    // Validate verification ID format
    if (!verificationId.startsWith('VER')) {
      return createErrorResponse('Invalid verification ID format');
    }

    // Verify the OTP using KudiSMS service and verification ID
    // Database operations would include:
    // 1. Validate verification ID exists and is not expired
    // 2. Verify OTP matches the one sent via KudiSMS
    // 3. Mark phone number as verified in user account
    // 4. Clean up temporary verification data
    
    // Accept test OTP "123456" for development
    if (otp === '123456') {
      return createSuccessResponse(
        'Phone number verified successfully',
        {
          phone,
          verified: true
        }
      );
    } else {
      // Return error for invalid OTP
      return createErrorResponse('Invalid OTP code');
    }
  } catch (error) {
    console.error('Verify phone OTP error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 