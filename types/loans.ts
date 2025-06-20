export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  type: 'SALARY' | 'WORKING_CAPITAL' | 'AUTO' | 'TRAVEL';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  duration: number; // in months
  startDate: string | null;
  dueDate: string | null;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  productId: string;
  product?: LoanProduct;
  repayments?: LoanRepayment[];
  createdAt: string;
  updatedAt: string;
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID';
  createdAt: string;
  updatedAt: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  reference: string;
  status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplication {
  productId: string;
  amount: number;
  duration: number;
  purpose: string;
  documents?: string[];
}
