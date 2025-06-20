import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, addMonths } from 'date-fns';
import { loanApi } from '@/lib/api';
import { useToastContext } from '@/app/components/ToastProvider';
import { 
  Loan, 
  LoanProduct, 
  LoanRepayment, 
  LoanType, 
  ActiveLoan,
  UpcomingRepayment,
  PendingApproval,
  CompletedLoan
} from '@/types/loans';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { success, error: showError } = useToastContext();

  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const response = await loanApi.getAllLoans() as ApiResponse<Loan[]>;
      setLoans(response.data);
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loans');
      showError('Error', 'Failed to fetch loan data');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLoanProducts = async () => {
    try {
      setIsLoading(true);
      const response = await loanApi.getLoanProducts() as ApiResponse<LoanProduct[]>;
      setLoanProducts(response.data);
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch loan products');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getLoanById = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await loanApi.getLoanById(id) as ApiResponse<Loan>;
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch loan details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createSalaryLoan = async (
    productId: string, 
    amount: number, 
    duration: number, 
    purpose: string, 
    documents?: string[]
  ) => {
    try {
      setIsLoading(true);
      const response = await loanApi.createSalaryLoan({
        productId,
        amount,
        duration,
        purpose,
        documents
      });
      
      success('Success', 'Loan application submitted successfully');
      fetchLoans(); // Refresh loans after creating a new one
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to submit loan application');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkingCapitalLoan = async (
    productId: string, 
    amount: number, 
    duration: number, 
    purpose: string, 
    documents?: string[]
  ) => {
    try {
      setIsLoading(true);
      const response = await loanApi.createWorkingCapitalLoan({
        productId,
        amount,
        duration,
        purpose,
        documents
      });
      
      success('Success', 'Working capital loan application submitted successfully');
      fetchLoans(); // Refresh loans after creating a new one
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to submit loan application');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createAutoLoan = async (
    productId: string, 
    amount: number, 
    duration: number, 
    purpose: string, 
    documents?: string[]
  ) => {
    try {
      setIsLoading(true);
      const response = await loanApi.createAutoLoan({
        productId,
        amount,
        duration,
        purpose,
        documents
      });
      
      success('Success', 'Auto loan application submitted successfully');
      fetchLoans(); // Refresh loans after creating a new one
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to submit loan application');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createTravelLoan = async (
    productId: string, 
    amount: number, 
    duration: number, 
    purpose: string, 
    documents?: string[]
  ) => {
    try {
      setIsLoading(true);
      const response = await loanApi.createTravelLoan({
        productId,
        amount,
        duration,
        purpose,
        documents
      });
      
      success('Success', 'Travel loan application submitted successfully');
      fetchLoans(); // Refresh loans after creating a new one
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to submit loan application');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const makeLoanRepayment = async (id: string, amount: number, reference: string) => {
    try {
      setIsLoading(true);
      const response = await loanApi.makeLoanRepayment(id, {
        amount,
        reference
      });
      
      success('Success', 'Loan repayment successful');
      fetchLoans(); // Refresh loans after repayment
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to process loan repayment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date to human-readable format
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'dd-MM-yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Format date to more user-friendly format (e.g., "May 24, 2025")
  const formatDateFriendly = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Convert loan products to LoanType for UI display
  const loanTypesForUI = useMemo(() => {
    if (!loanProducts.length) return [];
    
    return loanProducts.map(product => ({
      title: product.name,
      amount: formatCurrency(product.maxAmount).replace('NGN', ''),
      description: product.description,
      route: product.type.toLowerCase().replace('_', '-') + '-loan'
    })) as LoanType[];
  }, [loanProducts]);

  // Convert active loans to ActiveLoan for UI display
  const activeLoansForUI = useMemo(() => {
    if (!loans.length) return [];

    return loans
      .filter(loan => loan.status === 'ACTIVE')
      .map(loan => {
        const nextRepayment = loan.repayments?.find(rep => rep.status === 'PENDING');
        return {
          type: loan.product?.name || 'Loan',
          dueDate: formatDateFriendly(nextRepayment?.dueDate || loan.dueDate),
          dueAmount: formatCurrency(nextRepayment?.amount || 0),
          totalAmount: formatCurrency(loan.amount),
          route: loan.product?.type.toLowerCase().replace('_', '-') + '-loan' || 'loan-details'
        };
      }) as ActiveLoan[];
  }, [loans]);

  // Get upcoming repayments for table display
  const upcomingRepayments = useMemo(() => {
    if (!loans.length) return [];

    const result: UpcomingRepayment[] = [];

    loans.forEach(loan => {
      if (loan.status === 'ACTIVE' && loan.repayments) {
        const pendingRepayments = loan.repayments.filter(rep => rep.status === 'PENDING');
        
        pendingRepayments.forEach(repayment => {
          result.push({
            applicationId: loan.id.slice(0, 7).toUpperCase(),
            loanId: loan.id.slice(-5).toUpperCase(),
            type: loan.product?.name || 'Loan',
            outstandingBalance: formatCurrency(loan.amount),
            dueDate: formatDate(repayment.dueDate),
            amountDue: formatCurrency(repayment.amount),
          });
        });
      }
    });

    return result;
  }, [loans]);

  // Get pending approval loans for table display
  const pendingApprovals = useMemo(() => {
    if (!loans.length) return [];

    return loans
      .filter(loan => ['PENDING', 'APPROVED'].includes(loan.status))
      .map(loan => ({
        applicationId: loan.id.slice(0, 7).toUpperCase(),
        loanId: loan.id.slice(-5).toUpperCase(),
        type: loan.product?.name || 'Loan',
        amount: formatCurrency(loan.amount),
        submittedDate: formatDate(loan.createdAt),
        status: loan.status === 'PENDING' ? 'Application in review' : 'Pending Disbursement'
      })) as PendingApproval[];
  }, [loans]);

  // Get completed loans for table display
  const completedLoans = useMemo(() => {
    if (!loans.length) return [];

    return loans
      .filter(loan => ['COMPLETED', 'REJECTED'].includes(loan.status))
      .map(loan => ({
        applicationId: loan.id.slice(0, 7).toUpperCase(),
        loanId: loan.id.slice(-5).toUpperCase(),
        type: loan.product?.name || 'Loan',
        amount: formatCurrency(loan.amount),
        closedDate: formatDate(loan.updatedAt),
        status: loan.status === 'COMPLETED' ? 'Fully Paid' : 'Rejected'
      })) as CompletedLoan[];
  }, [loans]);

  // Check if user has any active loans
  const hasActiveLoans = useMemo(() => {
    return loans.some(loan => loan.status === 'ACTIVE');
  }, [loans]);

  useEffect(() => {
    fetchLoans();
    fetchLoanProducts();
  }, []);

  return {
    loans,
    loanProducts,
    loanTypesForUI,
    activeLoansForUI,
    upcomingRepayments,
    pendingApprovals,
    completedLoans,
    hasActiveLoans,
    isLoading,
    error,
    fetchLoans,
    fetchLoanProducts,
    getLoanById,
    createSalaryLoan,
    createWorkingCapitalLoan,
    createAutoLoan,
    createTravelLoan,
    makeLoanRepayment
  };
}
