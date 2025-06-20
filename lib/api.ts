// API response types
import axios from 'axios';
import { UserData, BankAccount, Document } from '@/types/user';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  error?: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

// Backend response types (actual structure returned by backend)
export interface BackendLoginResponse {
  message: string;
  user?: UserData;
  accessToken?: string;
  refreshToken?: string;
  success?: boolean;
  error?: string;
  data?: {
    user: UserData;
    accessToken: string;
    refreshToken: string;
  };
}

export interface BackendVerificationResponse {
  message: string;
  success?: boolean;
  data?: any;
}

export interface BackendPhoneResponse {
  message: string;
  success?: boolean;
  data?: {
    isNigerianNumber: boolean;
    requiresOtp: boolean;
    verificationId?: string;
    phone: string;
    verified?: boolean;
  };
}

// Base API URL - Direct connection to backend server
// Force localhost:3000 - override any environment variables that might be set to 3001
const API_URL = 'http://localhost:3000';

// Clear any browser cache by logging the forced URL
console.warn('🔧 FORCED API URL:', API_URL, '- If you see port 3001, clear browser cache!');

console.log('API Configuration:', {
  baseURL: API_URL,
  environment: process.env.NODE_ENV
});

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased timeout for better backend communication
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data
    });

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Better error handling for connection issues
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error('Connection timeout - backend may not be running on', API_URL);
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Network error - cannot connect to backend at', API_URL);
    }
    
    return Promise.reject(error);
  }
);

// Generic API request function
async function apiRequest<T = any>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  endpoint: string,
  data?: any,
  config?: any
): Promise<T> {
  try {
    const response = await axiosInstance.request({
      method,
      url: endpoint,
      data,
      ...config,
    });

    // Return the backend response directly
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      throw {
        success: false,
        message: `Connection timeout. Please check if the backend server is running on ${API_URL}`,
        error: 'Timeout',
        statusCode: 408
      };
    } else if (!error.response) {
      throw {
        success: false,
        message: `Cannot connect to server at ${API_URL}. Please check if the backend is running.`,
        error: 'Network error',
        statusCode: 503
      };
    } else {
      throw error.response?.data || {
        success: false,
        message: error.message || 'An unexpected error occurred',
        error: 'Unknown error',
        statusCode: error.response?.status || 500
      };
    }
  }
}

// Authentication API functions
export const authApi = {
  // Register new user
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    country?: string;
    referralCode?: string;
  }) => apiRequest<BackendVerificationResponse>('post', '/auth/register', userData),

  // Verify email with OTP
  verifyEmail: (data: { email: string; code: string }) =>
    apiRequest<BackendVerificationResponse>('post', '/auth/verify-email', data),

  // Resend OTP - supports both email and phone
  resendOtp: (data: { email?: string; phone?: string; type?: string }) =>
    apiRequest<BackendVerificationResponse>('post', '/auth/resend-otp', data),

  // Send phone OTP
  sendPhoneOtp: (data: { phone: string }) =>
    apiRequest<BackendPhoneResponse>('post', '/auth/send-phone-otp', data),

  // Send phone OTP (for cleaner typing)
  resendPhoneOtp: (data: { phone: string }) =>
    apiRequest<BackendPhoneResponse>('post', '/auth/resend-otp', { phone: data.phone, type: 'phone' }),

  // Verify phone OTP
  verifyPhoneOtp: (data: { phone: string; verificationId: string; otp: string }) =>
    apiRequest<BackendVerificationResponse>('post', '/auth/verify-phone-otp', data),

  // Create password
  createPassword: (data: { email: string; password: string }) =>
    apiRequest<BackendLoginResponse>('post', '/auth/create-password', data),

  // Login - returns backend response directly
  login: (credentials: { email: string; password: string }) =>
    apiRequest<BackendLoginResponse>('post', '/auth/login', credentials),

  // Logout
  logout: () => apiRequest<BackendVerificationResponse>('post', '/auth/logout'),

  // Refresh token
  refreshToken: (data: { token: string }) =>
    apiRequest<BackendLoginResponse>('post', '/auth/refresh-token', data),

  // Request password reset
  requestPasswordReset: (data: { email: string }) =>
    apiRequest<BackendVerificationResponse>('post', '/auth/reset-password', data),

  // Verify reset password OTP
  verifyResetPasswordOtp: (data: { email: string; code: string }) =>
    apiRequest<BackendVerificationResponse>('post', '/auth/verify-reset-password', data),

  // Confirm password reset with code
  confirmPasswordReset: (data: { email: string; code: string; newPassword: string }) =>
    apiRequest<BackendVerificationResponse>('post', '/auth/confirm-reset', data),
};

