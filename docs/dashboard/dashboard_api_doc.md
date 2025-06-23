# Dashboard API Integration Documentation

## Overview

The LiteFi Dashboard API provides endpoints for retrieving summary information about the user's financial activities, including wallet balance, investments, loans, and upcoming payments. These endpoints are designed to populate the main dashboard view in the LiteFi application.

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

### 1. Get Dashboard Summary

Retrieves a comprehensive summary of the user's financial data for the dashboard.

**Endpoint:** `GET /dashboard/summary`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "wallet": {
      "balance": 25000,
      "currency": "NGN",
      "lastTransaction": {
        "id": "txn_123456",
        "type": "DEPOSIT",
        "amount": 50000,
        "status": "COMPLETED",
        "createdAt": "2023-01-01T09:30:00Z"
      }
    },
    "investments": {
      "totalInvested": 1500000,
      "activeInvestments": 3,
      "totalReturns": 270000,
      "latestInvestment": {
        "id": "inv_123456",
        "name": "My Retirement Fund",
        "amount": 500000,
        "status": "ACTIVE",
        "maturityDate": "2024-01-01T00:00:00Z"
      }
    },
    "loans": {
      "totalBorrowed": 750000,
      "activeLoans": 2,
      "outstandingAmount": 500000,
      "latestLoan": {
        "id": "loan_123456",
        "type": "SALARY",
        "amount": 500000,
        "status": "ACTIVE",
        "nextPaymentDate": "2023-02-01T00:00:00Z",
        "nextPaymentAmount": 43125
      }
    },
    "upcomingPayments": [
      {
        "id": "payment_123",
        "type": "LOAN_REPAYMENT",
        "loanId": "loan_123456",
        "amount": 43125,
        "dueDate": "2023-02-01T00:00:00Z",
        "status": "PENDING"
      },
      {
        "id": "payment_124",
        "type": "LOAN_REPAYMENT",
        "loanId": "loan_123457",
        "amount": 35000,
        "dueDate": "2023-02-05T00:00:00Z",
        "status": "PENDING"
      }
    ]
  },
  "message": "Dashboard summary retrieved successfully"
}
```

### 2. Get Wallet Balance

Retrieves the current wallet balance for quick display on the dashboard.

**Endpoint:** `GET /dashboard/wallet-balance`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "balance": 25000,
    "currency": "NGN",
    "lastUpdated": "2023-01-01T10:30:00Z"
  },
  "message": "Wallet balance retrieved successfully"
}
```

### 3. Get Investment Portfolio Summary

Retrieves a summary of the user's investment portfolio for the dashboard.

**Endpoint:** `GET /dashboard/investment-portfolio`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalInvested": 1500000,
    "activeInvestments": 3,
    "totalReturns": 270000,
    "portfolioBreakdown": [
      {
        "type": "NAIRA",
        "amount": 1000000,
        "percentage": 66.67
      },
      {
        "type": "FOREIGN",
        "amount": 500000,
        "percentage": 33.33
      }
    ],
    "recentInvestments": [
      {
        "id": "inv_123456",
        "name": "My Retirement Fund",
        "amount": 500000,
        "status": "ACTIVE",
        "maturityDate": "2024-01-01T00:00:00Z",
        "expectedReturns": 590000
      },
      {
        "id": "inv_123457",
        "name": "Foreign Currency Investment",
        "amount": 500000,
        "status": "ACTIVE",
        "maturityDate": "2023-07-15T00:00:00Z",
        "expectedReturns": 540000
      }
    ]
  },
  "message": "Investment portfolio retrieved successfully"
}
```

### 4. Get Loan and Repayments Summary

Retrieves a summary of the user's loans and upcoming repayments for the dashboard.

**Endpoint:** `GET /dashboard/loan-summary`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalBorrowed": 750000,
    "activeLoans": 2,
    "outstandingAmount": 500000,
    "loanBreakdown": [
      {
        "type": "SALARY",
        "amount": 500000,
        "percentage": 66.67
      },
      {
        "type": "PERSONAL",
        "amount": 250000,
        "percentage": 33.33
      }
    ],
    "activeLoans": [
      {
        "id": "loan_123456",
        "reference": "LN-12345678",
        "type": "SALARY",
        "amount": 500000,
        "status": "ACTIVE",
        "outstandingAmount": 345000,
        "nextPaymentDate": "2023-02-01T00:00:00Z",
        "nextPaymentAmount": 43125
      },
      {
        "id": "loan_123457",
        "reference": "LN-12345679",
        "type": "PERSONAL",
        "amount": 250000,
        "status": "ACTIVE",
        "outstandingAmount": 155000,
        "nextPaymentDate": "2023-02-05T00:00:00Z",
        "nextPaymentAmount": 35000
      }
    ]
  },
  "message": "Loan summary retrieved successfully"
}
```

