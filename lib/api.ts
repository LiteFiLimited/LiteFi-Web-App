// API response types
import axios from "axios";
import {
  UserData,
  BankAccount,
  Document,
  EmploymentInfo,
  BusinessInfo,
  NextOfKinInfo,
} from "@/types/user";
import { getToken } from "./auth";
import { getApiUrl } from "./env-config";

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

// Base API URL - Use secure environment configuration
const API_URL = getApiUrl();

// Log the API URL configuration
console.log("API Configuration:", {
  baseURL: API_URL,
  environment: process.env.NODE_ENV,
});

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased timeout for better backend communication
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    console.log("Request:", {
      method: config.method,
      url: config.url,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      headers: {
        ...config.headers,
        Authorization: token
          ? `Bearer ${token.substring(0, 20)}...`
          : "Not set",
      },
      data: config.data,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No authentication token found in localStorage!");
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Response error:", error);

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error(
        "Authentication failed - clearing tokens and redirecting to login"
      );

      // Clear all authentication data
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");

        // Clear auth cookies
        document.cookie =
          "auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";
        document.cookie =
          "refresh-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";

        // Redirect to login after a short delay to allow cleanup
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      }
    }

    // Better error handling for connection issues
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      console.error(
        "Connection timeout - backend may not be running on",
        API_URL
      );
    } else if (error.code === "ERR_NETWORK" || !error.response) {
      console.error("Network error - cannot connect to backend at", API_URL);
    }

    return Promise.reject(error);
  }
);

// Generic API request function
async function apiRequest<T = any>(
  method: "get" | "post" | "put" | "patch" | "delete",
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
    console.error("API Error:", error);

    // Handle different types of errors
    if (error.code === "ECONNABORTED") {
      throw {
        success: false,
        message: `Connection timeout. Please check if the backend server is running on ${API_URL}`,
        error: "Timeout",
        statusCode: 408,
      };
    } else if (!error.response) {
      throw {
        success: false,
        message: `Cannot connect to server at ${API_URL}. Please check if the backend is running.`,
        error: "Network error",
        statusCode: 503,
      };
    } else {
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "An unexpected error occurred",
          error: "Unknown error",
          statusCode: error.response?.status || 500,
        }
      );
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
  }) =>
    apiRequest<BackendVerificationResponse>("post", "/auth/register", userData),

  // Verify email with OTP
  verifyEmail: (data: { email: string; code: string }) =>
    apiRequest<BackendVerificationResponse>("post", "/auth/verify-email", data),

  // Resend OTP - supports both email and phone
  resendOtp: (data: { email?: string; phone?: string; type?: string }) =>
    apiRequest<BackendVerificationResponse>("post", "/auth/resend-otp", data),

  // Send phone OTP
  sendPhoneOtp: (data: { phone: string }) =>
    apiRequest<BackendPhoneResponse>("post", "/auth/send-phone-otp", data),

  // Send phone OTP (for cleaner typing)
  resendPhoneOtp: (data: { phone: string }) =>
    apiRequest<BackendPhoneResponse>("post", "/auth/resend-otp", {
      phone: data.phone,
      type: "phone",
    }),

  // Verify phone OTP
  verifyPhoneOtp: (data: {
    phone: string;
    verificationId: string;
    otp: string;
  }) =>
    apiRequest<BackendVerificationResponse>(
      "post",
      "/auth/verify-phone-otp",
      data
    ),

  // Create password
  createPassword: (data: { email: string; password: string }) =>
    apiRequest<BackendLoginResponse>("post", "/auth/create-password", data),

  // Login - returns backend response directly
  login: (credentials: { email: string; password: string }) =>
    apiRequest<BackendLoginResponse>("post", "/auth/login", credentials),

  // Logout
  logout: () => apiRequest<BackendVerificationResponse>("post", "/auth/logout"),

  // Refresh token
  refreshToken: (data: { token: string }) =>
    apiRequest<BackendLoginResponse>("post", "/auth/refresh-token", data),

  // Request password reset
  requestPasswordReset: (data: { email: string }) =>
    apiRequest<BackendVerificationResponse>(
      "post",
      "/auth/reset-password",
      data
    ),

  // Verify reset password OTP
  verifyResetPasswordOtp: (data: { email: string; code: string }) =>
    apiRequest<BackendVerificationResponse>(
      "post",
      "/auth/verify-reset-password",
      data
    ),

  // Confirm password reset with code
  confirmPasswordReset: (data: {
    email: string;
    code: string;
    newPassword: string;
  }) =>
    apiRequest<BackendVerificationResponse>(
      "post",
      "/auth/confirm-reset",
      data
    ),
};

