import axiosInstance from "./api";
import {
  Loan,
  LoanProduct,
  LoanApplication,
  LoanRepayment,
  AutoLoanApplication,
} from "@/types/loans";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export const loanApi = {
  // Fetch all loans for the authenticated user
  getAllLoans: async (): Promise<ApiResponse<Loan[]>> => {
    try {
      const response = await axiosInstance.get("/loans");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching loans:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch loans",
        error: error.response?.data?.error || error.message,
      };
    }
  },

  // Fetch a specific loan by ID
  getLoanById: async (id: string): Promise<ApiResponse<Loan>> => {
    try {
      const response = await axiosInstance.get(`/loans/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching loan ${id}:`, error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          `Failed to fetch loan details for ${id}`,
        error: error.response?.data?.error || error.message,
      };
    }
  },

  // Fetch all available loan products
  getLoanProducts: async (): Promise<ApiResponse<LoanProduct[]>> => {
    try {
      const response = await axiosInstance.get("/loans/products");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching loan products:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch loan products",
        error: error.response?.data?.error || error.message,
      };
    }
  },

  // Create a new salary loan application
  createSalaryLoan: async (
    loanData: LoanApplication
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post("/loans/salary", loanData);
      return response.data;
    } catch (error: any) {
      console.error("Error creating salary loan:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to submit salary loan application",
        error: error.response?.data?.error || error.message,
      };
    }
  },

  // Create a new working capital loan application
  createWorkingCapitalLoan: async (
    loanData: LoanApplication
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(
        "/loans/working-capital",
        loanData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating working capital loan:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to submit working capital loan application",
        error: error.response?.data?.error || error.message,
      };
    }
  },

  // Create a new auto loan application
  createAutoLoan: async (
    loanData: AutoLoanApplication
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post("/loans/auto", loanData);
      return response.data;
    } catch (error: any) {
      console.error("Error creating auto loan:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to submit auto loan application",
        error: error.response?.data?.error || error.message,
      };
    }
  },

  // Create a new travel loan application
  createTravelLoan: async (
    loanData: LoanApplication
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post("/loans/travel", loanData);
      return response.data;
    } catch (error: any) {
      console.error("Error creating travel loan:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to submit travel loan application",
        error: error.response?.data?.error || error.message,
      };
    }
  },

  // Make a loan repayment
  makeLoanRepayment: async (
    loanId: string,
    paymentData: { amount: number; reference: string }
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosInstance.post(
        `/loans/${loanId}/repayment`,
        paymentData
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error making loan repayment for loan ${loanId}:`, error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to process loan repayment",
        error: error.response?.data?.error || error.message,
      };
    }
  },
};
