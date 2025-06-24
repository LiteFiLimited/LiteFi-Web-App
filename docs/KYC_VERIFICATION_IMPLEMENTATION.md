# KYC Verification and Eligibility Check Implementation

## Overview

This document outlines the implementation of separate BVN/NIN verification endpoints and the combined eligibility check functionality in the LiteFi Backend.

## KYC Verification Endpoints

### 1. BVN Verification

**Endpoint:** `POST /users/verify/bvn`

**Request Body:**
```json
{
  "bvn": "12345678901"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "message": "BVN verified successfully"
  }
}
```

### 2. NIN Verification

**Endpoint:** `POST /users/verify/nin`

**Request Body:**
```json
{
  "nin": "12345678901"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "message": "NIN verified successfully"
  }
}
```

## Combined Eligibility Check

### Endpoint: `GET /users/eligibility`

This endpoint returns the eligibility status for both loans and investments in a single call.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "loan": {
      "complete": boolean,
      "missingFields": string[]
    },
    "investment": {
      "complete": boolean,
      "missingFields": string[]
    }
  },
  "message": "Eligibility status retrieved successfully"
}
```

## Eligibility Requirements

### Investment Eligibility
- KYC verification (BVN and NIN)
- Valid profile information
- Bank account details

### Loan Eligibility
- KYC verification (BVN and NIN)
- Valid profile information
- Employment information
- Next of kin details
- Guarantor (for business accounts)
- Bank account details
- Required documents

## Implementation Details

### 1. KYC Verification Process
- BVN and NIN verification are now separate processes
- Both verifications must pass for full KYC status
- System verifies names match against official records
- Uses case-insensitive comparison for name matching
- Tracks verification history

### 2. Eligibility Check Process
- Combined endpoint checks both loan and investment eligibility
- Returns detailed list of missing requirements
- Maintains backward compatibility with separate endpoints
- Provides clear status messages

### 3. Security Measures
- All endpoints require authentication
- Rate limiting applied to verification attempts
- Audit trail for all verification attempts
- Secure storage of verification data

## Error Handling

### Common Error Responses

**Invalid BVN/NIN Format:**
```json
{
  "success": false,
  "message": "Invalid format: Must be 11 digits",
  "statusCode": 400
}
```

**Name Mismatch:**
```json
{
  "success": false,
  "message": "Verification failed: Name does not match records",
  "statusCode": 400
}
```

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "message": "Too many verification attempts. Please try again later",
  "statusCode": 429
}
```

## Database Schema Updates

The following fields are used to track verification status:

```prisma
model Profile {
  // ... existing fields ...
  bvnVerified    Boolean   @default(false)
  ninVerified    Boolean   @default(false)
  kycVerified    Boolean   @default(false)
  kycVerifiedAt  DateTime?
  // ... other fields ...
}
```

## Testing

### Test Cases
1. BVN verification with correct data
2. NIN verification with correct data
3. BVN verification with name mismatch
4. NIN verification with name mismatch
5. Combined eligibility check with complete profile
6. Combined eligibility check with incomplete profile

### Test Script
Use the provided test script to verify the implementation:
```bash
./test-kyc-verification.sh
```

## Migration Guide

### For Frontend Integration
1. Update API calls to use separate BVN/NIN verification endpoints
2. Update eligibility check to use combined endpoint
3. Handle new response format for eligibility status
4. Update error handling for verification failures

### For Backend Updates
1. Run database migrations to add new verification fields
2. Update existing endpoints to use new verification logic
3. Implement rate limiting for verification attempts
4. Add audit logging for verification attempts 