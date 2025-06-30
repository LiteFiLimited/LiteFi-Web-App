import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-config";

// Add this line to make the route compatible with static exports

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the backend
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (!apiUrl) {
      return createErrorResponse("Backend API URL not configured", 500);
    }

    const backendResponse = await fetch(`${apiUrl}/users/bank-statement`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData, // Forward the form data as is
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to upload bank statement",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Bank statement uploaded successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Bank statement upload error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
