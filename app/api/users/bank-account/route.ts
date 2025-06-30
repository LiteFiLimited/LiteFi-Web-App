import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-config";

// This is the recommended configuration for static export with API routes
// It tells Next.js to generate this route statically at build time
// Tell Next.js this route shouldn't have dynamic params
export const dynamicParams = false;
// Disable revalidation
export const revalidate = false;

export async function GET(request: NextRequest) {
  // For static export, we need to handle this differently
  // During build time, we just return a static response
  // In production, the real API will be called via Vercel rewrites

  // Static response for build time
  if (process.env.NODE_ENV === "production") {
    return createSuccessResponse(
      "Static placeholder - will be replaced by real API in production",
      []
    );
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    const backendResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL
      }/users/bank-accounts`,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to get bank accounts",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Bank accounts retrieved successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Bank accounts retrieval error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  // For static export, return a static response during build time
  if (process.env.NODE_ENV === "production") {
    return createSuccessResponse(
      "Static placeholder - will be replaced by real API in production",
      {}
    );
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["bankName", "accountNumber", "accountName"];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return createErrorResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    // Validate account number format
    if (!/^\d{10}$/.test(body.accountNumber)) {
      return createErrorResponse("Account number must be 10 digits", 400);
    }

    const backendResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL
      }/users/bank-accounts`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to add bank account",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Bank account added successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Bank account addition error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest) {
  // For static export, return a static response during build time
  if (process.env.NODE_ENV === "production") {
    return createSuccessResponse(
      "Static placeholder - will be replaced by real API in production",
      {}
    );
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return createErrorResponse("Account ID is required", 400);
    }

    const backendResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL
      }/users/bank-accounts/${accountId}/default`,
      {
        method: "PATCH",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to set default bank account",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Default bank account updated successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Bank account update error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest) {
  // For static export, return a static response during build time
  if (process.env.NODE_ENV === "production") {
    return createSuccessResponse(
      "Static placeholder - will be replaced by real API in production",
      {}
    );
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return createErrorResponse("Account ID is required", 400);
    }

    const backendResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL
      }/users/bank-accounts/${accountId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to delete bank account",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Bank account deleted successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Bank account deletion error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
