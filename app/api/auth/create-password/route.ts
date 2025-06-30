import { NextRequest } from "next/server";
import {
  createErrorResponse,
  createSuccessResponse,
  handleOptionsRequest,
} from "@/lib/api-config";

/**
 * Handle CORS preflight requests for create password endpoint
 */
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}

/**
 * Create Password Endpoint
 *
 * Forwards password creation requests to the backend API.
 * Completes user registration by setting a password for verified users.
 *
 * @param request - HTTP request containing email and password
 * @returns JSON response with authentication tokens and user data
 */
export async function POST(request: NextRequest) {
  try {
    // Extract password creation data from request body
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return createErrorResponse("Email and password are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse("Invalid email format");
    }

    // Validate password strength (basic validation)
    if (password.length < 8) {
      return createErrorResponse("Password must be at least 8 characters long");
    }

    // Forward request to backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;

    if (!backendUrl) {
      return createErrorResponse("Backend API URL not configured", 500);
    }

    console.log("Forwarding create password to backend:", {
      email,
      passwordLength: password.length,
    });

    const backendResponse = await fetch(`${backendUrl}/auth/create-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const backendData = await backendResponse.json();

    console.log("Backend create password response:", {
      status: backendResponse.status,
      success: backendData.success,
    });

    // Return the backend response
    if (backendResponse.ok) {
      return createSuccessResponse(
        backendData.message || "Password created successfully",
        backendData.data
      );
    } else {
      return createErrorResponse(
        backendData.message || "Failed to create password",
        backendResponse.status
      );
    }
  } catch (error) {
    console.error("Create password error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
