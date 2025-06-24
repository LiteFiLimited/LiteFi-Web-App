# Chart Implementation Guide

## Overview
This guide details the implementation of charts in the LiteFi frontend using Recharts library, specifically for investment portfolio performance and wallet activity visualization.

## Backend API Endpoints

### 1. Investment Overview (`GET /investments/overview/:id`)

#### Response Structure
```typescript
{
  status: 'success',
  data: {
    investmentId: string;      // e.g. "QWKSJ"
    principalAmount: number;   // e.g. 100000
    tenure: number;           // e.g. 12 (months)
    startDate: string;        // e.g. "2025-04-05"
    maturityDate: string;     // e.g. "2026-04-05"
    earnings: number;         // e.g. 75000
    withholdingTax: number;   // e.g. 2000
    portfolioPerformance: {
      date: string;           // e.g. "2025-01"
      value: number;          // e.g. 59000
    }[]
  },
  message: string;
}
```

#### Frontend Implementation
```jsx
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

// Component usage
<AreaChart width={1000} height={400} data={portfolioPerformance}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="value" fill="#8884d8" />
</AreaChart>
```

### 2. Wallet Activity (`GET /wallet/activity`)

#### Query Parameters
- `period`: 'week' | 'month' | 'year' (default: 'week')

#### Response Structure
```typescript
{
  status: 'success',
  data: {
    totalInflow: number;      // e.g. 18883902
    totalOutflow: number;     // e.g. 17932032
    weeklyActivity: {
      week: string;          // e.g. "Week 1"
      inflow: number;        // e.g. 300000
      outflow: number;       // e.g. 198000
    }[]
  },
  message: string;
}
```

#### Frontend Implementation
```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Component usage
<BarChart width={1000} height={400} data={weeklyActivity}>
  <XAxis dataKey="week" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="inflow" fill="#8884d8" />
  <Bar dataKey="outflow" fill="#82ca9d" />
</BarChart>
```

## Database Schema Updates

### Transaction Types
The wallet activity endpoint uses specific transaction types to categorize inflows and outflows:

#### Credit Transactions (Inflows)
- DEPOSIT
- INVESTMENT_RETURN
- SYSTEM_CREDIT

#### Debit Transactions (Outflows)
- WITHDRAWAL
- INVESTMENT
- LOAN_REPAYMENT
- SYSTEM_DEBIT

### Required Database Migration

```sql
-- Update TransactionType enum if not already present
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'DEPOSIT';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'WITHDRAWAL';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'INVESTMENT';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'INVESTMENT_RETURN';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'LOAN_REPAYMENT';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'SYSTEM_CREDIT';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'SYSTEM_DEBIT';
```

## Implementation Notes

1. Investment Portfolio Performance
- Calculates expected value at each point in time based on:
  - Principal amount
  - Monthly interest rate
  - Time elapsed
- Shows value progression from start date to maturity date

2. Wallet Activity Visualization
- Groups transactions by week
- Separates credits (inflows) and debits (outflows)
- Supports different time periods (week/month/year)
- Provides total sums and weekly breakdowns

## Testing

1. Investment Overview
```bash
# Test investment overview endpoint
curl -X GET "http://localhost:3001/investments/overview/INVESTMENT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. Wallet Activity
```bash
# Test wallet activity endpoint
curl -X GET "http://localhost:3001/wallet/activity?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Frontend Integration Steps

1. Install Required Dependencies
```bash
npm install recharts date-fns
```

2. Create Chart Components
```jsx
// InvestmentChart.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const InvestmentChart = ({ data }) => (
  <AreaChart width={1000} height={400} data={data}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="value" fill="#8884d8" />
  </AreaChart>
);

// WalletChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const WalletChart = ({ data }) => (
  <BarChart width={1000} height={400} data={data}>
    <XAxis dataKey="week" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="inflow" fill="#8884d8" />
    <Bar dataKey="outflow" fill="#82ca9d" />
  </BarChart>
);
```

3. Implement Data Fetching
```typescript
// api.ts
export const fetchInvestmentOverview = async (id: string) => {
  const response = await fetch(`/investments/overview/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const fetchWalletActivity = async (period: 'week' | 'month' | 'year' = 'week') => {
  const response = await fetch(`/wallet/activity?period=${period}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.json();
};
```

## Error Handling

Both endpoints implement proper error handling:

1. Investment Overview Errors:
- 404: Investment not found
- 403: Unauthorized access
- 500: Server error

2. Wallet Activity Errors:
- 404: Wallet not found
- 403: Unauthorized access
- 400: Invalid period parameter
- 500: Server error

## Security Considerations

1. Authentication
- Both endpoints require JWT authentication
- Users can only access their own data

2. Data Validation
- All numeric values are properly validated
- Date ranges are checked for validity
- Transaction types are strictly typed

## Performance Optimization

1. Data Aggregation
- Transactions are aggregated on the server side
- Only necessary data points are sent to the frontend

2. Caching Strategy
- Consider implementing caching for frequently accessed data
- Use appropriate cache invalidation strategies

## Maintenance Notes

1. Database Updates
- Run migrations when adding new transaction types
- Keep enum values synchronized between Prisma schema and code

2. API Versioning
- Consider versioning these endpoints if making breaking changes
- Maintain backward compatibility when possible 