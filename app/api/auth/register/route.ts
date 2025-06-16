import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-config';

/**
 * Frontend Registration Proxy Endpoint
 * 
 * This endpoint serves as a proxy to the backend authentication system.
 * It forwards registration requests to the backend for the new auth flow where
 * passwords are created in a separate step after email and phone verification.
 * 
 * @param request - HTTP request containing user registration data
 * @returns JSON response with user data for verification flow
 */
export async function POST(request: NextRequest) {
  try {
    // Extract registration data from request body
    const body = await request.json();
    const { email, firstName, lastName, phone, country, referralCode } = body;

    // Validate required fields are present
    if (!email || !firstName || !lastName) {
      return createErrorResponse('Missing required fields: email, firstName, and lastName are required');
    }

    // Validate email format using regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse('Invalid email format');
    }

    // Forward registration request to backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        firstName, 
        lastName, 
        phone: phone || undefined,
        country: country || 'NG',
        referralCode: referralCode || undefined 
      }),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      // Forward backend error response
      return createErrorResponse(
        responseData.message || 'Registration failed',
        backendResponse.status
      );
    }

    // Successful registration - return user data and verification info
    const response = createSuccessResponse(
      'Registration successful. Please verify your email to continue.',
      responseData.data,
      201
    );

    return response;
  } catch (error) {
    console.error('Registration proxy error:', error);
    
    // Handle network errors or backend unavailability
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return createErrorResponse('Backend service unavailable. Please try again later.', 503);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
} 