// Test backend connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await apiRequest<any>('get', '/');
    console.log('Backend connection test successful:', response);
    return true;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

// User Profile Management
export const userApi = {
  // Get user profile
  getProfile: async () => {
    return await apiRequest<ApiResponse<UserData>>('get', '/users/profile');
  },

  // Update user profile
  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    bvn?: string;
    nin?: string;
  }) => {
    return await apiRequest<ApiResponse<UserData>>('patch', '/users/profile', profileData);
  },

  // Update employment information
  updateEmployment: async (employmentData: {
    employmentStatus: 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'STUDENT' | 'RETIRED';
    employerName?: string;
    jobTitle?: string;
    workAddress?: string;
    monthlyIncome?: number;
    employmentStartDate?: string;
    workEmail?: string;
    workPhone?: string;
  }) => {
    return await apiRequest<ApiResponse<UserData>>('patch', '/users/employment', employmentData);
  },

  // Update business information
  updateBusiness: async (businessData: {
    businessName: string;
    businessType: string;
    businessAddress: string;
    businessRegistrationNumber?: string;
    businessPhone?: string;
    businessEmail?: string;
    monthlyRevenue: number;
    businessStartDate: string;
  }) => {
    return await apiRequest<ApiResponse<UserData>>('patch', '/users/business', businessData);
  },

  // Update next of kin information
  updateNextOfKin: async (nextOfKinData: {
    firstName: string;
    lastName: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
  }) => {
    return await apiRequest<ApiResponse<UserData>>('patch', '/users/next-of-kin', nextOfKinData);
  },

  // Bank account management
  getBankAccounts: async () => {
    return await apiRequest<ApiResponse<BankAccount[]>>('get', '/users/bank-accounts');
  },

  addBankAccount: async (bankAccountData: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
  }) => {
    return await apiRequest<ApiResponse<BankAccount>>('post', '/users/bank-accounts', bankAccountData);
  },

  setDefaultBankAccount: async (accountId: string) => {
    return await apiRequest<ApiResponse<BankAccount>>('patch', `/users/bank-accounts/${accountId}/default`);
  },

  deleteBankAccount: async (accountId: string) => {
    return await apiRequest<ApiResponse<{success: boolean}>>('delete', `/users/bank-accounts/${accountId}`);
  },

  // Document management
  getDocuments: async () => {
    return await apiRequest<ApiResponse<Document[]>>('get', '/users/documents');
  },

  uploadDocument: async (formData: FormData) => {
    return await apiRequest<ApiResponse<Document>>(
      'post',
      '/users/documents',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  deleteDocument: async (documentId: string) => {
    return await apiRequest<ApiResponse<{success: boolean}>>('delete', `/users/documents/${documentId}`);
  },

  // Profile completion status
  getInvestmentProfileStatus: async () => {
    return await apiRequest<ApiResponse<{isComplete: boolean; missingFields?: string[]}>>('get', '/users/profile-status/investment');
  },

  getLoanProfileStatus: async () => {
    return await apiRequest<ApiResponse<{isComplete: boolean; missingFields?: string[]}>>('get', '/users/profile-status/loan');
  },

  // Security
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return await apiRequest<ApiResponse<{success: boolean}>>('post', '/users/change-password', passwordData);
  },

  setupTransactionPin: async (pinData: {
    pin: string;
  }) => {
    return await apiRequest<ApiResponse<{success: boolean}>>('post', '/users/setup-transaction-pin', pinData);
  },

  verifyTransactionPin: async (pinData: {
    pin: string;
  }) => {
    return await apiRequest<ApiResponse<{verified: boolean}>>('post', '/users/verify-transaction-pin', pinData);
  }
};

