# Profile API Documentation

## Overview

This document outlines the API endpoints for managing user profiles in the LiteFi application.

## Available Options

### Home Ownership Options
- `RENTING`: User is renting their current residence
- `OWNED`: User owns their current residence
- `LIVING_WITH_FAMILY`: User lives with family

### Education Level Options
- `BSC`: Bachelor's Degree
- `MSC_PHD`: Master's Degree or PhD
- `SECONDARY`: Secondary Education
- `PRIMARY_NO_SCHOOL`: Primary Education or No Formal Education

### Employment Status Options
- `EMPLOYED`: Currently employed
- `SELF_EMPLOYED`: Self-employed/Business owner
- `UNEMPLOYED`: Currently unemployed
- `RETIRED`: Retired
- `STUDENT`: Student

### Marital Status Options
- `SINGLE`: Single/Never married
- `MARRIED`: Married
- `DIVORCED`: Divorced
- `WIDOWED`: Widowed

### Next of Kin Relationship Types
- `HUSBAND`: Spouse (husband)
- `WIFE`: Spouse (wife)
- `FATHER`: Father
- `MOTHER`: Mother
- `BROTHER`: Brother
- `SISTER`: Sister
- `SON`: Son
- `DAUGHTER`: Daughter
- `OTHER_RELATIVE`: Other family relation
- `FRIEND`: Friend

### Identity Document Types
- `NIN`: National Identity Number card
- `PASSPORT`: International passport
- `DRIVERS_LICENSE`: Driver's license
- `VOTERS_CARD`: Voter's card

## Endpoints

### 1. Get User Profile

Retrieves the complete profile information for the authenticated user.

**Endpoint:** `GET /users/profile`

**Response:**
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
      "middleName": "Michael",
      "address": "123 Main Street",
      "streetName": "Main Street",
      "nearestBusStop": "Central Station",
      "city": "Lagos",
      "state": "Lagos",
      "localGovernment": "Ikeja",
      "country": "Nigeria",
      "nationality": "Nigerian",
      "bvn": "12345678901",
      "nin": "98765432101",
      "identityType": "PASSPORT",
      "identityNumber": "A12345678",
      "identityExpiry": "01/01/2025",
      "avatarUrl": "https://cdn.litefi.ng/uploads/profiles/user_123456.jpg",
      "bvnVerified": true,
      "ninVerified": true,
      "kycVerified": true,
      "kycVerifiedAt": "2023-10-01T10:00:00.000Z",
      "homeOwnership": "OWNED",
      "yearsAtAddress": 5,
      "maritalStatus": "MARRIED",
      "educationLevel": "BSC",
      "employmentStatus": "EMPLOYED",
      "accountType": "INDIVIDUAL"
    }
  },
  "message": "Profile retrieved successfully"
}
```

### 2. Update Profile

Updates the basic profile information for the authenticated user.

**Endpoint:** `PATCH /users/profile`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "middleName": "Michael",
  "phone": "08012345678",
  "dateOfBirth": "01/01/1990",
  "gender": "MALE",
  "address": "123 Main Street",
  "streetName": "Main Street",
  "nearestBusStop": "Central Station",
  "city": "Lagos",
  "state": "Lagos",
  "localGovernment": "Ikeja",
  "country": "Nigeria",
  "nationality": "Nigerian",
  "bvn": "12345678901",
  "nin": "98765432101",
  "identityType": "PASSPORT",
  "identityNumber": "A12345678",
  "identityExpiry": "01/01/2025",
  "homeOwnership": "OWNED",
  "yearsAtAddress": 5,
  "maritalStatus": "MARRIED",
  "educationLevel": "BSC",
  "employmentStatus": "EMPLOYED",
  "accountType": "INDIVIDUAL"
}
```

### 3. Get Next of Kin Information

Retrieves the next of kin information for the authenticated user.

**Endpoint:** `GET /users/next-of-kin`

**Response:**
```json
{
  "success": true,
  "data": {
    "firstName": "Jane",
    "lastName": "Doe",
    "middleName": "Sarah",
    "relationship": "WIFE",
    "phone": "08012345678",
    "email": "jane.doe@example.com",
    "address": "123 Main Street"
  },
  "message": "Next of kin information retrieved successfully"
}
```

### 4. Update Next of Kin

Updates the next of kin information for the authenticated user.

