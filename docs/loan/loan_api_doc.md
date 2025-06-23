# Loan API Integration Documentation

## Overview

The LiteFi Loan API provides endpoints for managing loan applications, retrieving loan details, and processing repayments. The API supports four loan types: Salary Loans, Working Capital Loans, Auto Loans, and Travel Loans.

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

### 1. Get All Loans

Retrieves all loans for the authenticated user.

**Endpoint:** `GET /loans`

**Query Parameters:**
- `status` (optional): Filter loans by status (PENDING, ACTIVE, COMPLETED, REJECTED)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "loans": [
      {
        "id": "loan_123456",
        "reference": "LN-12345678",
        "amount": 500000,
        "approvedAmount": 450000,
        "status": "ACTIVE",
        "type": "SALARY",
        "interestRate": 15,
        "duration": 12,
        "totalPayable": 517500,
        "amountPaid": 172500,
        "balanceRemaining": 345000,
        "startDate": "2023-01-01T00:00:00Z",
        "maturityDate": "2024-01-01T00:00:00Z",
        "purpose": "Home renovation",
        "createdAt": "2023-01-01T00:00:00Z",
        "product": {
          "id": "product_123",
          "name": "Premium Salary Advance",
          "type": "SALARY"
        }
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  },
  "message": "Loans retrieved successfully"
}
```

### 2. Get Loan Details

Retrieves detailed information about a specific loan.

**Endpoint:** `GET /loans/{id}`

**Path Parameters:**
- `id`: The ID of the loan to retrieve

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "loan_123456",
    "reference": "LN-12345678",
    "amount": 500000,
    "approvedAmount": 450000,
    "status": "ACTIVE",
    "type": "SALARY",
    "interestRate": 15,
    "duration": 12,
    "totalPayable": 517500,
    "amountPaid": 172500,
    "balanceRemaining": 345000,
    "startDate": "2023-01-01T00:00:00Z",
    "maturityDate": "2024-01-01T00:00:00Z",
    "purpose": "Home renovation",
    "createdAt": "2023-01-01T00:00:00Z",
    "product": {
      "id": "product_123",
      "name": "Premium Salary Advance",
      "description": "Short-term salary advance with competitive rates",
      "type": "SALARY",
      "interestRate": 15,
      "minimumAmount": 50000,
      "maximumAmount": 2000000
    },
    "repaymentSchedule": [
      {
        "id": "schedule_123",
        "dueDate": "2023-02-01T00:00:00Z",
        "amount": 43125,
        "principalAmount": 37500,
        "interestAmount": 5625,
        "status": "PAID",
        "paidDate": "2023-02-01T09:15:00Z"
      },
      {
        "id": "schedule_124",
        "dueDate": "2023-03-01T00:00:00Z",
        "amount": 43125,
        "principalAmount": 37500,
        "interestAmount": 5625,
        "status": "PENDING",
        "paidDate": null
      }
    ],
    "repaymentHistory": [
      {
        "id": "payment_123",
        "amount": 43125,
        "paymentMethod": "BANK_TRANSFER",
        "reference": "TXN-98765432",
        "paidAt": "2023-02-01T09:15:00Z",
        "notes": "Monthly repayment"
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
        "type": "BANK_STATEMENT",
        "url": "https://cdn.litefi.ng/uploads/documents/bank/user_123_statement.pdf",
        "verified": true
      }
    ]
  },
  "message": "Loan retrieved successfully"
}
```

### 3. Get Loan Products

Retrieves all available loan products.

