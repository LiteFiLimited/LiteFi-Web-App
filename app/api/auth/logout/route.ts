import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-config';

/**
 * Frontend Logout Proxy Endpoint
 * 
 * This endpoint handles user session termination by:
 * 1. Forwarding logout request to backend API (if configured)
 * 2. Clearing all authentication cookies (access and refresh tokens)
 * 3. Ensuring client-side localStorage tokens are also cleared
 * 
 * @param request - HTTP request for logout operation
 * @returns JSON response confirming successful logout
 */
export async function POST(request: NextRequest) {
  try {
    // Get tokens from cookies for backend logout (if needed)
    const accessToken = request.cookies.get('auth-token')?.value;
    const refreshToken = request.cookies.get('refresh-token')?.value;

    // Attempt to notify backend of logout (optional, for token blacklisting)
    if (process.env.BACKEND_API_URL && accessToken) {
      try {
        await fetch(`${process.env.BACKEND_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
        // Don't fail if backend logout fails - we still want to clear cookies
      } catch (backendError) {
        console.warn('Backend logout failed, but continuing to clear cookies:', backendError);
      }
    }
    
    // Create success response for logout
    const response = createSuccessResponse('Logged out successfully');
    
    // Clear authentication cookies from client
    // Clear access token cookie
    response.cookies.set('auth-token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    // Clear refresh token cookie
    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, we should still try to clear cookies
    const response = createSuccessResponse('Logged out successfully (with errors)');
    
    // Clear cookies even on error
    response.cookies.set('auth-token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });
    
    return response;
  }
} 