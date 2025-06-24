import { useState, useEffect } from "react";
import { investmentApi } from "../lib/investmentApi";
import { useToastContext } from "@/app/components/ToastProvider";
import { Investment } from "../types/investments";

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [activeInvestments, setActiveInvestments] = useState<Investment[]>([]);
  const [pendingInvestments, setPendingInvestments] = useState<Investment[]>(
    []
  );
  const [closedInvestments, setClosedInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { success, error: showError } = useToastContext();

  const fetchInvestments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Set empty arrays since we're not making API calls for investment lists
      setInvestments([]);
      setActiveInvestments([]);
      setPendingInvestments([]);
      setClosedInvestments([]);

      return [];
    } catch (err: any) {
      setError(err.message || "Failed to load investments");
      showError("Error", "Failed to load investment data");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getInvestmentById = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, return null as we're not making API calls
      return null;
    } catch (err: any) {
      showError("Error", "Failed to load investment details");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateReturns = async (
    amount: number,
    tenure: number,
    currency: string = "NGN",
    upfrontInterestPayment: boolean = false
  ) => {
    try {
      console.log("useInvestments: Calling calculateInvestmentReturns");
      const response = await investmentApi.calculateInvestmentReturns(
        amount,
        tenure,
        currency,
        upfrontInterestPayment
      );

      console.log("useInvestments: Calculate response received", response);

      // Handle different response formats
      if (response.success === false) {
        // This is an error response
        throw new Error(response.message || "Failed to calculate returns");
      } else if (response.data) {
        // Success response with data property
        return response.data;
      } else if (response.interestRate !== undefined) {
        // Direct data response (API returned calculation directly)
        return response;
      } else {
        // Unknown response format
        throw new Error("Invalid response format from calculation API");
      }
    } catch (err: any) {
      console.error("useInvestments: Calculate error", err);
      showError(
        "Error",
        err.message || "Failed to calculate investment returns"
      );
      return null;
    }
  };

  const createInvestment = async (data: {
    amount: number;
    name: string;
    tenure: number;
    currency: string;
    agreementAccepted: boolean;
    upfrontInterestPayment?: boolean;
  }) => {
    try {
      setIsLoading(true);
      const response = await investmentApi.createInvestment(data);

      if (response.success) {
        success("Success", "Investment created successfully");
        await fetchInvestments(); // Refresh investments
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create investment");
      }
    } catch (err: any) {
      showError("Error", err.message || "Failed to create investment");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createForeignInvestment = async (data: {
    amount: number;
    name: string;
    tenure: number;
    currency: string;
    agreementAccepted: boolean;
    sourceOfFunds: string;
    fundingMethod: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await investmentApi.createForeignInvestment(data);

      if (response.success) {
        success("Success", "Foreign investment created successfully");
        await fetchInvestments(); // Refresh investments
        return response.data;
      } else {
        throw new Error(
          response.message || "Failed to create foreign investment"
        );
      }
    } catch (err: any) {
      showError("Error", err.message || "Failed to create foreign investment");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawInvestment = async (
    id: string,
    data: {
      withdrawalReason: string;
      bankAccountId: string;
    }
  ) => {
    try {
      setIsLoading(true);
      const response = await investmentApi.withdrawInvestment(id, data);

      if (response.success) {
        success("Success", "Investment withdrawal processed successfully");
        await fetchInvestments(); // Refresh investments
        return response.data;
      } else {
        throw new Error(response.message || "Failed to process withdrawal");
      }
    } catch (err: any) {
      showError("Error", err.message || "Failed to process withdrawal");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load investments once on component mount
  useEffect(() => {
    fetchInvestments();
  }, []);

  return {
    investments,
    activeInvestments,
    pendingInvestments,
    closedInvestments,
    isLoading,
    error,
    fetchInvestments,
    getInvestmentById,
    calculateReturns,
    createInvestment,
    createForeignInvestment,
    withdrawInvestment,
    hasInvestments: investments.length > 0,
  };
}
