import { useState, useEffect } from 'react';
import { loanApi } from '@/lib/api';
import { useToastContext } from '@/app/components/ToastProvider';

interface LoanProduct {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  type: 'SALARY' | 'WORKING_CAPITAL' | 'AUTO' | 'TRAVEL';
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  duration: number; // in months
  startDate?: string;
  dueDate?: string;
  purpose: string;
  status: string;
  product: LoanProduct;
  repayments?: LoanRepayment[];
  createdAt: string;
  updatedAt: string;
}

interface LoanRepayment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID';
  createdAt: string;
  updatedAt: string;
}

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

  useEffect(() => {
    fetchLoans();
    fetchLoanProducts();
  }, []);

  return {
    loans,
    loanProducts,
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
