import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-config";

// Document types as specified in FILE_UPLOAD.md
const DOCUMENT_TYPES = {
  ID_DOCUMENT: 'ID_DOCUMENT',
  PASSPORT: 'PASSPORT', 
  UTILITY_BILL: 'UTILITY_BILL',
  BANK_STATEMENT: 'BANK_STATEMENT',
  SALARY_SLIP: 'SALARY_SLIP',
  BUSINESS_REGISTRATION: 'BUSINESS_REGISTRATION',
  LOAN_AGREEMENT: 'LOAN_AGREEMENT',
  PAYMENT_PROOF: 'PAYMENT_PROOF',
  PROOF_OF_ADDRESS: 'PROOF_OF_ADDRESS',
  PICTURES_OF_GOODS: 'PICTURES_OF_GOODS',
  PICTURE_OF_BUSINESS_FRONT: 'PICTURE_OF_BUSINESS_FRONT',
  OTHER: 'OTHER'
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createErrorResponse("Authorization header is required", 401);
    }

    // Await params before accessing properties (Next.js 15 requirement)
    const { type } = await params;

    // Validate document type
    const validTypes = Object.values(DOCUMENT_TYPES);
    if (!validTypes.includes(type)) {
      return createErrorResponse(
        `Invalid document type. Must be one of: ${validTypes.join(', ')}`,
        400
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;

    // Validate required fields
    if (!file) {
      return createErrorResponse("File is required", 400);
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'application/pdf',
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return createErrorResponse(
        'Invalid file type. Use PDF, DOC, DOCX, JPG, or PNG',
        400
      );
    }

    // Validate file size (10MB limit for documents)
    if (file.size > 10 * 1024 * 1024) {
      return createErrorResponse("File must be less than 10MB", 400);
    }

    // Forward the request to the backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (!apiUrl) {
      return createErrorResponse("Backend API URL not configured", 500);
    }

    // Create new FormData for backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    if (description) {
      backendFormData.append('description', description);
    }

    const backendResponse = await fetch(`${apiUrl}/users/upload-document/${type}`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: backendFormData,
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return createErrorResponse(
        responseData.message || "Failed to upload document",
        backendResponse.status
      );
    }

    return createSuccessResponse(
      "Document uploaded successfully",
      responseData.data
    );
  } catch (error) {
    console.error("Document upload error:", error);
    return createErrorResponse("Internal server error", 500);
  }
} 