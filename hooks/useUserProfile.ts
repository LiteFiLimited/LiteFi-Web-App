import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import { UserData, BankAccount, Document } from '@/types/user';
import { useToastContext } from '@/app/components/ToastProvider';
import { getToken } from '@/lib/auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [investmentProfileComplete, setInvestmentProfileComplete] = useState(false);
  const [loanProfileComplete, setLoanProfileComplete] = useState(false);
  
  const { success, error: showError } = useToastContext();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getProfile() as ApiResponse<UserData>;
      setProfile(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      showError('Error', 'Failed to fetch profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserData>) => {
    try {
      setIsLoading(true);
      const response = await userApi.updateProfile(data) as ApiResponse<UserData>;
      setProfile(response.data);
      success('Success', 'Profile updated successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployment = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await userApi.updateEmployment(data) as ApiResponse<UserData>;
      setProfile(response.data);
      success('Success', 'Employment information updated successfully');
      return true;
    } catch (err: any) {
      // Handle array of error messages from backend
      if (Array.isArray(err.message)) {
        throw err; // Pass array of error messages to component
      }
      const errorMessage = err.message || err.error || 'Failed to update employment information';
      showError('Error', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBusiness = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await userApi.updateBusiness(data) as ApiResponse<UserData>;
      setProfile(response.data);
      success('Success', 'Business information updated successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to update business information');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNextOfKin = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await userApi.updateNextOfKin(data) as ApiResponse<UserData>;
      setProfile(response.data);
      success('Success', 'Next of kin information updated successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to update next of kin information');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGuarantor = async (data: FormData) => {
    try {
      const token = getToken();
      const response = await fetch('/api/users/guarantor', {
        method: 'PUT',
        body: data,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update guarantor information');
      }

      await fetchProfile();
    } catch (error) {
      throw error;
    }
  };

  // Bank account management
  const fetchBankAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getBankAccounts() as ApiResponse<BankAccount[]>;
      setBankAccounts(response.data);
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch bank accounts');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addBankAccount = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await userApi.addBankAccount(data) as ApiResponse<BankAccount>;
      await fetchBankAccounts(); // Refresh bank accounts after adding
      success('Success', 'Bank account added successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to add bank account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultBankAccount = async (accountId: string) => {
    try {
      setIsLoading(true);
      await userApi.setDefaultBankAccount(accountId);
      await fetchBankAccounts(); // Refresh bank accounts after updating
      success('Success', 'Default bank account updated successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to update default bank account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBankAccount = async (accountId: string) => {
    try {
      setIsLoading(true);
      await userApi.deleteBankAccount(accountId);
      await fetchBankAccounts(); // Refresh bank accounts after deletion
      success('Success', 'Bank account deleted successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete bank account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Document management
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getDocuments() as ApiResponse<Document[]>;
      setDocuments(response.data);
      return response.data;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to fetch documents');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const response = await userApi.uploadDocument(formData) as ApiResponse<Document>;
      await fetchDocuments(); // Refresh documents after upload
      success('Success', 'Document uploaded successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to upload document');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      setIsLoading(true);
      await userApi.deleteDocument(documentId);
      await fetchDocuments(); // Refresh documents after deletion
      success('Success', 'Document deleted successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to delete document');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Profile completion status
  const checkInvestmentProfileStatus = async () => {
    try {
      const response = await userApi.checkInvestmentProfileStatus();
      const isComplete = response.data?.isComplete || false;
      setInvestmentProfileComplete(isComplete);
      return { isComplete, missingFields: response.data?.missingFields || [] };
    } catch (err: any) {
      showError('Error', err.message || 'Failed to check investment profile status');
      return { isComplete: false, missingFields: [] };
    }
  };

  const checkLoanProfileStatus = async () => {
    try {
      const response = await userApi.checkLoanProfileStatus();
      const isComplete = response.data?.isComplete || false;
      setLoanProfileComplete(isComplete);
      return { isComplete, missingFields: response.data?.missingFields || [] };
    } catch (err: any) {
      showError('Error', err.message || 'Failed to check loan profile status');
      return { isComplete: false, missingFields: [] };
    }
  };

  // Security
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await userApi.changePassword({ currentPassword, newPassword });
      success('Success', 'Password changed successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to change password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setupTransactionPin = async (pin: string) => {
    try {
      setIsLoading(true);
      await userApi.setupTransactionPin({ pin });
      success('Success', 'Transaction PIN set successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to set transaction PIN');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTransactionPin = async (pin: string) => {
    try {
      setIsLoading(true);
      const response = await userApi.verifyTransactionPin({ pin });
      if (response.success) {
        success('Success', 'Transaction PIN verified successfully');
      }
      return response.success;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to verify transaction PIN');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadBankStatement = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await fetch('/api/users/bank-statement', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload bank statement');
      }

      const data = await response.json();
      success('Success', 'Bank statement uploaded successfully');
      return true;
    } catch (err: any) {
      showError('Error', err.message || 'Failed to upload bank statement');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchBankAccounts();
    fetchDocuments();
    checkInvestmentProfileStatus();
    checkLoanProfileStatus();
  }, []);

  return {
    profile,
    isLoading,
    error,
    bankAccounts,
    documents,
    investmentProfileComplete,
    loanProfileComplete,
    fetchProfile,
    updateProfile,
    updateEmployment,
    updateBusiness,
    updateNextOfKin,
    updateGuarantor,
    fetchBankAccounts,
    addBankAccount,
    setDefaultBankAccount,
    deleteBankAccount,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    checkInvestmentProfileStatus,
    checkLoanProfileStatus,
    changePassword,
    setupTransactionPin,
    verifyTransactionPin,
    uploadBankStatement
  };
}