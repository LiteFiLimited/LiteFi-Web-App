
import { NextRequest } from "next/server";
import {
  createErrorResponse,
  createSuccessResponse,
  handleOptionsRequest,
} from "@/lib/api-config";

/**
 * Handle CORS preflight requests for verify phone OTP endpoint
 */
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}

/**
 * Verify Phone OTP Endpoint
 *
 * Forwards phone OTP verification requests to the backend API.
 * Verifies SMS OTP codes sent to Nigerian phone numbers.
 *
 * @param request - HTTP request containing phone, verificationId, and OTP
 * @returns JSON response confirming phone verification status
 */
export async function POST(request: NextRequest) {
  try {
    // Extract verification data from request body
    const body = await request.json();
    const { phone, verificationId, otp } = body;

    // Validate required fields
    if (!phone || !verificationId || !otp) {
      return createErrorResponse(
        "Phone number, verification ID, and OTP are required"
      );
    }

    // Validate OTP format (6-digit code)
    if (!/^\d{6}$/.test(otp)) {
      return createErrorResponse("Invalid OTP format. Must be a 6-digit code.");
    }

    // Forward request to backend API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://litefi-backend.onrender.com";

    console.log("Forwarding verify phone OTP to backend:", {
      phone,
      verificationId,
      otp,
    });

    const backendResponse = await fetch(`${backendUrl}/auth/verify-phone-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, verificationId, otp }),
    });

    const backendData = await backendResponse.json();

    console.log("Backend verify phone OTP response:", {
      status: backendResponse.status,
      data: backendData,
    });

    // Return the backend response
    if (backendResponse.ok) {
      return createSuccessResponse(
        backendData.message || "Phone number verified successfully",
        backendData.data
      );
    } else {
      return createErrorResponse(
        backendData.message || "Phone verification failed",
        backendResponse.status
      );
    }
  } catch (error) {
    console.error("Verify phone OTP error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
