
import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleOptionsRequest } from '@/lib/api-config';

/**
 * Handle CORS preflight requests for send phone OTP endpoint
 */
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}

/**
 * Send Phone OTP Endpoint
 * 
 * Forwards phone OTP requests to the backend API.
 * Handles sending SMS OTP for Nigerian numbers and auto-verification for international numbers.
 * 
 * @param request - HTTP request containing phone number
 * @returns JSON response with verification details
 */
export async function POST(request: NextRequest) {
  try {
    // Extract phone number from request body
    const body = await request.json();
    const { phone } = body;

    // Validate phone number is provided
    if (!phone) {
      return createErrorResponse('Phone number is required');
    }

    // Basic phone number format validation
    if (!/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      return createErrorResponse('Invalid phone number format');
    }

    // Forward request to backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://litefi-backend.onrender.com';
    
    console.log('Forwarding send phone OTP to backend:', { phone });
    
    const backendResponse = await fetch(`${backendUrl}/auth/send-phone-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    const backendData = await backendResponse.json();
    
    console.log('Backend send phone OTP response:', {
      status: backendResponse.status,
      data: backendData
    });

    // Return the backend response
    if (backendResponse.ok) {
      return createSuccessResponse(
        backendData.message || 'Phone verification processed',
        backendData.data
      );
    } else {
      return createErrorResponse(
        backendData.message || 'Failed to process phone verification',
        backendResponse.status
      );
    }
  } catch (error) {
    console.error('Send phone OTP error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 