export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  type: "NAIRA" | "FOREIGN";
  currency: string;
  minimumAmount: number;
  maximumAmount: number;
  minimumTenure: number;
  maximumTenure: number;
  interestRates: {
    minTenure: number;
    maxTenure: number;
    rate: number;
  }[];
  features: string[];
  active: boolean;
}

export interface Investment {
  id: string;
  reference: string;
  name: string;
  amount: number;
  status: "PENDING" | "ACTIVE" | "MATURED" | "WITHDRAWN" | "REJECTED";
  planType: "NAIRA" | "FOREIGN";
  currency: string;
  interestRate: number;
  tenure: number;
  startDate?: string;
  maturityDate?: string;
  expectedReturns: number;
  totalInterest?: number;
  createdAt: string;
  activatedAt?: string;
  plan?: {
    id: string;
    name: string;
    description?: string;
    type: "NAIRA" | "FOREIGN";
    minimumAmount?: number;
    maximumAmount?: number;
    minimumTenure?: number;
    maximumTenure?: number;
  };
  interestPayments?: {
    id: string;
    amount: number;
    status: string;
    paymentDate: string;
  }[];
  documents?: {
    id: string;
    type: string;
    url: string;
    createdAt: string;
  }[];
}

export interface InvestmentWithdrawal {
  id: string;
  investmentId: string;
  amount: number;
  reason?: string;
  status: "PENDING" | "COMPLETED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentCalculation {
  totalInterest: number;
  monthlyInterest: number;
  maturityAmount: number;
  interestRate: number;
  startDate: string;
  maturityDate: string;
  breakdown: {
    month: number;
    interest: number;
    balance: number;
  }[];
}

export interface InvestmentRequest {
  planId?: string; // planId is now optional
  amount: number;
  name: string;
  tenure: number;
  currency: string;
  agreementAccepted: boolean;
  upfrontInterestPayment?: boolean;
}

export interface ForeignInvestmentRequest {
  planId?: string; // planId is now optional
  amount: number;
  name: string;
  tenure: number;
  currency: string;
  agreementAccepted: boolean;
  sourceOfFunds: string;
  fundingMethod: string;
}

export interface InvestmentType {
  title: string;
  description: string;
  route: string;
  icon: string;
}
