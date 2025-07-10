import { NextRequest } from "next/server";
import {
  createErrorResponse,
  createSuccessResponse,
  handleOptionsRequest,
} from "@/lib/api-config";

export const OPTIONS = handleOptionsRequest;

/**
 * Send Phone OTP Endpoint
 *
 * Forwards phone OTP requests to the backend API.
 * All phone numbers are now handled uniformly and saved in international format.
 *
 * @param request - HTTP request containing phone number
 * @returns JSON response with verification details
 */
export async function POST(request: NextRequest) {
  try {
    // Extract phone number from request body
    const body = await request.json();
    const { phone } = body;

    // Validate phone number is provided
    if (!phone) {
      return createErrorResponse("Phone number is required");
    }

    // Basic phone number format validation
    if (!/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      return createErrorResponse("Invalid phone number format");
    }

    // Forward request to backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;

    if (!backendUrl) {
      return createErrorResponse("Backend API URL not configured", 500);
    }

    console.log("Forwarding phone number to backend for international format saving:", { phone });

    const backendResponse = await fetch(`${backendUrl}/auth/send-phone-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    const backendData = await backendResponse.json();

    console.log("Backend phone save response:", {
      status: backendResponse.status,
      data: backendData,
    });

    // Return the backend response
    if (backendResponse.ok) {
      return createSuccessResponse(
        backendData.message || "Phone number saved successfully",
        backendData.data
      );
    } else {
      return createErrorResponse(
        backendData.message || "Failed to save phone number",
        backendResponse.status
      );
    }
  } catch (error) {
    console.error("Send phone OTP error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