**Endpoint:** `PATCH /users/next-of-kin`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "middleName": "Sarah",
  "relationship": "WIFE",
  "phone": "08012345678",
  "email": "jane.doe@example.com",
  "address": "123 Main Street"
}
```

### 5. Get Guarantor Information

Retrieves the guarantor information for the authenticated user.

**Endpoint:** `GET /users/guarantor`

**Response:**
```json
{
  "success": true,
  "data": {
    "firstName": "Michael",
    "lastName": "Smith",
    "middleName": "John",
    "relationship": "FRIEND",
    "email": "michael.smith@example.com",
    "phone": "08012345678",
    "address": "456 Second St, Lagos",
    "occupation": "Doctor",
    "bvn": "22222222222",
    "idCardUrl": "https://cdn.litefi.ng/documents/guarantor_id.jpg"
  },
  "message": "Guarantor information retrieved successfully"
}
```

### 6. Update Guarantor

Updates the guarantor information for the authenticated user.

**Endpoint:** `PUT /users/guarantor`

**Request Body (multipart/form-data):**
```json
{
  "firstName": "Michael",
  "lastName": "Smith",
  "middleName": "John",
  "relationship": "FRIEND",
  "email": "michael.smith@example.com",
  "phone": "08012345678",
  "address": "456 Second St, Lagos",
  "occupation": "Doctor",
  "bvn": "22222222222",
  "idCard": "(file upload - required for initial setup)"
}
```

### 7. Get Employment Information

Retrieves the employment information for the authenticated user.

**Endpoint:** `GET /users/employment`

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "EMPLOYED",
    "employer": "Tech Company Ltd",
    "jobTitle": "Software Engineer",
    "monthlySalary": 350000,
    "workEmail": "john@techcompany.com",
    "workPhone": "08012345678",
    "startDate": "01/01/2020",
    "employerStreet": "456 Tech Street",
    "employerCity": "Lagos",
    "employerState": "Lagos",
    "employerCountry": "Nigeria",
    "employerPostalCode": "100001",
    "salaryPaymentDate": 25
  },
  "message": "Employment information retrieved successfully"
}
```

### 8. Update Employment Information

Updates the employment information for the authenticated user.

**Endpoint:** `PATCH /users/employment`

**Request Body:**
```json
{
  "status": "EMPLOYED",
  "employer": "Tech Company Ltd",
  "jobTitle": "Software Engineer",
  "monthlySalary": 350000,
  "workEmail": "john@techcompany.com",
  "workPhone": "08012345678",
  "startDate": "01/01/2020",
  "employerStreet": "456 Tech Street",
  "employerCity": "Lagos",
  "employerState": "Lagos",
  "employerCountry": "Nigeria",
  "employerPostalCode": "100001",
  "salaryPaymentDate": 25
}
```

### 9. Upload Profile Picture

Uploads a profile picture for the authenticated user.

**Endpoint:** `POST /users/profile-picture`

**Request Body (multipart/form-data):**
- `file`: The image file to upload (jpg, jpeg, or png)
- Maximum file size: 5MB

**Response:**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://cdn.litefi.ng/uploads/profiles/user_123456.jpg"
  },
  "message": "Profile picture uploaded successfully"
}
```

### 10. Verify KYC

Verifies the user's BVN and NIN for KYC compliance.

**Endpoint:** `POST /users/verify-kyc`

**Request Body:**
```json
{
  "bvn": "12345678901",
  "nin": "98765432101"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bvnVerified": true,
    "ninVerified": true,
    "kycVerified": true,
    "kycVerifiedAt": "2023-10-01T10:00:00.000Z",
    "kycVerificationData": {
      "bvn": {
        "verified": true,
        "data": {}
      },
      "nin": {
        "verified": true,
        "data": {}
      }
    }
  },
  "message": "KYC verification successful"
}
```

### 11. Get KYC Status

Retrieves the current KYC verification status for the authenticated user.

**Endpoint:** `GET /users/kyc-status`

**Response:**
```json
{
  "success": true,
  "data": {
    "bvnVerified": true,
    "ninVerified": true,
    "kycVerified": true,
    "kycVerifiedAt": "2023-10-01T10:00:00.000Z",
    "kycVerificationData": {
      "bvn": {
        "verified": true,
        "data": {}
      },
      "nin": {
        "verified": true,
        "data": {}
      }
    }
  },
  "message": "KYC status retrieved successfully"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details if available"
  }
}
```

Common error codes:
- `UNAUTHORIZED`: User is not authenticated
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Requested resource not found
- `FILE_TOO_LARGE`: Uploaded file exceeds size limit
- `INVALID_FILE_TYPE`: Unsupported file type
- `KYC_VERIFICATION_FAILED`: Failed to verify BVN or NIN 