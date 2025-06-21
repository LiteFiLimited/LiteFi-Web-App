# LiteFi Backend API Documentation for Frontend Integration

This document provides comprehensive documentation of all API endpoints, request bodies, and response formats for frontend integration with the LiteFi Backend.

## Base URL
```
https://your-api-domain.com/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Standard Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "data": {}, // Response data
  "message": "Operation completed successfully"
}
```

## Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {} // Additional error details
  }
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "08012345678", // Optional
  "country": "NG", // Optional, defaults to "NG"
  "referralCode": "REF123456" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60d5f8b7a2d6c33f24d4b9a5",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false,
      "isPhoneVerified": false,
      "createdAt": "2023-05-29T19:27:19.951Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60d5f8b7a2d6c33f24d4b9a5",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": true,
      "isPhoneVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/verify-email
Verify email with verification code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

### POST /auth/verify-phone
Verify phone number with verification code.

**Request Body:**
```json
{
  "phone": "+2348012345678",
  "code": "123456"
}
```

### POST /auth/resend-otp
Resend OTP code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "type": "email" // or "phone"
}
```

### POST /auth/reset-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /auth/confirm-reset
Confirm password reset with code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewPassword123!"
}
```

### POST /auth/admin/login
Admin login.

**Request Body:**
```json
{
  "email": "admin@litefi.com",
  "password": "AdminPassword123!"
}
```

### POST /auth/refresh-token
Refresh access token.

**Request Body:**
```json
{
  "token": "refresh_token_here"
}
```

### POST /auth/login/2fa
Two-factor authentication login.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "twoFactorCode": "123456"
}
```

---

## User Management Endpoints

### GET /users/profile
Get the current user profile.
**Authentication:** Required

### PATCH /users/profile
Update the current user profile.
**Authentication:** Required

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "address": "123 Main Street",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "bvn": "12345678901",
  "nin": "12345678901"
}
```

### PATCH /users/employment
Update employment information.
**Authentication:** Required

**Request Body:**
```json
{
  "employmentStatus": "EMPLOYED",
  "employerName": "Tech Company Ltd",
  "jobTitle": "Software Engineer",
  "workAddress": "456 Business District",
  "monthlyIncome": 500000,
  "employmentStartDate": "2020-01-01",
  "workEmail": "john@techcompany.com",
  "workPhone": "+2348012345679"
}
```

### PATCH /users/business
Update business information for business owners.
**Authentication:** Required

**Request Body:**
```json
{
  "businessName": "My Business Ltd",
  "businessType": "TECHNOLOGY",
  "businessAddress": "789 Business Avenue",
  "businessRegistrationNumber": "RC123456",
  "businessPhone": "+2348012345680",
  "businessEmail": "info@mybusiness.com",
  "monthlyRevenue": 2000000,
  "businessStartDate": "2018-01-01"
}
```

### PATCH /users/next-of-kin
Update next of kin information.
**Authentication:** Required

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "relationship": "SPOUSE",
  "phone": "+2348012345681",
  "email": "jane@example.com",
  "address": "123 Family Street"
}
```

### POST /users/bank-accounts
Add a new bank account.
**Authentication:** Required

**Request Body:**
```json
{
  "bankName": "First Bank",
  "accountNumber": "1234567890",
  "accountName": "John Doe",
  "bankCode": "011"
}
```

### GET /users/bank-accounts
Get all bank accounts for the user.
**Authentication:** Required

### PATCH /users/bank-accounts/:id/default
Set a bank account as default.
**Authentication:** Required

### DELETE /users/bank-accounts/:id
Delete a bank account.
**Authentication:** Required

### POST /users/documents
Upload a document.
**Authentication:** Required
**Content-Type:** multipart/form-data

**Form Data:**
```
type: "ID_DOCUMENT" | "PROOF_OF_ADDRESS" | "BANK_STATEMENT" | "PAYMENT_PROOF" | "SALARY_SLIP" | "BUSINESS_REGISTRATION" | "LOAN_AGREEMENT" | "OTHER"
file: [binary file]
description: "Document description" // Optional
```

### GET /users/documents
Get all documents for the user.
**Authentication:** Required

### DELETE /users/documents/:id
Delete a document.
**Authentication:** Required

### POST /users/change-password
Change user password.
**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!"
}
```

### POST /users/setup-transaction-pin
Setup transaction PIN.
**Authentication:** Required

**Request Body:**
```json
{
  "pin": "1234"
}
```

### POST /users/verify-transaction-pin
Verify transaction PIN.
**Authentication:** Required

**Request Body:**
```json
{
  "pin": "1234"
}
```

### GET /users/profile-status/investment
Check if profile is complete for investment.
**Authentication:** Required

### GET /users/profile-status/loan
Check if profile is complete for loan.
**Authentication:** Required

---

## Wallet Endpoints

### GET /wallet
Get all wallets.

### GET /wallet/:id
Get wallet by ID.

