import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-config';

/**
 * Frontend Token Refresh Proxy Endpoint
 * 
 * This endpoint handles JWT token refresh by:
 * 1. Extracting refresh token from httpOnly cookies or request body
 * 2. Forwarding refresh request to backend API
 * 3. Setting new access and refresh tokens in both cookies and response
 * 
 * @param request - HTTP request for token refresh
 * @returns JSON response with new access token + updated cookies
 */
export async function POST(request: NextRequest) {
  try {
    // Try to get refresh token from httpOnly cookie first (most secure)
    let refreshToken = request.cookies.get('refresh-token')?.value;
    
    // If not in cookie, try request body (for client-side refresh)
    if (!refreshToken) {
      const body = await request.json().catch(() => ({}));
      refreshToken = body.refreshToken;
    }

    if (!refreshToken) {
      return createErrorResponse('Refresh token is required', 401);
    }

    // Forward refresh request to backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      // Clear invalid refresh token cookies
      const errorResponse = createErrorResponse(
        responseData.message || 'Token refresh failed',
        backendResponse.status
      );
      
      // Clear invalid refresh token
      errorResponse.cookies.set('refresh-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
      });
      
      return errorResponse;
    }

    // Successful refresh - backend returns new tokens
    const { accessToken, refreshToken: newRefreshToken, user } = responseData;

    // Create success response with new access token
    const response = createSuccessResponse(
      'Token refreshed successfully',
      { token: accessToken, user }
    );

    // Set new authentication cookies
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Set new access token cookie
    response.cookies.set('auth-token', accessToken, {
      httpOnly: false, // Allow client-side access for localStorage sync
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/'
    });

    // Set new refresh token cookie (if provided)
    if (newRefreshToken) {
      response.cookies.set('refresh-token', newRefreshToken, {
        httpOnly: true, // More secure for refresh tokens
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 604800, // 7 days
        path: '/'
      });
    }

    return response;
  } catch (error) {
    console.error('Token refresh proxy error:', error);
    
    // Handle network errors or backend unavailability
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return createErrorResponse('Backend service unavailable. Please try again later.', 503);
    }
    
    return createErrorResponse('Internal server error', 500);
  }
} 