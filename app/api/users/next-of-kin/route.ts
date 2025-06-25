import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-config';

// Add this line to make the route compatible with static exports

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse('Authorization header is required', 401);
    }

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://litefi-backend.onrender.com'}/users/next-of-kin`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || 'Failed to get next of kin information',
        backendResponse.status
      );
    }

    return createSuccessResponse('Next of kin information retrieved successfully', responseData.data);
  } catch (error) {
    console.error('Next of kin retrieval error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse('Authorization header is required', 401);
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'relationship', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://litefi-backend.onrender.com'}/users/next-of-kin`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || 'Failed to update next of kin information',
        backendResponse.status
      );
    }

    return createSuccessResponse('Next of kin information updated successfully', responseData.data);
  } catch (error) {
    console.error('Next of kin update error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 