### GET /wallet/user/me
Get authenticated user wallet.
**Authentication:** Required

### POST /wallet/virtual-account/create
Create virtual account for authenticated user.
**Authentication:** Required

### GET /wallet/virtual-account/details
Get virtual account details for authenticated user.
**Authentication:** Required

### POST /wallet/direct-payment/create
Create direct payment link using Mono.
**Authentication:** Required

**Request Body:**
```json
{
  "amount": 50000,
  "description": "Wallet funding",
  "redirectUrl": "https://yourapp.com/payment-success", // Optional
  "customerName": "John Doe", // Optional
  "customerEmail": "john@example.com" // Optional
}
```

### GET /wallet/mono/public-key
Get Mono public key for client-side integration.

### GET /wallet/transaction/verify/:reference
Verify Mono transaction status.

---

## Investment Endpoints

### GET /investments
Get all investments for authenticated user.
**Authentication:** Required

### GET /investments/plans
Get all available investment plans.

### GET /investments/:id
Get investment details by ID.
**Authentication:** Required

### POST /investments/calculate
Calculate investment returns.

**Request Body:**
```json
{
  "planId": "clq1234567890",
  "amount": 100000,
  "duration": 6 // months
}
```

### POST /investments
Create a new investment.
**Authentication:** Required

**Request Body:**
```json
{
  "planId": "clq1234567890",
  "amount": 100000,
  "name": "My Retirement Fund",
  "currency": "NGN", // Optional, defaults to "NGN"
  "agreementAccepted": true,
  "upfrontInterestPayment": false // Optional
}
```

### POST /investments/foreign
Create a foreign currency investment.
**Authentication:** Required
**Content-Type:** multipart/form-data

**Form Data:**
```
planId: "clq1234567890"
amount: 100000
name: "My USD Investment"
currency: "USD"
agreementAccepted: true
paymentProof: [binary file]
```

### POST /investments/:id/withdraw
Request investment withdrawal.
**Authentication:** Required

**Request Body:**
```json
{
  "amount": 50000, // Optional, defaults to full amount
  "reason": "Emergency withdrawal" // Optional
}
```

---

## Loan Endpoints

### GET /loans
Get all loans for authenticated user.
**Authentication:** Required

### GET /loans/products
Get all available loan products.

### GET /loans/:id
Get loan details by ID.
**Authentication:** Required

### POST /loans/salary
Create a salary loan application.
**Authentication:** Required

**Request Body:**
```json
{
  "productId": "clq1234567890",
  "amount": 500000,
  "duration": 12,
  "purpose": "MEDICAL", // "EDUCATION" | "MEDICAL" | "HOME_RENOVATION" | "DEBT_CONSOLIDATION" | "EMERGENCY" | "OTHER"
  "collateral": {}, // Optional, for loans > 2M
  "documents": [] // Optional
}
```

### POST /loans/working-capital
Create a working capital loan application.
**Authentication:** Required

**Request Body:**
```json
{
  "productId": "clq1234567890",
  "amount": 1000000,
  "duration": 6,
  "purpose": "Business expansion",
  "invoices": [], // Optional
  "collateral": {}, // Optional
  "documents": [] // Optional
}
```

### POST /loans/auto
Create an auto loan application.
**Authentication:** Required

**Request Body:**
```json
{
  "productId": "clq1234567890",
  "amount": 2000000,
  "duration": 24,
  "purpose": "Vehicle purchase",
  "vehicleYear": 2020,
  "vehicleMake": "Toyota",
  "vehicleModel": "Camry",
  "vehicleMileage": 50000,
  "plateNumber": "ABC123XY",
  "collateral": {}, // Optional
  "documents": [] // Optional
}
```

### POST /loans/travel
Create a travel loan application.
**Authentication:** Required

**Request Body:**
```json
{
  "productId": "clq1234567890",
  "amount": 300000,
  "duration": 6,
  "purpose": "Travel expenses",
  "travelPurpose": "Business trip",
  "destinationCountry": "United Kingdom",
  "travelDate": "2023-12-25",
  "collateral": {}, // Optional
  "documents": [] // Optional
}
```

### POST /loans/:id/repayment
Make a loan repayment.
**Authentication:** Required

**Request Body:**
```json
{
  "amount": 50000,
  "paymentMethod": "BANK_TRANSFER",
  "reference": "PMT-12345678"
}
```

---

## Document Endpoints

### GET /documents
Get all documents.

### GET /documents/:id
Get document by ID.

---

## Notification Endpoints

### GET /notifications
Get all notifications for the current user.
**Authentication:** Required

### POST /notifications
Create a notification for the current user.
**Authentication:** Required

**Request Body:**
```json
{
  "title": "Notification Title",
  "message": "Notification message",
  "type": "INFO" // "SUCCESS" | "WARNING" | "ERROR" | "INFO"
}
```

### GET /notifications/:id
Get a notification by ID.
**Authentication:** Required