### 5. Get Upcoming Payments

Retrieves all upcoming payments (loan repayments and investment maturities) for the dashboard.

**Endpoint:** `GET /dashboard/upcoming-payments`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "upcomingPayments": [
      {
        "id": "payment_123",
        "type": "LOAN_REPAYMENT",
        "loanId": "loan_123456",
        "reference": "LN-12345678",
        "amount": 43125,
        "dueDate": "2023-02-01T00:00:00Z",
        "status": "PENDING"
      },
      {
        "id": "payment_124",
        "type": "LOAN_REPAYMENT",
        "loanId": "loan_123457",
        "reference": "LN-12345679",
        "amount": 35000,
        "dueDate": "2023-02-05T00:00:00Z",
        "status": "PENDING"
      },
      {
        "id": "inv_123457",
        "type": "INVESTMENT_MATURITY",
        "investmentId": "inv_123457",
        "reference": "INV-12345679",
        "amount": 540000,
        "dueDate": "2023-07-15T00:00:00Z",
        "status": "UPCOMING"
      }
    ]
  },
  "message": "Upcoming payments retrieved successfully"
}
```

### 6. Get Recent Transactions

Retrieves recent transactions across all financial activities for the dashboard activity feed.

**Endpoint:** `GET /dashboard/recent-transactions`

**Query Parameters:**
- `limit` (optional): Number of transactions to return (default: 5, max: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recentTransactions": [
      {
        "id": "txn_123456",
        "type": "DEPOSIT",
        "category": "WALLET",
        "amount": 50000,
        "status": "COMPLETED",
        "description": "Bank transfer deposit",
        "createdAt": "2023-01-01T09:30:00Z"
      },
      {
        "id": "txn_123457",
        "type": "INVESTMENT_CREATION",
        "category": "INVESTMENT",
        "amount": 500000,
        "status": "COMPLETED",
        "description": "Created investment: My Retirement Fund",
        "createdAt": "2023-01-01T10:15:00Z"
      },
      {
        "id": "txn_123458",
        "type": "LOAN_DISBURSEMENT",
        "category": "LOAN",
        "amount": 500000,
        "status": "COMPLETED",
        "description": "Loan disbursement: Salary Loan",
        "createdAt": "2023-01-01T11:30:00Z"
      },
      {
        "id": "txn_123459",
        "type": "LOAN_REPAYMENT",
        "category": "LOAN",
        "amount": 43125,
        "status": "COMPLETED",
        "description": "Loan repayment: Salary Loan",
        "createdAt": "2023-01-15T14:45:00Z"
      },
      {
        "id": "txn_123460",
        "type": "INTEREST_PAYMENT",
        "category": "INVESTMENT",
        "amount": 7500,
        "status": "COMPLETED",
        "description": "Interest payment: My Retirement Fund",
        "createdAt": "2023-01-31T16:20:00Z"
      }
    ]
  },
  "message": "Recent transactions retrieved successfully"
}
```

## Error Responses

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
    "message": "Resource not found"
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