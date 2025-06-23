# Investment API Integration Documentation

## Overview

The LiteFi Investment API provides endpoints for managing investment activities, including creating investments, calculating returns, and tracking investment performance.

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

### 1. Get All Investments

Retrieves all investments for the authenticated user.

**Endpoint:** `GET /investments`

**Query Parameters:**
- `status` (optional): Filter by investment status (PENDING, ACTIVE, MATURED, WITHDRAWN)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "investments": [
      {
        "id": "inv_123456",
        "reference": "INV-12345678",
        "name": "My Retirement Fund",
        "amount": 500000,
        "status": "ACTIVE",
        "planType": "NAIRA",
        "currency": "NGN",
        "interestRate": 18,
        "tenure": 12,
        "startDate": "2023-01-01T00:00:00Z",
        "maturityDate": "2024-01-01T00:00:00Z",
        "expectedReturns": 590000,
        "createdAt": "2023-01-01T00:00:00Z",
        "plan": {
          "id": "plan_123",
          "name": "Premium Naira Investment",
          "type": "NAIRA"
        }
      },
      {
        "id": "inv_123457",
        "reference": "INV-12345679",
        "name": "Foreign Currency Investment",
        "amount": 1000,
        "status": "PENDING",
        "planType": "FOREIGN",
        "currency": "USD",
        "interestRate": 10,
        "tenure": 6,
        "createdAt": "2023-01-15T00:00:00Z",
        "plan": {
          "id": "plan_124",
          "name": "USD Investment",
          "type": "FOREIGN"
        }
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  },
  "message": "Investments retrieved successfully"
}
```

### 2. Get Investment Details

Retrieves detailed information about a specific investment.

**Endpoint:** `GET /investments/{id}`

**Path Parameters:**
- `id`: The ID of the investment to retrieve

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "inv_123456",
    "reference": "INV-12345678",
    "name": "My Retirement Fund",
    "amount": 500000,
    "status": "ACTIVE",
    "planType": "NAIRA",
    "currency": "NGN",
    "interestRate": 18,
    "tenure": 12,
    "startDate": "2023-01-01T00:00:00Z",
    "maturityDate": "2024-01-01T00:00:00Z",
    "expectedReturns": 590000,
    "totalInterest": 90000,
    "createdAt": "2023-01-01T00:00:00Z",
    "activatedAt": "2023-01-01T00:00:00Z",
    "plan": {
      "id": "plan_123",
      "name": "Premium Naira Investment",
      "description": "High-yield naira investment with competitive rates",
      "type": "NAIRA",
      "minimumAmount": 50000,
      "maximumAmount": 100000000,
      "minimumTenure": 3,
      "maximumTenure": 24
    },
    "interestPayments": [
      {
        "id": "int_123",
        "amount": 7500,
        "status": "PAID",
        "paymentDate": "2023-02-01T00:00:00Z"
      },
      {
        "id": "int_124",
        "amount": 7500,
        "status": "PAID",
        "paymentDate": "2023-03-01T00:00:00Z"
      }
    ],
    "documents": [
      {
        "id": "doc_123",
        "type": "INVESTMENT_CERTIFICATE",
        "url": "https://cdn.litefi.ng/uploads/investments/certificates/inv_123456.pdf",
        "createdAt": "2023-01-01T00:00:00Z"
      }
    ]
  },
  "message": "Investment retrieved successfully"
}
```

### 3. Get Investment Plans

Retrieves all available investment plans.

