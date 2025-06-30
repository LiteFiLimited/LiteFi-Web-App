import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-config";

// Add this line to make the route compatible with static exports

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (!apiUrl) {
      return createErrorResponse("Backend API URL not configured", 500);
    }

    const backendResponse = await fetch(`${apiUrl}/users/profile`, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to get profile",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Profile retrieved successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Profile retrieval error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    const body = await request.json();

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (!apiUrl) {
      return createErrorResponse("Backend API URL not configured", 500);
    }

    const backendResponse = await fetch(`${apiUrl}/users/profile`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to update profile",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Profile updated successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