### PATCH /notifications/:id/read
Mark notification as read.
**Authentication:** Required

### GET /notifications/unread-count
Get unread notifications count.
**Authentication:** Required

### PATCH /notifications/mark-all-read
Mark all notifications as read.
**Authentication:** Required

### POST /notifications/test/:userId
Test endpoint to create a notification for a user.

---

## Admin Endpoints

All admin endpoints require admin authentication and appropriate roles.

### GET /admin/system-health
Get system health status.
**Authentication:** Required (Admin)

### GET /admin/dashboard/summary
Get dashboard summary statistics.
**Authentication:** Required (Admin)

### GET /admin/dashboard/recent-activities
Get recent platform activities.
**Authentication:** Required (Admin)

### GET /admin/dashboard/loan-stats
Get detailed loan statistics.
**Authentication:** Required (Admin)

### GET /admin/dashboard/investment-stats
Get detailed investment statistics.
**Authentication:** Required (Admin)

### GET /admin/users
Get all users with pagination and search.
**Authentication:** Required (Admin)

**Query Parameters:**
- `page`: Page number (optional)
- `limit`: Items per page (optional)
- `search`: Search by name, email or phone (optional)
- `role`: Filter by user role (optional)
- `verified`: Filter by verification status (optional)
- `isActive`: Filter by active status (optional)

### GET /admin/users/:id
Get user by ID.
**Authentication:** Required (Admin)

### GET /admin/users/:id/loans
Get user loans.
**Authentication:** Required (Admin)

### GET /admin/users/:id/investments
Get user investments.
**Authentication:** Required (Admin)

### GET /admin/loans
Get all loans with filtering.
**Authentication:** Required (Admin)

### GET /admin/loans/:id
Get loan by ID.
**Authentication:** Required (Admin)

### PUT /admin/loans/:id/status
Update loan status.
**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "status": "APPROVED",
  "notes": "Loan approved after verification"
}
```

### GET /admin/investments
Get all investments with filtering.
**Authentication:** Required (Admin)

### GET /admin/investments/:id
Get investment by ID.
**Authentication:** Required (Admin)

### PUT /admin/investments/:id/status
Update investment status.
**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "status": "ACTIVE",
  "notes": "Investment approved and activated"
}
```

### GET /admin/wallet/payment-channels
Get payment channels.
**Authentication:** Required (Admin)

### GET /admin/wallet/withdrawals
Get withdrawal requests.
**Authentication:** Required (Admin)

**Query Parameters:**
- `page`: Page number (optional)
- `limit`: Items per page (optional)
- `status`: Filter by status - "PENDING" | "COMPLETED" | "REJECTED" (optional)
- `search`: Search term (optional)

---

## Webhook Endpoints

### POST /webhooks/mono
Handle Mono API webhook notifications.

**Headers:**
- `mono-webhook-signature`: Webhook signature for verification

**Request Body:**
```json
{
  "event": "payment.successful", // or "payment.failed"
  "data": {
    "id": "payment_id",
    "reference": "transaction_reference",
    "amount": 50000,
    "status": "successful"
  }
}
```

### POST /webhooks/dot
Handle DOT API webhook notifications.

---

## Rate Limiting

Authentication endpoints have rate limiting:
- Register, Login, Admin Login: 5 requests per minute
- Resend OTP, Reset Password, Confirm Reset: 3 requests per minute

## File Upload Specifications

### Supported File Types
- Images: JPEG, PNG
- Documents: PDF, DOC, DOCX

### File Size Limits
- Maximum file size: 5MB

### Upload Endpoints
- `/users/documents` - User document uploads
- `/investments/foreign` - Payment proof for foreign investments

## Error Codes

Common error codes you may encounter:

- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `FILE_TOO_LARGE` - Uploaded file exceeds size limit
- `INVALID_FILE_TYPE` - Unsupported file type

## Testing

The API includes a test endpoint:

### GET /
Test connection to verify API is working.

**Response:**
```json
{
  "message": "Hello World!"
}
```

---

## Notes for Frontend Integration

1. **Authentication Flow:**
   - Register user → Verify email/phone → Login → Get JWT token
   - Include JWT token in all subsequent requests

2. **Profile Completion:**
   - Check profile completion status before allowing investments/loans
   - Guide users through profile completion steps

3. **File Uploads:**
   - Use FormData for multipart/form-data requests
   - Validate file types and sizes on frontend before upload

4. **Error Handling:**
   - Always check the `success` field in responses
   - Display appropriate error messages from the `error.message` field

5. **Pagination:**
   - Admin endpoints support pagination with `page` and `limit` parameters
   - Default page size is typically 10 items

6. **Real-time Updates:**
   - Consider implementing WebSocket connections for real-time notifications
   - Poll notification endpoints for updates if WebSocket is not available

7. **Security:**
   - Store JWT tokens securely (httpOnly cookies recommended)
   - Implement token refresh logic
   - Validate user permissions on frontend before showing admin features