**Endpoint:** `GET /investments/plans`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "plan_123",
        "name": "Premium Naira Investment",
        "description": "High-yield naira investment with competitive rates",
        "type": "NAIRA",
        "currency": "NGN",
        "minimumAmount": 50000,
        "maximumAmount": 100000000,
        "minimumTenure": 3,
        "maximumTenure": 24,
        "interestRates": [
          {
            "minTenure": 3,
            "maxTenure": 6,
            "rate": 15
          },
          {
            "minTenure": 7,
            "maxTenure": 12,
            "rate": 18
          },
          {
            "minTenure": 13,
            "maxTenure": 24,
            "rate": 20
          }
        ],
        "features": [
          "Competitive interest rates",
          "Flexible tenure options",
          "Early withdrawal available"
        ],
        "active": true
      },
      {
        "id": "plan_124",
        "name": "USD Investment",
        "description": "Foreign currency investment in USD",
        "type": "FOREIGN",
        "currency": "USD",
        "minimumAmount": 100,
        "maximumAmount": 100000,
        "minimumTenure": 3,
        "maximumTenure": 12,
        "interestRates": [
          {
            "minTenure": 3,
            "maxTenure": 6,
            "rate": 8
          },
          {
            "minTenure": 7,
            "maxTenure": 12,
            "rate": 10
          }
        ],
        "features": [
          "Dollar-denominated returns",
          "Protection against currency fluctuations",
          "International exposure"
        ],
        "active": true
      }
    ]
  },
  "message": "Investment plans retrieved successfully"
}
```

### 4. Calculate Investment Returns

Calculates the potential returns for an investment based on amount, tenure, and plan.

**Endpoint:** `POST /investments/calculate`

**Request Body:**
```json
{
  "planId": "plan_123",
  "amount": 500000,
  "tenure": 12
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "amount": 500000,
    "interestRate": 18,
    "tenure": 12,
    "interestAmount": 90000,
    "totalReturns": 590000,
    "maturityDate": "2024-01-01T00:00:00Z",
    "monthlyInterest": 7500
  },
  "message": "Investment calculation successful"
}
```

### 5. Create Investment

Creates a new investment for the authenticated user.

**Endpoint:** `POST /investments`

**Request Body:**
```json
{
  "planId": "plan_123",
  "amount": 500000,
  "name": "My Retirement Fund",
  "tenure": 12,
  "currency": "NGN",
  "agreementAccepted": true,
  "upfrontInterestPayment": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "inv_123456",
    "reference": "INV-12345678",
    "name": "My Retirement Fund",
    "amount": 500000,
    "status": "PENDING",
    "planType": "NAIRA",
    "currency": "NGN",
    "interestRate": 18,
    "tenure": 12,
    "expectedReturns": 590000,
    "createdAt": "2023-01-01T00:00:00Z",
    "paymentInstructions": {
      "accountNumber": "0123456789",
      "accountName": "LiteFi Investment",
      "bankName": "First Bank",
      "reference": "INV-12345678"
    }
  },
  "message": "Investment created successfully"
}
```

### 6. Create Foreign Investment

Creates a new foreign currency investment for the authenticated user.

**Endpoint:** `POST /investments/foreign`

**Request Body:**
```json
{
  "planId": "plan_124",
  "amount": 1000,
  "name": "Foreign Currency Investment",
  "tenure": 6,
  "currency": "USD",
  "agreementAccepted": true,
  "sourceOfFunds": "SAVINGS",
  "fundingMethod": "BANK_TRANSFER"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "inv_123457",
    "reference": "INV-12345679",
    "name": "Foreign Currency Investment",
    "amount": 1000,
    "status": "PENDING",
    "planType": "FOREIGN",
    "currency": "USD",
    "interestRate": 8,
    "tenure": 6,
    "expectedReturns": 1080,
    "createdAt": "2023-01-15T00:00:00Z",
    "paymentInstructions": {
      "accountNumber": "0123456789",
      "accountName": "LiteFi USD Investment",
      "bankName": "Access Bank",
      "reference": "INV-12345679"
    }
  },
  "message": "Foreign investment created successfully"
}
```

### 7. Withdraw Investment

Requests withdrawal of a matured investment.

**Endpoint:** `POST /investments/{id}/withdraw`

**Path Parameters:**
- `id`: The ID of the investment to withdraw

**Request Body:**
```json
{
  "withdrawalReason": "PERSONAL_USE",
  "bankAccountId": "bank_123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "inv_123456",
    "status": "WITHDRAWN",
    "withdrawalAmount": 590000,
    "withdrawalReference": "WTH-12345678",
    "withdrawalDate": "2024-01-02T00:00:00Z",
    "estimatedPaymentDate": "2024-01-03T00:00:00Z"
  },
  "message": "Investment withdrawal processed successfully"
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
        "message": "Amount must be greater than minimum investment amount"
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
    "message": "Investment not found"
  }
}
```

### Business Rule Violation (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Investment is not eligible for withdrawal",
    "details": [
      {
        "reason": "Investment has not reached maturity date"
      }
    ]
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