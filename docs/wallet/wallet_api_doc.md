# Wallet API Integration Documentation

## Overview

The LiteFi Wallet API provides endpoints for managing user wallets, including checking balances, funding wallets, withdrawing funds, and viewing transaction history.

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

### 1. Get Wallet Balance

Retrieves the current wallet balance for the authenticated user.

**Endpoint:** `GET /wallet/user/me`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "wallet_123456",
    "userId": "user_123456",
    "balance": 25000,
    "currency": "NGN",
    "lastUpdated": "2023-01-01T10:30:00Z",
    "isActive": true
  },
  "message": "Wallet retrieved successfully"
}
```

### 2. Get Wallet Transactions

Retrieves wallet transactions for the authenticated user.

**Endpoint:** `GET /wallet/transactions`

**Query Parameters:**
- `type` (optional): Filter by transaction type (DEPOSIT, WITHDRAWAL, LOAN_DISBURSEMENT, LOAN_REPAYMENT, INVESTMENT)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_123456",
        "reference": "TXN-12345678",
        "type": "DEPOSIT",
        "amount": 50000,
        "fee": 0,
        "status": "COMPLETED",
        "description": "Bank transfer deposit",
        "createdAt": "2023-01-01T09:30:00Z",
        "completedAt": "2023-01-01T09:35:00Z"
      },
      {
        "id": "txn_123457",
        "reference": "TXN-12345679",
        "type": "WITHDRAWAL",
        "amount": 25000,
        "fee": 100,
        "status": "COMPLETED",
        "description": "Withdrawal to bank account",
        "createdAt": "2023-01-02T14:20:00Z",
        "completedAt": "2023-01-02T14:25:00Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  },
  "message": "Wallet transactions retrieved successfully"
}
```

### 3. Fund Wallet (Direct Payment)

Initiates a wallet funding transaction using Mono direct payment.

**Endpoint:** `POST /wallet/direct-payment/create`

**Request Body:**
```json
{
  "amount": 50000,
  "description": "Wallet funding",
  "redirectUrl": "https://app.litefi.ng/wallet/success",
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_123458",
    "reference": "TXN-12345680",
    "amount": 50000,
    "fee": 0,
    "status": "PENDING",
    "paymentLink": "https://payment.mono.co/pay/12345678",
    "expiresAt": "2023-01-03T15:30:00Z"
  },
  "message": "Wallet funding initiated successfully"
}
```

### 4. Create Virtual Account

Creates a virtual account for the authenticated user to receive funds.

**Endpoint:** `POST /wallet/virtual-account/create`

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "accountNumber": "3588020135",
    "accountName": "John Doe",
    "bankName": "LiteFi MFB",
    "reference": "LF-12345678"
  },
  "message": "Virtual account created successfully"
}
```

### 5. Get Virtual Account Details

Retrieves the virtual account details for the authenticated user, including both regular virtual account details and external ID details from DOT API.

**Endpoint:** `GET /wallet/virtual-account/details`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Virtual account details retrieved successfully",
  "data": {
    "accountDetails": {
      "id": "va_123456789",
      "accountNumber": "1234567890",
      "accountName": "John Doe",
      "bankName": "DOT Bank",
      "status": "ACTIVE",
      "createdAt": "2025-06-16T10:30:00.000Z",
      "updatedAt": "2025-06-16T10:30:00.000Z"
    },
    "externalDetails": {
      "id": "ext_123456789",
      "accountNumber": "0987654321",
      "accountName": "John Doe",
      "bankName": "DOT Bank",
      "status": "ACTIVE",
      "createdAt": "2025-06-16T10:30:00.000Z",
      "updatedAt": "2025-06-16T10:30:00.000Z"
    }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Virtual account not found",
  "error": {
    "code": "VIRTUAL_ACCOUNT_NOT_FOUND",
    "details": "No virtual account found for this user"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "You must be logged in to access this resource"
  }
}
```

### 6. Retrieves the Mono public key for client-side integration.

**Endpoint:** `GET /wallet/mono/public-key`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "publicKey": "test_pk_12345678abcdefgh"
  },
  "message": "Mono public key retrieved successfully"
}
```

### 7. Verify Transaction Status

Verifies the status of a transaction using its reference.

**Endpoint:** `GET /wallet/transaction/verify/{reference}`

**Path Parameters:**
- `reference`: The reference of the transaction to verify

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reference": "TXN-12345680",
    "amount": 50000,
    "status": "COMPLETED",
    "paymentMethod": "BANK_TRANSFER",
    "paidAt": "2023-01-01T10:30:00Z"
  },
  "message": "Transaction verified successfully"
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
        "field": "amount",
        "message": "Amount must be greater than 0"
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

### Insufficient Funds (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Insufficient funds in wallet"
  }
}
```

### Not Found (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Wallet not found"
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

## Virtual Account Details

### Get Virtual Account Details

Retrieves the virtual account details for the authenticated user, including both regular virtual account details and external ID details from DOT API.

#### Endpoint
```
GET /wallet/virtual-account/details
```

#### Headers
```
Authorization: Bearer {jwt_token}
```

#### Response

##### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Virtual account details retrieved successfully",
  "data": {
    "accountDetails": {
      "id": "va_123456789",
      "accountNumber": "1234567890",
      "accountName": "John Doe",
      "bankName": "DOT Bank",
      "status": "ACTIVE",
      "createdAt": "2025-06-16T10:30:00.000Z",
      "updatedAt": "2025-06-16T10:30:00.000Z"
    },
    "externalDetails": {
      "id": "ext_123456789",
      "accountNumber": "0987654321",
      "accountName": "John Doe",
      "bankName": "DOT Bank",
      "status": "ACTIVE",
      "createdAt": "2025-06-16T10:30:00.000Z",
      "updatedAt": "2025-06-16T10:30:00.000Z"
    }
  }
}
```

##### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Virtual account not found",
  "error": {
    "code": "VIRTUAL_ACCOUNT_NOT_FOUND",
    "details": "No virtual account found for this user"
  }
}
```

##### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "You must be logged in to access this resource"
  }
}
```

#### Implementation Notes

1. **Data Sources**
   - Regular virtual account details are fetched from the DOT API
   - External ID-based virtual account details are fetched using the `getVirtualAccountByExternalId` method
   - Both sets of details are combined in the response

2. **Account Status Values**
   - `ACTIVE`: Account is ready for transactions
   - `PENDING`: Account is being created
   - `SUSPENDED`: Account is temporarily suspended
   - `CLOSED`: Account is permanently closed

3. **Security**
   - Requires valid JWT token
   - User can only access their own virtual account details
   - Sensitive data is filtered from the response

4. **Error Handling**
   - Returns 404 if no virtual account is found
   - Returns 401 if user is not authenticated
   - Returns 500 if there's an error fetching from DOT API 
   