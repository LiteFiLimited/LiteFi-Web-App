import { NextResponse } from "next/server";
import { getApiUrl as getSecureApiUrl } from "./env-config";

// API URL configuration - Use secure environment configuration
export const getApiUrl = () => {
  return getSecureApiUrl();
};

// Log the current API configuration
console.log("API Configuration:", {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  BACKEND_API_URL: process.env.BACKEND_API_URL,
  selectedApiUrl: getApiUrl(),
  environment: process.env.NODE_ENV,
});

// CORS headers configuration
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

// Standard API headers
export const API_HEADERS = {
  "Content-Type": "application/json",
  ...CORS_HEADERS,
};

// Helper function to create standardized API responses
export function createApiResponse(
  data: any,
  status: number = 200,
  additionalHeaders: Record<string, string> = {}
): NextResponse {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      ...API_HEADERS,
      ...additionalHeaders,
    },
  });
}

// Helper function to create error responses
export function createErrorResponse(
  message: string,
  status: number = 400,
  error?: string
): NextResponse {
  return createApiResponse(
    {
      success: false,
      message,
      error: error || getErrorTypeFromStatus(status),
    },
    status
  );
}

// Helper function to create success responses
export function createSuccessResponse(
  message: string,
  data?: any,
  status: number = 200
): NextResponse {
  return createApiResponse(
    {
      success: true,
      message,
      ...(data && { data }),
    },
    status
  );
}

// Helper function to handle OPTIONS requests for CORS
export function handleOptionsRequest(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

// Helper function to get error type from status code
function getErrorTypeFromStatus(status: number): string {
  switch (status) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 409:
      return "Conflict";
    case 422:
      return "Unprocessable Entity";
    case 500:
      return "Internal Server Error";
    default:
      return "Error";
  }
}
