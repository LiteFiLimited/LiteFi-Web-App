import { useState, useEffect } from 'react';
import { walletApi } from '@/lib/api';
import { useToastContext } from '@/app/components/ToastProvider';

interface WalletData {
  id: string;
  balance: number;
  currency: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  virtualAccount?: {
    id: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    createdAt: string;
  }
}

interface WalletTransaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  reference: string;
  date: string;
  balance: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [virtualAccount, setVirtualAccount] = useState<WalletData['virtualAccount'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { success, error: showError } = useToastContext();

  const fetchWallet = async () => {
    try {
      setIsLoading(true);
      const response = await walletApi.getUserWallet() as ApiResponse<WalletData>;
      setWallet(response.data);
      
      // If wallet has virtual account details, store them
      if (response.data.virtualAccount) {
        setVirtualAccount(response.data.virtualAccount);
      }
      
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wallet data');
      showError('Error', 'Failed to fetch wallet data');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createVirtualAccount = async () => {
    try {
      setIsLoading(true);
      const response = await walletApi.createVirtualAccount() as ApiResponse<WalletData>;
      
      // Update wallet data with new virtual account
      if (response.data.virtualAccount) {
        setVirtualAccount(response.data.virtualAccount);
        setWallet(response.data);
      }
      
      success('Success', 'Virtual account created successfully');
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to create virtual account');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getVirtualAccountDetails = async () => {
    try {
      setIsLoading(true);
      const response = await walletApi.getVirtualAccountDetails() as ApiResponse<WalletData['virtualAccount']>;
      setVirtualAccount(response.data);
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch virtual account details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createDirectPayment = async (amount: number, description?: string) => {
    try {
      setIsLoading(true);
      const response = await walletApi.createDirectPayment({
        amount,
        description: description || 'Wallet funding'
      });
      success('Success', 'Payment link created successfully');
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to create payment link');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getMonoPublicKey = async () => {
    try {
      const response = await walletApi.getMonoPublicKey();
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to get Mono public key');
      return null;
    }
  };

  const verifyTransaction = async (reference: string) => {
    try {
      setIsLoading(true);
      const response = await walletApi.verifyTransaction(reference);
      
      if (response.success) {
        success('Success', 'Transaction verified successfully');
        // Refresh wallet data after successful transaction
        fetchWallet();
      } else {
        showError('Error', 'Transaction verification failed');
      }
      
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to verify transaction');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return {
    wallet,
    virtualAccount,
    transactions,
    isLoading,
    error,
    fetchWallet,
    createVirtualAccount,
    getVirtualAccountDetails,
    createDirectPayment,
    getMonoPublicKey,
    verifyTransaction
  };
}
