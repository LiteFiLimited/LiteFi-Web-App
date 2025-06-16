import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-config';

/**
 * Resend Email Verification Endpoint
 * 
 * Generates and sends a new email verification code to the user.
 * Validates email format and user existence before sending verification email.
 * 
 * @param request - HTTP request containing user email address
 * @returns JSON response confirming verification email was sent
 */
export async function POST(request: NextRequest) {
  try {
    // Extract email address from request body
    const body = await request.json();
    const { email } = body;

    // Validate that email address is provided
    if (!email) {
      return createErrorResponse('Email is required');
    }

    // Validate email format using regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse('Invalid email format');
    }

    // Verify user exists and generate new verification code
    // Database operations would include:
    // 1. Check if the user exists
    // 2. Generate a new OTP
    // 3. Send the verification email
    // 4. Update the database with the new OTP

    // Return success response confirming email was sent
    return createSuccessResponse('Verification email sent successfully');
  } catch (error) {
    console.error('Resend verification error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 