# LiteFi API Documentation Summary

This document provides a summary of all the API endpoints available in the LiteFi Backend.

## Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate token
- `POST /auth/verify` - Verify OTP code
- `POST /auth/resend-otp` - Resend OTP code

## Users
- `GET /users/profile` - Get the currently authenticated user profile
- `PUT /users/profile` - Update user profile
- `POST /users/change-password` - Change user password
- `GET /users/:id` - Get user by ID (admin only)
- `GET /users` - Get all users (admin only)

## Wallet
- `GET /wallet/balance` - Get wallet balance
- `POST /wallet/fund` - Fund wallet
- `POST /wallet/withdraw` - Withdraw from wallet
- `GET /wallet/transactions` - Get wallet transactions
- `GET /wallet/account-details` - Get account details

## Investments
- `GET /investments` - Get all investments for authenticated user
- `GET /investments/plans` - Get all available investment plans
- `GET /investments/:id` - Get investment details by ID
- `POST /investments/calculate` - Calculate investment returns
- `POST /investments` - Create a new investment
- `POST /investments/foreign` - Create a foreign currency investment
- `POST /investments/:id/withdraw` - Request investment withdrawal

## Loans
- `GET /loans` - Get all loans for authenticated user
- `GET /loans/products` - Get all available loan products
- `GET /loans/:id` - Get loan details by ID
- `POST /loans/salary` - Create a salary loan application
- `POST /loans/working-capital` - Create a working capital loan application
- `POST /loans/auto` - Create an auto loan application
- `POST /loans/travel` - Create a travel loan application
- `PUT /loans/:id` - Update loan status (admin only)
- `POST /loans/:id/repayment` - Make a loan repayment

## Documents
- `POST /documents/upload` - Upload a document
- `GET /documents/:id` - Get document by ID
- `DELETE /documents/:id` - Delete document by ID
- `GET /documents` - Get all documents for authenticated user

## SMS
- `POST /sms/send` - Send SMS
- `POST /sms/verify` - Verify SMS OTP

## Notifications
- `GET /notifications` - Get all notifications for authenticated user
- `GET /notifications/:id` - Get notification by ID
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all notifications as read

## Admin
- `GET /admin/dashboard` - Get admin dashboard statistics
- `GET /admin/users` - Get all users (with filtering)
- `PUT /admin/users/:id` - Update user (admin only)
- `PUT /admin/users/:id/status` - Update user status (admin only)
- `GET /admin/loans` - Get all loans (with filtering)
- `PUT /admin/loans/:id` - Update loan status (admin only)
- `GET /admin/investments` - Get all investments (with filtering)
- `PUT /admin/investments/:id` - Update investment status (admin only)
- `GET /admin/transactions` - Get all transactions (with filtering)
- `GET /admin/logs` - Get activity logs (admin only)

## Webhook
- `POST /webhooks/mono` - Mono API webhook
- `POST /webhooks/dot` - DOT API webhook
- `POST /webhooks/payments` - Payment gateway webhook

## User Profile and KYC

### KYC Verification
- `POST /users/verify/bvn` - Verify BVN
- `POST /users/verify/nin` - Verify NIN
- `GET /users/kyc-status` - Get KYC verification status

### Eligibility Checks
- `GET /users/eligibility` - Get combined loan and investment eligibility status
- `GET /users/eligibility/investment` - Check investment eligibility
- `GET /users/eligibility/loan` - Check loan eligibility

### Profile Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `PUT /users/employment` - Update employment information
- `PUT /users/business` - Update business information
- `PUT /users/next-of-kin` - Update next of kin
- `PUT /users/guarantor` - Update guarantor information

### Bank Accounts
- `POST /users/bank-accounts` - Add bank account
- `GET /users/bank-accounts` - Get bank accounts
- `PUT /users/bank-accounts/:id/default` - Set default bank account
- `DELETE /users/bank-accounts/:id` - Delete bank account

### Documents
- `POST /users/documents/:type` - Upload document
- `GET /users/documents` - Get documents
- `DELETE /users/documents/:id` - Delete document
- `POST /users/profile-picture` - Upload profile picture

### Security
- `POST /users/security/change-password` - Change password
- `POST /users/security/transaction-pin/setup` - Set up transaction PIN
- `POST /users/security/transaction-pin/verify` - Verify transaction PIN

## Response Format

All endpoints follow a standard response format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error message"
  }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Standard endpoints: 100 requests per minute
- Authentication endpoints: 10 requests per minute
- KYC verification endpoints: 5 requests per minute

## Pagination

List endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sort field (default varies by endpoint)
- `order`: Sort order ("asc" or "desc", default: "desc")

## Notes

1. **Authentication**:
   - All endpoints except those under `/auth` and some `/webhooks` require authentication
   - Authentication is done using JWT Bearer tokens

2. **Authorization**:
   - Endpoints marked with "admin only" require admin role
   - Some endpoints have specific role requirements

3. **Rate Limiting**:
   - API endpoints are rate-limited to prevent abuse
   - Authentication endpoints have stricter rate limits

4. **API Documentation**:
   - Full API documentation is available at `/api` when the server is running
   - Postman collection can be generated using the provided script

5. **Status Codes**:
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Internal Server Error 