// Wallet API functions
export const walletApi = {
  // Get all wallets
  getAll: async () => {
    return await apiRequest<ApiResponse<any>>('get', '/wallet');
  },

  // Get wallet by ID
  getById: async (id: string) => {
    return await apiRequest<ApiResponse<any>>('get', `/wallet/${id}`);
  },

  // Get authenticated user wallet
  getUserWallet: async () => {
    return await apiRequest<ApiResponse<any>>('get', '/wallet/user/me');
  },

  // Create virtual account for authenticated user
  createVirtualAccount: async () => {
    return await apiRequest<ApiResponse<any>>('post', '/wallet/virtual-account/create');
  },

  // Get virtual account details for authenticated user
  getVirtualAccountDetails: async () => {
    return await apiRequest<ApiResponse<any>>('get', '/wallet/virtual-account/details');
  },

  // Create direct payment link using Mono
  createDirectPayment: async (data: {
    amount: number;
    description?: string;
    redirectUrl?: string;
    customerName?: string;
    customerEmail?: string;
  }) => {
    return await apiRequest<ApiResponse<any>>('post', '/wallet/direct-payment/create', data);
  },

  // Get Mono public key for client-side integration
  getMonoPublicKey: async () => {
    return await apiRequest<ApiResponse<string>>('get', '/wallet/mono/public-key');
  },

  // Verify Mono transaction status
  verifyTransaction: async (reference: string) => {
    return await apiRequest<ApiResponse<any>>('get', `/wallet/transaction/verify/${reference}`);
  }
};

// Investment API functions
export const investmentApi = {
  // Get all investments for authenticated user
  getAllInvestments: async () => {
    return await apiRequest<ApiResponse<any>>('get', '/investments');
  },

  // Get all available investment plans
  getInvestmentPlans: async () => {
    return await apiRequest<ApiResponse<any>>('get', '/investments/plans');
  },

  // Get investment details by ID
  getInvestmentById: async (id: string) => {
    return await apiRequest<ApiResponse<any>>('get', `/investments/${id}`);
  },

  // Calculate investment returns
  calculateReturns: async (data: {
    planId: string;
    amount: number;
    duration: number;
  }) => {
    return await apiRequest<ApiResponse<any>>('post', '/investments/calculate', data);
  },

  // Create a new investment
  createInvestment: async (data: {
    planId: string;
    amount: number;
    upfrontInterestPayment?: boolean;
  }) => {
    return await apiRequest<ApiResponse<any>>('post', '/investments', data);
  },

  // Create a foreign currency investment
  createForeignInvestment: async (formData: FormData) => {
    return await apiRequest<ApiResponse<any>>(
      'post',
      '/investments/foreign',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Request investment withdrawal
  requestWithdrawal: async (id: string, data: {
    amount?: number;
    reason?: string;
  }) => {
    return await apiRequest<ApiResponse<any>>('post', `/investments/${id}/withdraw`, data);
  }
};

// Loan API functions
export const loanApi = {
  // Get all loans for authenticated user
  getAllLoans: async () => {
    return await apiRequest<ApiResponse<any>>('get', '/loans');
  },

  // Get all available loan products
  getLoanProducts: async () => {
    return await apiRequest<ApiResponse<any>>('get', '/loans/products');
  },

  // Get loan details by ID
  getLoanById: async (id: string) => {
    return await apiRequest<ApiResponse<any>>('get', `/loans/${id}`);
  },

  // Create a salary loan application
  createSalaryLoan: async (data: {
    productId: string;
    amount: number;
    duration: number;
    purpose: string;
    documents?: string[];
  }) => {
    return await apiRequest<ApiResponse<any>>('post', '/loans/salary', data);
  },

  // Create a working capital loan application
  createWorkingCapitalLoan: async (data: {
    productId: string;
    amount: number;
    duration: number;
    purpose: string;
    documents?: string[];
  }) => {
    return await apiRequest<ApiResponse<any>>('post', '/loans/working-capital', data);
  },

  // Create an auto loan application
  createAutoLoan: async (data: {
    productId: string;
    amount: number;
    duration: number;
    purpose: string;
    documents?: string[];
  }) => {
    return await apiRequest<ApiResponse<any>>('post', '/loans/auto', data);
  },

  // Create a travel loan application
  createTravelLoan: async (data: {
    productId: string;
    amount: number;
    duration: number;
    purpose: string;
    documents?: string[];
  }) => {
    return await apiRequest<ApiResponse<any>>('post', '/loans/travel', data);
  },

  // Make a loan repayment
  makeLoanRepayment: async (id: string, data: {
    amount: number;
    reference: string;
  }) => {
    return await apiRequest<ApiResponse<any>>('post', `/loans/${id}/repayment`, data);
  }
};

export default axiosInstance;