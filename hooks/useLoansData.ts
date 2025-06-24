import { useState, useEffect, useCallback } from "react";
import {
  Loan,
  LoanProduct,
  LoanRepayment,
  UpcomingRepayment,
  PendingApproval,
  CompletedLoan,
} from "@/types/loans";
import axiosInstance from "@/lib/api";

interface UseLoansDataReturn {
  isLoading: boolean;
  error: Error | null;
  loans: Loan[];
  loanProducts: LoanProduct[];
  activeLoans: Loan[];
  pendingLoans: Loan[];
  completedLoans: Loan[];
  upcomingRepayments: UpcomingRepayment[];
  pendingApprovals: PendingApproval[];
  completedLoanData: CompletedLoan[];
  refetchLoans: () => Promise<void>;
}

export function useLoansData(): UseLoansDataReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);

  // Derived states
  const activeLoans = loans.filter((loan) => loan.status === "ACTIVE");
  const pendingLoans = loans.filter((loan) => loan.status === "PENDING");
  const completedLoans = loans.filter((loan) => loan.status === "COMPLETED");

  // Formatted data for tables
  const upcomingRepayments: UpcomingRepayment[] = activeLoans.flatMap(
    (loan) => {
      if (!loan.repayments) return [];

      const pendingRepayments = loan.repayments
        .filter((repayment) => repayment.status === "PENDING")
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );

      if (pendingRepayments.length === 0) return [];

      const nextRepayment = pendingRepayments[0];
      const loanType = loan.product?.name || "Unknown";

      return [
        {
          applicationId: loan.id,
          loanId: loan.id,
          type: loanType,
          outstandingBalance: `₦${loan.amount.toLocaleString()}`,
          dueDate: new Date(nextRepayment.dueDate).toLocaleDateString(),
          amountDue: `₦${nextRepayment.amount.toLocaleString()}`,
        },
      ];
    }
  );

  const pendingApprovals: PendingApproval[] = pendingLoans.map((loan) => ({
    applicationId: loan.id,
    loanId: loan.id,
    type: loan.product?.name || "Unknown",
    amount: `₦${loan.amount.toLocaleString()}`,
    submittedDate: new Date(loan.createdAt).toLocaleDateString(),
    status: "Pending",
  }));

  const completedLoanData: CompletedLoan[] = completedLoans.map((loan) => ({
    applicationId: loan.id,
    loanId: loan.id,
    type: loan.product?.name || "Unknown",
    amount: `₦${loan.amount.toLocaleString()}`,
    closedDate: loan.dueDate
      ? new Date(loan.dueDate).toLocaleDateString()
      : "N/A",
    status: "Fully Paid",
  }));

  // Fetch loans and loan products
  const fetchLoans = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all loans
      const loansResponse = await axiosInstance.get("/loans");
      if (loansResponse.data.success) {
        setLoans(loansResponse.data.data.loans);
      } else {
        throw new Error(
          loansResponse.data.error?.message || "Failed to fetch loans"
        );
      }

      // Fetch loan products
      const productsResponse = await axiosInstance.get("/loans/products");
      if (productsResponse.data.success) {
        setLoanProducts(productsResponse.data.data.products);
      } else {
        throw new Error(
          productsResponse.data.error?.message ||
            "Failed to fetch loan products"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      console.error("Error fetching loan data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    isLoading,
    error,
    loans,
    loanProducts,
    activeLoans,
    pendingLoans,
    completedLoans,
    upcomingRepayments,
    pendingApprovals,
    completedLoanData,
    refetchLoans: fetchLoans,
  };
}
