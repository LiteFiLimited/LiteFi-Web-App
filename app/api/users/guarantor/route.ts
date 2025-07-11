import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-config";

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    // Get the form data from the request
    const formData = await request.formData();

    // Validate required fields from form data
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const relationship = formData.get('relationship') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const occupation = formData.get('occupation') as string;
    const idCardFile = formData.get('idCard') as File;

    // Validate required fields
    const requiredFields = [
      { name: 'firstName', value: firstName },
      { name: 'lastName', value: lastName },
      { name: 'relationship', value: relationship },
      { name: 'email', value: email },
      { name: 'phone', value: phone },
      { name: 'address', value: address },
      { name: 'occupation', value: occupation }
    ];

    const missingFields = requiredFields.filter(field => !field.value);
    if (missingFields.length > 0) {
      return createErrorResponse(
        `Missing required fields: ${missingFields.map(f => f.name).join(', ')}`,
        400
      );
    }

    // Validate ID card file (required for initial setup, optional for updates)
    if (idCardFile && idCardFile.size > 0) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'application/pdf'
      ];
      
      if (!allowedTypes.includes(idCardFile.type)) {
        return createErrorResponse(
          'Invalid file type for ID card. Use JPG, PNG, or PDF',
          400
        );
      }

      // Validate file size (5MB limit)
      if (idCardFile.size > 5 * 1024 * 1024) {
        return createErrorResponse("ID card file must be less than 5MB", 400);
      }
    }

    // Forward the request to the backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (!apiUrl) {
      return createErrorResponse("Backend API URL not configured", 500);
    }

    // Forward the form data as is to the backend
    const backendResponse = await fetch(`${apiUrl}/users/guarantor`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
      },
      body: formData, // Forward the form data as is
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to update guarantor information",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Guarantor information updated successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Guarantor update error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (!apiUrl) {
      return createErrorResponse("Backend API URL not configured", 500);
    }

    const backendResponse = await fetch(`${apiUrl}/users/guarantor`, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to get guarantor information",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Guarantor information retrieved successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Guarantor retrieval error:", error);
    return createErrorResponse("Internal server error", 500);
  }
} 