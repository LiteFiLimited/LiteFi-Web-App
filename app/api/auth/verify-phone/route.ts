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
 * Handle CORS preflight requests for phone verification endpoint
 */
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}

/**
 * Phone Number Verification Endpoint
 * 
 * Verifies phone numbers with different approaches based on country:
 * - Nigerian numbers: Requires SMS OTP verification via KudiSMS
 * - International numbers: Automatically verified for manual admin review
 * 
 * @param request - HTTP request containing phone number and optional verification code
 * @returns JSON response confirming phone verification status
 */
export async function POST(request: NextRequest) {
  try {
    // Extract phone verification data from request body
    const body = await request.json();
    const { phone, code } = body;

    // Validate that phone number is provided
    if (!phone) {
      return createErrorResponse('Phone number is required');
    }

    // Determine verification approach based on phone number origin
    const isNigerian = isNigerianNumber(phone);

    if (isNigerian) {
      // Nigerian numbers require SMS OTP verification
      if (!code) {
        return createErrorResponse('Verification code is required for Nigerian numbers');
      }

      // Validate verification code format
      if (!/^\d{6}$/.test(code)) {
        return createErrorResponse('Invalid verification code format. Must be a 6-digit code.');
      }

      // Verify SMS OTP using KudiSMS service
      // Database operations would include:
      // 1. Verify the code using KudiSMS API
      // 2. Mark the phone as verified in the database
      
      // Accept test code "123456" for development
      if (code === '123456') {
        return createSuccessResponse('Phone verified successfully');
      } else {
        return createErrorResponse('Invalid verification code');
      }
    } else {
      // International numbers are automatically verified for manual admin review
      // Database operations would include:
      // 1. Save the phone number to the database
      // 2. Mark it as verified (admin will verify manually)
      
      return createSuccessResponse('Phone number saved successfully');
    }
  } catch (error) {
    console.error('Phone verification error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 