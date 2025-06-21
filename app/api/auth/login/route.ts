export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-config';

/**
 * Frontend Authentication Proxy Endpoint
 * 
 * This endpoint serves as a proxy to the backend authentication system.
 * It forwards login requests to the backend and handles the hybrid authentication response.
 * Sets both localStorage tokens (via JSON response) and HTTP cookies for server-side middleware.
 * 
 * @param request - HTTP request containing login credentials
 * @returns JSON response with user data and authentication token + HTTP cookies
 */
export async function POST(request: NextRequest) {
  try {
    // Extract login credentials from request body
    const body = await request.json();
    const { email, password } = body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return createErrorResponse('Email and password are required');
    }

    // Forward authentication request to backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      // Forward backend error response
      return createErrorResponse(
        responseData.message || 'Authentication failed',
        backendResponse.status
      );
    }

    // Successful authentication - backend returns accessToken and user data
    const { accessToken, refreshToken, user } = responseData;

    // Create success response with user data and token
    const response = createSuccessResponse(
      'Login successful',
      { user, token: accessToken }
    );

    // Set authentication cookies for server-side middleware access
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Set access token cookie
    response.cookies.set('auth-token', accessToken, {
      httpOnly: false, // Allow client-side access for localStorage sync
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/'
    });

    // Set refresh token cookie (httpOnly for security)
    if (refreshToken) {
      response.cookies.set('refresh-token', refreshToken, {
        httpOnly: true, // More secure for refresh tokens
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 604800, // 7 days
        path: '/'
      });
    }

    return response;
  } catch (error) {
    console.error('Login proxy error:', error);
    
    // Handle network errors or backend unavailability
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return createErrorResponse('Backend service unavailable. Please try again later.', 503);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
} 