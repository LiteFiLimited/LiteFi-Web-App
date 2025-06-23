# Profile API Integration Documentation

## Overview

The LiteFi Profile API provides endpoints for managing user profiles, including personal information, employment details, next of kin, guarantor information, and bank accounts.

## Base URL

```
https://api.litefi.ng
```

## Authentication

All endpoints require authentication via JWT token:

```
Authorization: Bearer {accessToken}
```

## Endpoints

### 1. Get User Profile

Retrieves the profile information for the authenticated user.

**Endpoint:** `GET /users/profile`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+2348123456789",
    "emailVerified": true,
    "phoneVerified": true,
    "profile": {
      "dateOfBirth": "01/01/1990",
      "gender": "MALE",
      "address": "123 Main Street",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "bvn": "12345678901",
      "nin": "98765432101",
      "avatarUrl": "https://cdn.litefi.ng/uploads/profiles/user_123456.jpg"
    },
    "employment": {
      "status": "EMPLOYED",
      "employer": "Tech Company Ltd",
      "jobTitle": "Software Engineer",
      "monthlySalary": 350000,
      "workEmail": "john@techcompany.com",
      "startDate": "01/01/2020"
    },
    "nextOfKin": {
      "firstName": "Jane",
      "lastName": "Doe",
      "relationship": "SPOUSE",
      "phone": "+2348123456780",
      "email": "jane.doe@example.com",
      "address": "123 Main Street, Lagos"
    },
    "guarantor": {
      "firstName": "James",
      "lastName": "Smith",
      "relationship": "COLLEAGUE",
      "phone": "+2348123456781",
      "email": "james.smith@example.com",
      "address": "456 Park Avenue, Lagos"
    },
    "bankAccounts": [
      {
        "id": "bank_123",
        "bankName": "First Bank",
        "accountNumber": "0123456789",
        "accountName": "John Doe",
        "isDefault": true
      }
    ],
    "documents": [
      {
        "id": "doc_123",
        "type": "ID_DOCUMENT",
        "url": "https://cdn.litefi.ng/uploads/documents/id/user_123_id.pdf",
        "verified": true
      },
      {
        "id": "doc_124",
        "type": "PROOF_OF_ADDRESS",
        "url": "https://cdn.litefi.ng/uploads/documents/address/user_123_address.pdf",
        "verified": true
      }
    ]
  },
  "message": "Profile retrieved successfully"
}
```

### 2. Update User Profile

Updates the profile information for the authenticated user.

**Endpoint:** `PATCH /users/profile`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348123456789",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "address": "123 Main Street",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "accountType": "INDIVIDUAL"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user_123456",
    "dateOfBirth": "01/01/1990",
    "gender": "MALE",
    "address": "123 Main Street",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria"
  },
  "message": "Profile updated successfully"
}
```

### 3. Update Employment Information

Updates the employment information for the authenticated user.

**Endpoint:** `PATCH /users/employment`

**Request Body:**
```json
{
  "status": "EMPLOYED",
  "employer": "Tech Company Ltd",
  "jobTitle": "Senior Software Engineer",
  "monthlySalary": 400000,
  "workEmail": "john@techcompany.com",
  "startDate": "2020-01-01"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "EMPLOYED",
    "employer": "Tech Company Ltd",
    "jobTitle": "Senior Software Engineer",
    "monthlySalary": 400000,
    "workEmail": "john@techcompany.com",
    "startDate": "01/01/2020"
  },
  "message": "Employment information updated successfully"
}
```

### 4. Update Business Information

Updates the business information for business owners.

**Endpoint:** `PATCH /users/business`

**Request Body:**
```json
{
  "businessName": "Tech Solutions Ltd",
  "businessType": "LLC",
  "registrationNumber": "RC123456",
  "businessAddress": "456 Business Avenue, Lagos",
  "businessEmail": "info@techsolutions.com",
  "businessPhone": "+2348123456789",
  "industry": "TECHNOLOGY",
  "yearEstablished": 2018,
  "annualRevenue": 25000000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "businessName": "Tech Solutions Ltd",
    "businessType": "LLC",
    "registrationNumber": "RC123456",
    "businessAddress": "456 Business Avenue, Lagos",
    "businessEmail": "info@techsolutions.com",
    "businessPhone": "+2348123456789",
    "industry": "TECHNOLOGY",
    "yearEstablished": 2018,
    "annualRevenue": 25000000
  },
  "message": "Business information updated successfully"
}
```

### 5. Update Next of Kin

Updates the next of kin information for the authenticated user.

**Endpoint:** `PATCH /users/next-of-kin`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "relationship": "SPOUSE",
  "phone": "+2348123456780",
  "email": "jane.doe@example.com",
  "address": "123 Main Street, Lagos"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "firstName": "Jane",
    "lastName": "Doe",
    "relationship": "SPOUSE",
    "phone": "+2348123456780",
    "email": "jane.doe@example.com",
    "address": "123 Main Street, Lagos"
  },
  "message": "Next of kin information updated successfully"
}
```

### 6. Update Guarantor

Updates the guarantor information for the authenticated user.

**Endpoint:** `PATCH /users/guarantor`

**Request Body:**
```json
{
  "firstName": "James",
  "lastName": "Smith",
  "relationship": "COLLEAGUE",
  "phone": "+2348123456781",
  "email": "james.smith@example.com",
  "address": "456 Park Avenue, Lagos"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "firstName": "James",
    "lastName": "Smith",
    "relationship": "COLLEAGUE",
    "phone": "+2348123456781",
    "email": "james.smith@example.com",
    "address": "456 Park Avenue, Lagos"
  },
  "message": "Guarantor information updated successfully"
}
```

### 7. Upload Document

Uploads a document for the authenticated user.

**Endpoint:** `POST /users/documents`

**Request Body (multipart/form-data):**
- `file`: The document file to upload
- `type`: Document type (ID_DOCUMENT, PROOF_OF_ADDRESS, BANK_STATEMENT, etc.)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "doc_125",
    "type": "ID_DOCUMENT",
    "fileName": "id_document.pdf",
    "fileUrl": "https://cdn.litefi.ng/uploads/documents/id/user_123456_id_document.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "verified": false,
    "createdAt": "2023-01-15T12:30:00Z"
  },
  "message": "Document uploaded successfully"
}
```

### 8. Change Password

Changes the password for the authenticated user.

**Endpoint:** `POST /users/change-password`

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 9. Check Profile Completion for Investment

Checks if the user's profile is complete enough to apply for investments.

**Endpoint:** `GET /users/profile-status/investment`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isComplete": true,
    "missingFields": []
  },
  "message": "Profile is complete for investment applications"
}
```

### 10. Check Profile Completion for Loan

Checks if the user's profile is complete enough to apply for loans.

**Endpoint:** `GET /users/profile-status/loan`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isComplete": false,
    "missingFields": ["employment", "bankAccount"]
  },
  "message": "Profile is incomplete for loan applications"
}
```

## Error Responses

### Invalid Request (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "firstName",
        "message": "First name is required"
      }
    ]
  }
}
```

### Unauthorized (401 Unauthorized)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### Not Found (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

### Internal Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
``` 