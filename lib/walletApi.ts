import axios from "axios";
import { getToken } from "./auth";

// Use the same axios instance as in api.ts
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add authorization token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface WalletData {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  isActive: boolean;
}

interface WalletResponse {
  success: boolean;
  data: WalletData;
  message: string;
}

interface Transaction {
  id: string;
  reference: string;
  type: string;
  amount: number;
  fee: number;
  status: string;
  description: string;
  createdAt: string;
  completedAt?: string;
}

interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
  message: string;
}

export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "LOAN_DISBURSEMENT"
  | "LOAN_REPAYMENT"
  | "INVESTMENT"
  | "INVESTMENT_RETURN"
  | "SYSTEM_CREDIT"
  | "SYSTEM_DEBIT";

export type TimePeriod = "week" | "month" | "year";

interface WalletActivity {
  totalInflow: number;
  totalOutflow: number;
  weeklyActivity: {
    week: string;
    inflow: number;
    outflow: number;
  }[];
}

interface WalletActivityResponse {
  status: string;
  data: WalletActivity;
  message: string;
}

export const walletApi = {
  /**
   * Get wallet balance for the authenticated user
   * @returns Promise with wallet data
   */
  getWalletBalance: async (): Promise<WalletResponse> => {
    try {
      const response = await axiosInstance.get("/wallet/user/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get wallet transactions for the authenticated user
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @param type - Filter by transaction type
   * @returns Promise with transactions data
   */
  getTransactions: async (
    page: number = 1,
    limit: number = 10,
    type?: TransactionType
  ): Promise<TransactionsResponse> => {
    try {
      let url = `/wallet/transactions?page=${page}&limit=${limit}`;
      if (type) {
        url += `&type=${type}`;
      }
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get wallet activity data for charts
   * @param period - Time period for activity data (week/month/year)
   * @returns Promise with wallet activity data
   */
  getWalletActivity: async (
    period: TimePeriod = "week"
  ): Promise<WalletActivityResponse> => {
    try {
      const response = await axiosInstance.get(
        `/wallet/activity?period=${period}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Initiate a wallet funding using Mono DirectPay
   * @param amount - Amount to fund in the smallest currency unit (kobo)
   * @returns Promise with payment link and reference
   */
  initiateMonoPayment: async (
    amount: number
  ): Promise<{
    success: boolean;
    data: {
      paymentLink: string;
      reference: string;
    };
    message: string;
  }> => {
    try {
      console.log("Making API call to initiate Mono payment:", amount, "kobo");

      // For testing/development, we can mock the response if the API isn't ready
      // Comment this out when the real API is available
      if (process.env.NODE_ENV === "development") {
        console.log("Using mock response in development");
        // Mock successful response for testing
        return {
          success: true,
          data: {
            paymentLink: "https://pay.mono.co/test-payment-link",
            reference: `mono-${Date.now()}`,
          },
          message: "Payment initiated successfully",
        };
      }

      // Actual API call
      const response = await axiosInstance.post("/wallet/fund/mono", {
        amount,
      });
      console.log("API response received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error in initiateMonoPayment:", error);
      if (error.response) {
        console.error("Response error data:", error.response.data);
      }
      throw error;
    }
  },
};
