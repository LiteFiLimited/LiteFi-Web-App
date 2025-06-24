import axiosInstance from "./api";
import {
  Investment,
  InvestmentPlan,
  InvestmentCalculation,
} from "../types/investments";

const BASE_URL = "/investments";

/**
 * Investment API
 *
 * Note: This API has been optimized to use only three key endpoints:
 * 1. calculateInvestmentReturns - Calculate returns for an investment
 * 2. createInvestment - Create a naira investment
 * 3. createForeignInvestment - Create a foreign currency investment
 */
export const investmentApi = {
  /**
   * Calculate investment returns based on amount, tenure, and payment preference
   *
   * @param amount - Investment amount
   * @param tenure - Investment tenure in months (min 3)
   * @param currency - Currency code (default: NGN)
   * @param upfrontInterestPayment - Whether to pay interest upfront (affects interest rate)
   *
   * Returns calculation details including interest rate, earnings, tax, and payout structure
   */
  calculateInvestmentReturns: async (
    amount: number,
    tenure: number,
    currency: string = "NGN",
    upfrontInterestPayment: boolean = false
  ) => {
    console.log("API: Calculating investment returns", {
      amount,
      tenure,
      currency,
      upfrontInterestPayment,
    });

    try {
      const response = await axiosInstance.post(`${BASE_URL}/calculate`, {
        amount,
        tenure,
        currency,
        upfrontInterestPayment,
      });
      console.log("API: Calculate response", response.data);

      // Handle both success and direct data response formats
      if (response.data) {
        // If the API returns data directly or in a data property, return it
        return response.data;
      } else {
        throw new Error("Invalid response format from calculation API");
      }
    } catch (error: any) {
      console.error("API: Calculate error", error);
      // Return a structured error object instead of throwing
      return {
        success: false,
        message: error.message || "Failed to calculate investment returns",
      };
    }
  },

  /**
   * Create a new naira investment
   *
   * @param data - Investment details including amount, name, tenure, and payment preferences
   * Returns the created investment with payment instructions
   */
  createInvestment: async (data: {
    planId?: string; // Optional for backward compatibility
    amount: number;
    name: string;
    tenure: number;
    currency: string;
    agreementAccepted: boolean;
    upfrontInterestPayment?: boolean;
  }) => {
    console.log("API: Creating naira investment", data);

    try {
      const response = await axiosInstance.post(BASE_URL, data);
      console.log("API: Create naira investment response", response.data);
      return response.data;
    } catch (error) {
      console.error("API: Create naira investment error", error);
      throw error;
    }
  },

  /**
   * Create a new foreign currency investment
   *
   * @param data - Foreign investment details including amount, name, tenure, currency and funding method
   * Returns the created investment with payment instructions
   */
  createForeignInvestment: async (data: {
    planId?: string; // Optional for backward compatibility
    amount: number;
    name: string;
    tenure: number;
    currency: string;
    agreementAccepted: boolean;
    sourceOfFunds: string;
    fundingMethod: string;
  }) => {
    console.log("API: Creating foreign investment", data);

    try {
      const response = await axiosInstance.post(`${BASE_URL}/foreign`, data);
      console.log("API: Create foreign investment response", response.data);
      return response.data;
    } catch (error) {
      console.error("API: Create foreign investment error", error);
      throw error;
    }
  },

  /**
   * @deprecated Use the new calculateInvestmentReturns API instead
   * The following APIs are only kept to maintain backward compatibility
   * with existing components during the transition
   */
  getInvestments: async (status?: string, page = 1, limit = 10) => {
    console.warn("getInvestments is deprecated and will be removed soon");
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await axiosInstance.get(
      `${BASE_URL}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * @deprecated
   */
  getInvestmentDetails: async (id: string) => {
    console.warn("getInvestmentDetails is deprecated and will be removed soon");
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * @deprecated
   */
  getInvestmentPlans: async () => {
    console.warn("getInvestmentPlans is deprecated and will be removed soon");
    const response = await axiosInstance.get(`${BASE_URL}/plans`);
    return response.data;
  },

  /**
   * @deprecated
   */
  withdrawInvestment: async (
    id: string,
    data: {
      withdrawalReason: string;
      bankAccountId: string;
    }
  ) => {
    console.warn("withdrawInvestment is deprecated and will be removed soon");
    const response = await axiosInstance.post(
      `${BASE_URL}/${id}/withdraw`,
      data
    );
    return response.data;
  },
};
