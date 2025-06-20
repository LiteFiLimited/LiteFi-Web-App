import { useState, useEffect } from 'react';
import { investmentApi } from '@/lib/api';
import { useToastContext } from '@/app/components/ToastProvider';

interface InvestmentPlan {
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

interface Investment {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  duration: number;
  startDate: string;
  maturityDate: string;
  status: string;
  currency: string;
  plan: InvestmentPlan;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { success, error: showError } = useToastContext();

  const fetchInvestments = async () => {
    try {
      setIsLoading(true);
      const response = await investmentApi.getAllInvestments() as ApiResponse<Investment[]>;
      setInvestments(response.data);
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch investments');
      showError('Error', 'Failed to fetch investment data');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvestmentPlans = async () => {
    try {
      setIsLoading(true);
      const response = await investmentApi.getInvestmentPlans() as ApiResponse<InvestmentPlan[]>;
      setInvestmentPlans(response.data);
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch investment plans');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getInvestmentById = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await investmentApi.getInvestmentById(id) as ApiResponse<Investment>;
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch investment details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateReturns = async (planId: string, amount: number, duration: number) => {
    try {
      const response = await investmentApi.calculateReturns({
        planId,
        amount,
        duration
      });
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to calculate returns');
      return null;
    }
  };

  const createInvestment = async (planId: string, amount: number, upfrontInterestPayment = false) => {
    try {
      setIsLoading(true);
      const response = await investmentApi.createInvestment({
        planId,
        amount,
        upfrontInterestPayment
      });
      
      success('Success', 'Investment created successfully');
      fetchInvestments(); // Refresh investments after creating a new one
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to create investment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createForeignInvestment = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const response = await investmentApi.createForeignInvestment(formData);
      
      success('Success', 'Foreign investment submitted successfully');
      fetchInvestments(); // Refresh investments after creating a new one
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to create foreign investment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const requestWithdrawal = async (id: string, amount?: number, reason?: string) => {
    try {
      setIsLoading(true);
      const response = await investmentApi.requestWithdrawal(id, {
        amount,
        reason
      });
      
      success('Success', 'Withdrawal request submitted successfully');
      fetchInvestments(); // Refresh investments after withdrawal
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to request withdrawal');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
    fetchInvestmentPlans();
  }, []);

  return {
    investments,
    investmentPlans,
    isLoading,
    error,
    fetchInvestments,
    fetchInvestmentPlans,
    getInvestmentById,
    calculateReturns,
    createInvestment,
    createForeignInvestment,
    requestWithdrawal
  };
}