// Test backend connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await apiRequest<any>("get", "/");
    console.log("Backend connection test successful:", response);
    return true;
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return false;
  }
};

// User Profile Management
export const userApi = {
  // Get user profile
  getProfile: () => apiRequest<ApiResponse<UserData>>("get", "/users/profile"),

  // Update user profile
  updateProfile: (data: Partial<UserData>) =>
    apiRequest<ApiResponse<UserData>>("patch", "/users/profile", data),

  // Update employment information
  updateEmployment: (data: EmploymentInfo) =>
    apiRequest<ApiResponse<UserData>>("patch", "/users/employment", data),

  // Update business information
  updateBusiness: (data: BusinessInfo) =>
    apiRequest<ApiResponse<UserData>>("patch", "/users/business", data),

  // Next of Kin
  getNextOfKin: () =>
    apiRequest<ApiResponse<NextOfKinInfo>>("get", "/users/next-of-kin"),

  updateNextOfKin: (data: NextOfKinInfo) =>
    apiRequest<ApiResponse<UserData>>("patch", "/users/next-of-kin", data),

  // Bank account management
  getBankAccounts: () =>
    apiRequest<ApiResponse<BankAccount[]>>("get", "/users/bank-accounts"),

  addBankAccount: (data: Partial<BankAccount>) =>
    apiRequest<ApiResponse<BankAccount>>("post", "/users/bank-accounts", data),

  setDefaultBankAccount: (accountId: string) =>
    apiRequest<ApiResponse<void>>(
      "patch",
      `/users/bank-accounts/${accountId}/default`
    ),

  deleteBankAccount: (accountId: string) =>
    apiRequest<ApiResponse<void>>(
      "delete",
      `/users/bank-accounts/${accountId}`
    ),

  // Document management
  getDocuments: () =>
    apiRequest<ApiResponse<Document[]>>("get", "/users/documents"),

  uploadDocument: (formData: FormData) =>
    apiRequest<ApiResponse<Document>>("post", "/users/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteDocument: (documentId: string) =>
    apiRequest<ApiResponse<void>>("delete", `/users/documents/${documentId}`),

  // Profile status
  checkInvestmentProfileStatus: () =>
    apiRequest<ApiResponse<{ isComplete: boolean; missingFields: string[] }>>(
      "get",
      "/users/profile-status/investment"
    ),

  checkLoanProfileStatus: () =>
    apiRequest<ApiResponse<{ isComplete: boolean; missingFields: string[] }>>(
      "get",
      "/users/profile-status/loan"
    ),

  // Eligibility Status
  getEligibilityStatus: () =>
    apiRequest<
      ApiResponse<{
        loan: {
          complete: boolean;
          missingFields: string[];
        };
        investment: {
          complete: boolean;
          missingFields: string[];
        };
      }>
    >("get", "/users/eligibility"),

  // Get wallet balance
  getWalletBalance: () =>
    apiRequest<
      ApiResponse<{
        id: string;
        balance: number;
        currency: string;
      }>
    >("get", "/wallet/balance"),
  // Security
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<ApiResponse<void>>("post", "/users/change-password", data),

  setupTransactionPin: (data: { pin: string }) =>
    apiRequest<ApiResponse<void>>("post", "/users/setup-pin", data),

  verifyTransactionPin: (data: { pin: string }) =>
    apiRequest<ApiResponse<void>>("post", "/users/verify-pin", data),

  // File uploads
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await apiRequest<ApiResponse<{ avatarUrl: string }>>(
      "post",
      "/users/profile-picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  uploadGuarantorIdCard: async (
    file: File,
    guarantorData: {
      firstName: string;
      lastName: string;
      middleName?: string;
      relationship: string;
      email: string;
      phone: string;
      address: string;
      occupation: string;
      bvn: string;
    }
  ) => {
    const formData = new FormData();
    formData.append("idCard", file);

    // Append guarantor data
    Object.entries(guarantorData).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value.toString());
      }
    });

    return await apiRequest<ApiResponse<any>>(
      "put",
      "/users/guarantor",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

// Wallet API functions
export const walletApi = {
  // Get all wallets
  getAll: async () => {
    return await apiRequest<ApiResponse<any>>("get", "/wallet");
  },

  // Get wallet by ID
  getById: async (id: string) => {
    return await apiRequest<ApiResponse<any>>("get", `/wallet/${id}`);
  },

  // Get authenticated user wallet
  getUserWallet: async () => {
    return await apiRequest<ApiResponse<any>>("get", "/wallet/user/me");
  },

  // Create virtual account for authenticated user
  createVirtualAccount: async () => {
    return await apiRequest<ApiResponse<any>>(
      "post",
      "/wallet/virtual-account/create"
    );
  },

  // Get virtual account details for authenticated user
  getVirtualAccountDetails: async () => {
    return await apiRequest<ApiResponse<any>>(
      "get",
      "/wallet/virtual-account/details"
    );
  },

  // Create direct payment link using Mono
  createDirectPayment: async (data: {
    amount: number;
    description?: string;
    redirectUrl?: string;
    customerName?: string;
    customerEmail?: string;
  }) => {
    return await apiRequest<ApiResponse<any>>(
      "post",
      "/wallet/direct-payment/create",
      data
    );
  },

  // Get Mono public key for client-side integration
  getMonoPublicKey: async () => {
    return await apiRequest<ApiResponse<string>>(
      "get",
      "/wallet/mono/public-key"
    );
  },

  // Verify Mono transaction status
  verifyTransaction: async (reference: string) => {
    return await apiRequest<ApiResponse<any>>(
      "get",
      `/wallet/transaction/verify/${reference}`
    );
  },
};

// Investment API functions
export const investmentApi = {
  // Get all investments for authenticated user
  getAllInvestments: async () => {
    return await apiRequest<ApiResponse<any>>("get", "/investments");
  },

  // Get all available investment plans
  getInvestmentPlans: async () => {
    return await apiRequest<ApiResponse<any>>("get", "/investments/plans");
  },

  // Get investment details by ID
  getInvestmentById: async (id: string) => {
    return await apiRequest<ApiResponse<any>>("get", `/investments/${id}`);
  },

  // Calculate investment returns
  calculateReturns: async (data: {
    planId: string;
    amount: number;
    duration: number;
  }) => {
    return await apiRequest<ApiResponse<any>>(
      "post",
      "/investments/calculate",
      data
    );
  },

  // Create a new investment
  createInvestment: async (data: {
    planId: string;
    amount: number;
    upfrontInterestPayment?: boolean;
  }) => {
    return await apiRequest<ApiResponse<any>>("post", "/investments", data);
  },

  // Create a foreign currency investment
  createForeignInvestment: async (formData: FormData) => {
    return await apiRequest<ApiResponse<any>>(
      "post",
      "/investments/foreign",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // Request investment withdrawal
  requestWithdrawal: async (
    id: string,
    data: {
      amount?: number;
      reason?: string;
    }
  ) => {
    return await apiRequest<ApiResponse<any>>(
      "post",
      `/investments/${id}/withdraw`,
      data
    );
  },
};

// Loan API functions
export const loanApi = {
  // Get all loans for authenticated user
  getAllLoans: async () => {
    return await apiRequest<ApiResponse<any>>("get", "/loans");
  },

  // Get all available loan products
  getLoanProducts: async () => {
    return await apiRequest<ApiResponse<any>>("get", "/loans/products");
  },

  // Get loan details by ID
  getLoanById: async (id: string) => {
    return await apiRequest<ApiResponse<any>>("get", `/loans/${id}`);
  },

  // Create a salary loan application
  createSalaryLoan: async (data: {
    productId: string;
    amount: number;
    duration: number;
    purpose: string;
    documents?: string[];
  }) => {
    return await apiRequest<ApiResponse<any>>("post", "/loans/salary", data);
  },

  // Create a working capital loan application
  createWorkingCapitalLoan: async (data: {
    productId: string;
    amount: number;
    duration: number;
    purpose: string;
    documents?: string[];
  }) => {
    return await apiRequest<ApiResponse<any>>(
      "post",
      "/loans/working-capital",
      data
    );
  },

  // Create an auto loan application
  createAutoLoan: async (data: {
    productId: string;
    amount: number;
    duration: number;
    purpose: string;
    documents?: string[];
  }) => {
    return await apiRequest<ApiResponse<any>>("post", "/loans/auto", data);
  },

  // Create a travel loan application
  createTravelLoan: async (data: {
    productId: string;
    amount: number;
    duration: number;
    purpose: string;
    documents?: string[];
  }) => {
    return await apiRequest<ApiResponse<any>>("post", "/loans/travel", data);
  },

  // Make a loan repayment
  makeLoanRepayment: async (
    id: string,
    data: {
      amount: number;
      reference: string;
    }
  ) => {
    return await apiRequest<ApiResponse<any>>(
      "post",
      `/loans/${id}/repayment`,
      data
    );
  },
};

// Dashboard API functions
export interface DashboardSummary {
  wallet: {
    balance: number;
    currency: string;
    lastTransaction?: {
      id: string;
      type: string;
      amount: number;
      status: string;
      createdAt: string;
    };
  };
  investments: {
    totalInvested: number;
    activeInvestments: number;
    totalReturns: number;
    latestInvestment?: {
      id: string;
      name: string;
      amount: number;
      status: string;
      maturityDate: string;
    };
  };
  loans: {
    totalBorrowed: number;
    activeLoans: number;
    outstandingAmount: number;
    latestLoan?: {
      id: string;
      type: string;
      amount: number;
      status: string;
      nextPaymentDate: string;
      nextPaymentAmount: number;
    };
  };
  upcomingPayments: Array<{
    id: string;
    type: string;
    loanId?: string;
    amount: number;
    dueDate: string;
    status: string;
  }>;
}

export interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface InvestmentPortfolio {
  totalInvested: number;
  activeInvestments: number;
  totalReturns: number;
  portfolioBreakdown: Array<{
    type: string;
    amount: number;
    percentage: number;
  }>;
  recentInvestments: Array<{
    id: string;
    name: string;
    amount: number;
    status: string;
    maturityDate: string;
    expectedReturns: number;
  }>;
}

export interface LoanSummary {
  totalBorrowed: number;
  activeLoans: number;
  outstandingAmount: number;
  loanBreakdown: Array<{
    type: string;
    amount: number;
    percentage: number;
  }>;
  loans: Array<{
    id: string;
    reference: string;
    type: string;
    amount: number;
    status: string;
    outstandingAmount: number;
    nextPaymentDate: string;
    nextPaymentAmount: number;
  }>;
}

export interface UpcomingPayment {
  id: string;
  type: string;
  loanId?: string;
  investmentId?: string;
  reference: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export const dashboardApi = {
  // Get comprehensive dashboard summary
  getDashboardSummary: async () => {
    return await apiRequest<ApiResponse<DashboardSummary>>(
      "get",
      "/dashboard/summary"
    );
  },

  // Get wallet balance
  getWalletBalance: async () => {
    return await apiRequest<ApiResponse<WalletBalance>>(
      "get",
      "/dashboard/wallet-balance"
    );
  },

  // Get investment portfolio summary
  getInvestmentPortfolio: async () => {
    return await apiRequest<ApiResponse<InvestmentPortfolio>>(
      "get",
      "/dashboard/investment-portfolio"
    );
  },

  // Get loan and repayments summary
  getLoanSummary: async () => {
    return await apiRequest<ApiResponse<LoanSummary>>(
      "get",
      "/dashboard/loan-summary"
    );
  },

  // Get upcoming payments
  getUpcomingPayments: async () => {
    return await apiRequest<
      ApiResponse<{ upcomingPayments: UpcomingPayment[] }>
    >("get", "/dashboard/upcoming-payments");
  },

  // Get recent transactions
  getRecentTransactions: async (limit?: number) => {
    const queryParams = limit ? `?limit=${limit}` : "";
    return await apiRequest<ApiResponse<{ recentTransactions: Transaction[] }>>(
      "get",
      `/dashboard/recent-transactions${queryParams}`
    );
  },
};

// Utility function to validate file size and type
export function validateFileUpload(
  file: File,
  options: {
    maxSizeInMB?: number;
    allowedTypes?: string[];
  }
): { valid: boolean; error?: string } {
  const {
    maxSizeInMB = 5,
    allowedTypes = ["image/jpeg", "image/jpg", "image/png"],
  } = options;

  // Check file size
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > maxSizeInMB) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeInMB}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes
        .map((type) => type.split("/")[1])
        .join(", ")}`,
    };
  }

  return { valid: true };
}

export default axiosInstance;
