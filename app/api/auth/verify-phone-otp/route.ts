import { NextRequest } from "next/server";
import {
  createErrorResponse,
  createSuccessResponse,
  handleOptionsRequest,
} from "@/lib/api-config";

export const OPTIONS = handleOptionsRequest;

/**
 * Verify Phone OTP Endpoint (Legacy)
 *
 * This endpoint is maintained for backwards compatibility but is no longer needed
 * since all phone numbers are now automatically verified and saved in international format.
 * 
 * All phone verification is now handled uniformly by the backend without requiring OTP.
 *
 * @param request - HTTP request containing phone, verificationId, and OTP
 * @returns JSON response confirming phone verification status
 */
export async function POST(request: NextRequest) {
  try {
    // Extract verification data from request body
    const body = await request.json();
    const { phone, verificationId, otp } = body;

    // Validate phone number is provided
    if (!phone) {
      return createErrorResponse("Phone number is required");
    }

    // Since all numbers are now auto-verified, this endpoint returns success
    // regardless of OTP to maintain backwards compatibility
    console.log("Legacy OTP verification called for phone:", phone);
    
    return createSuccessResponse(
      "Phone number verified successfully (auto-verified in international format)",
      {
        phone: phone,
        verified: true,
        method: "international_format"
      }
    );
    
  } catch (error) {
    console.error("Verify phone OTP error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
