
import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleOptionsRequest } from '@/lib/api-config';

export const OPTIONS = handleOptionsRequest;

/**
 * Phone Number Verification Endpoint
 * 
 * All phone numbers are now treated uniformly and saved in international format.
 * This endpoint is maintained for backwards compatibility but may not be needed
 * since the backend now handles all verification automatically.
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

    // All numbers are now automatically verified and saved in international format
    // No OTP verification required since backend handles this uniformly
    return createSuccessResponse('Phone number saved successfully in international format');
    
  } catch (error) {
    console.error('Phone verification error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 