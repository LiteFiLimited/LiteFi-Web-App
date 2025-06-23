import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse('Authorization header is required', 401);
    }

    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to the backend
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://litefi-backend.onrender.com'}/users/bank-statement`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData, // Forward the form data as is
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || 'Failed to upload bank statement',
        backendResponse.status
      );
    }

    return createSuccessResponse('Bank statement uploaded successfully', responseData.data);
  } catch (error) {
    console.error('Bank statement upload error:', error);
    return createErrorResponse('Internal server error', 500);
  }
} 