export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  duration: number;
  startDate: string | null;
  maturityDate: string | null;
  status: 'PENDING' | 'ACTIVE' | 'MATURED' | 'WITHDRAWN' | 'REJECTED';
  currency: string;
  planId: string;
  plan?: InvestmentPlan;
  returns?: {
    totalInterest: number;
    monthlyInterest: number;
    maturityAmount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentWithdrawal {
  id: string;
  investmentId: string;
  amount: number;
  reason?: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentCalculation {
  totalInterest: number;
  monthlyInterest: number;
  maturityAmount: number;
  breakdown: {
    month: number;
    interest: number;
    balance: number;
  }[];
}

export interface ForeignInvestmentRequest {
  planId: string;
  amount: number;
  name: string;
  currency: string;
  agreementAccepted: boolean;
  paymentProofId?: string;
}
