export const dynamic = 'force-static';

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
 * Forwards email verification requests to the backend API.
 * Validates user's email address using verification code sent via email.
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

    // Forward request to backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
    
    console.log('Forwarding email verification to backend:', { 
      email, 
      code,
      backendUrl: `${backendUrl}/auth/verify-email`
    });
    
    try {
      const backendResponse = await fetch(`${backendUrl}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(30000),
      });

      const backendData = await backendResponse.json();
      
      console.log('Backend email verification response:', {
        status: backendResponse.status,
        ok: backendResponse.ok,
        statusText: backendResponse.statusText,
        data: backendData
      });

      // Return the backend response
      if (backendResponse.ok) {
        return createSuccessResponse(backendData.message || 'Email verified successfully', backendData.data);
      } else {
        return createErrorResponse(
          backendData.message || 'Email verification failed',
          backendResponse.status
        );
      }
    } catch (fetchError: any) {
      console.error('Backend connection error:', {
        message: fetchError.message,
        name: fetchError.name,
        cause: fetchError.cause,
        backendUrl: `${backendUrl}/auth/verify-email`
      });
      
      if (fetchError.name === 'AbortError') {
        return createErrorResponse('Backend request timed out. Please check if the backend server is running.', 504);
      } else if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
        return createErrorResponse('Cannot connect to backend server. Please verify the backend is running on the correct port.', 503);
      } else {
        return createErrorResponse(`Backend connection failed: ${fetchError.message}`, 502);
      }
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 