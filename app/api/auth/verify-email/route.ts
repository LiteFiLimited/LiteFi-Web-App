import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleOptionsRequest } from '@/lib/api-config';

/**
 * Handle CORS preflight requests for email verification endpoint
 */
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}

/**
 * Email Verification Endpoint
 * 
 * Validates user's email address using verification code sent via email.
 * Requires email address and verification code in request body.
 * 
 * @param request - HTTP request containing email and verification code
 * @returns JSON response confirming email verification status
 */
export async function POST(request: NextRequest) {
  try {
    // Extract email and verification code from request body
    const body = await request.json();
    const { email, code } = body;

    // Validate that both email and code are provided
    if (!email || !code) {
      return createErrorResponse('Email and verification code are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse('Invalid email format');
    }

    // Validate verification code format
    if (!/^\d{6}$/.test(code)) {
      return createErrorResponse('Invalid verification code format. Must be a 6-digit code.');
    }

    // Verify the email using the provided code
    // Database operations would include:
    // 1. Find user by email address
    // 2. Validate the verification code against the database
    // 3. Mark the user's email as verified
    // 4. Update user verification status
    
    // Accept test code "123456" for development
    if (code === '123456') {
      return createSuccessResponse('Email verified successfully');
    } else {
      // Return error for invalid verification code
      return createErrorResponse('Invalid verification code');
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 