**Endpoint:** `GET /loans/products`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product_123",
        "name": "Premium Salary Advance",
        "description": "Short-term salary advance with competitive rates",
        "type": "SALARY",
        "minimumAmount": 50000,
        "maximumAmount": 2000000,
        "interestRate": 15,
        "duration": 12,
        "serviceFee": 1.5,
        "processingFee": 1,
        "requiresGuarantor": false,
        "requiresCollateral": false,
        "active": true
      },
      {
        "id": "product_124",
        "name": "Working Capital Loan",
        "description": "Business financing for operational expenses",
        "type": "WORKING_CAPITAL",
        "minimumAmount": 500000,
        "maximumAmount": 10000000,
        "interestRate": 18,
        "duration": 24,
        "serviceFee": 2,
        "processingFee": 1.5,
        "requiresGuarantor": true,
        "requiresCollateral": false,
        "active": true
      }
    ]
  },
  "message": "Loan products retrieved successfully"
}
```

### 4. Apply for Salary Loan

Creates a new salary loan application.

**Endpoint:** `POST /loans/salary`

**Request Body:**
```json
{
  "productId": "product_123",
  "amount": 500000,
  "duration": 12,
  "purpose": "Home renovation",
  "employerName": "Tech Company Ltd",
  "monthlySalary": 350000,
  "salaryDay": 25,
  "workEmail": "john@techcompany.com",
  "documentIds": [
    "doc_123",
    "doc_124",
    "doc_125"
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "loan_123456",
    "reference": "LN-12345678",
    "amount": 500000,
    "status": "PENDING",
    "type": "SALARY",
    "purpose": "Home renovation",
    "createdAt": "2023-01-01T00:00:00Z"
  },
  "message": "Loan application submitted successfully"
}
```

### 5. Apply for Working Capital Loan

Creates a new working capital loan application.

**Endpoint:** `POST /loans/working-capital`

**Request Body:**
```json
{
  "productId": "product_124",
  "amount": 2000000,
  "duration": 24,
  "purpose": "Inventory purchase",
  "businessName": "My Business Ltd",
  "businessType": "LLC",
  "registrationNumber": "RC123456",
  "monthlyRevenue": 5000000,
  "documentIds": [
    "doc_126",
    "doc_127",
    "doc_128"
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "loan_123457",
    "reference": "LN-12345679",
    "amount": 2000000,
    "status": "PENDING",
    "type": "WORKING_CAPITAL",
    "purpose": "Inventory purchase",
    "createdAt": "2023-01-01T00:00:00Z"
  },
  "message": "Loan application submitted successfully"
}
```

### 6. Apply for Auto Loan

Creates a new auto loan application.

**Endpoint:** `POST /loans/auto`

**Request Body:**
```json
{
  "productId": "product_125",
  "amount": 5000000,
  "duration": 36,
  "purpose": "Vehicle purchase",
  "vehicleDetails": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2022,
    "mileage": 5000,
    "color": "Black",
    "vin": "1HGBH41JXMN109186"
  },
  "documentIds": [
    "doc_129",
    "doc_130",
    "doc_131",
    "doc_132"
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "loan_123458",
    "reference": "LN-12345680",
    "amount": 5000000,
    "status": "PENDING",
    "type": "AUTO",
    "purpose": "Vehicle purchase",
    "createdAt": "2023-01-01T00:00:00Z"
  },
  "message": "Loan application submitted successfully"
}
```

### 7. Apply for Travel Loan

Creates a new travel loan application.

**Endpoint:** `POST /loans/travel`

**Request Body:**
```json
{
  "productId": "product_126",
  "amount": 1000000,
  "duration": 12,
  "purpose": "International travel",
  "destination": "United Kingdom",
  "travelDate": "2023-06-15T00:00:00Z",
  "returnDate": "2023-06-30T00:00:00Z",
  "documentIds": [
    "doc_133",
    "doc_134",
    "doc_135"
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "loan_123459",
    "reference": "LN-12345681",
    "amount": 1000000,
    "status": "PENDING",
    "type": "TRAVEL",
    "purpose": "International travel",
    "createdAt": "2023-01-01T00:00:00Z"
  },
  "message": "Loan application submitted successfully"
}
```

### 8. Make Loan Repayment

Makes a repayment for a specific loan.

**Endpoint:** `POST /loans/{id}/repayment`

**Path Parameters:**
- `id`: The ID of the loan to make a repayment for

**Request Body:**
```json
{
  "amount": 43125,
  "paymentMethod": "BANK_TRANSFER",
  "reference": "TXN-12345678"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "payment_124",
    "loanId": "loan_123456",
    "amount": 43125,
    "paymentMethod": "BANK_TRANSFER",
    "reference": "TXN-12345678",
    "status": "COMPLETED",
    "paidAt": "2023-03-01T10:15:00Z"
  },
  "message": "Loan repayment processed successfully"
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

### Not Found (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Loan not found"
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