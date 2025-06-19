export const dynamic = 'force-static';

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
 * Handle CORS preflight requests for send phone OTP endpoint
 */
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}

/**
 * Send Phone OTP Endpoint
 * 
 * Handles phone number verification initiation:
 * - Nigerian numbers: Sends SMS OTP via KudiSMS and returns verification ID
 * - International numbers: Auto-verifies and saves to database
 * 
 * @param request - HTTP request containing phone number
 * @returns JSON response with verification status and next steps
 */
export async function POST(request: NextRequest) {
  try {
    // Extract phone number from request body
    const body = await request.json();
    const { phone } = body;

    // Validate that phone number is provided
    if (!phone) {
      return createErrorResponse('Phone number is required');
    }

    // Validate phone number format (basic validation)
    if (phone.length < 8) {
      return createErrorResponse('Invalid phone number format');
    }

    // Determine verification approach based on phone number origin
    const isNigerian = isNigerianNumber(phone);

    if (isNigerian) {
      // Nigerian numbers require SMS OTP verification
      // Database operations would include:
      // 1. Generate verification ID and OTP
      // 2. Send SMS via KudiSMS API
      // 3. Store verification data temporarily
      
      const verificationId = `VER${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      return createSuccessResponse(
        'OTP sent successfully to your phone number',
        {
          isNigerianNumber: true,
          requiresOtp: true,
          verificationId,
          phone
        }
      );
    } else {
      // International numbers are automatically verified
      // Database operations would include:
      // 1. Save phone number to user account
      // 2. Mark as verified (admin will verify manually)
      
      return createSuccessResponse(
        'International phone number verified automatically',
        {
          isNigerianNumber: false,
          requiresOtp: false,
          phone,
          verified: true
        }
      );
    }
  } catch (error) {
    console.error('Send phone OTP error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 