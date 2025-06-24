export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  type: "SALARY" | "WORKING_CAPITAL" | "AUTO" | "TRAVEL";
  status: "ACTIVE" | "INACTIVE";
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
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED"
    | "DEFAULTED";
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
  status: "PENDING" | "PAID" | "OVERDUE" | "PARTIALLY_PAID";
  createdAt: string;
  updatedAt: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  reference: string;
  status: "SUCCESSFUL" | "FAILED" | "PENDING";
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

export interface VehicleDetails {
  make: string;
  model: string;
  year: string | number;
  mileage: string | number;
  color?: string;
  vin: string;
  plateNumber?: string;
}

export interface AutoLoanApplication extends LoanApplication {
  vehicleDetails: VehicleDetails;
  documentIds?: string[];
}

// Types for UI components
export interface LoanType {
  title: string;
  amount: string;
  description: string;
  route: string;
}

export interface ActiveLoan {
  type: string;
  dueDate: string;
  dueAmount: string;
  totalAmount: string;
  route: string;
}

// Types for table data
export interface UpcomingRepayment {
  applicationId: string;
  loanId: string;
  type: string;
  outstandingBalance: string;
  dueDate: string;
  amountDue: string;
}

export interface PendingApproval {
  applicationId: string;
  loanId: string;
  type: string;
  amount: string;
  submittedDate: string;
  status: string;
}

export interface CompletedLoan {
  applicationId: string;
  loanId: string;
  type: string;
  amount: string;
  closedDate: string;
  status: string;
}
