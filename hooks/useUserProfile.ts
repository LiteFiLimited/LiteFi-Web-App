import { useState, useEffect, useCallback } from "react";
import { userApi } from "@/lib/api";
import { UserData, BankAccount, Document } from "@/types/user";
import { useToastContext } from "@/app/components/ToastProvider";
import { getToken } from "@/lib/auth";

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
  const [investmentProfileComplete, setInvestmentProfileComplete] =
    useState(false);
  const [loanProfileComplete, setLoanProfileComplete] = useState(false);

  const { success, error: showError } = useToastContext();

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getProfile();

      console.log("Raw profile response:", response);

      // Handle different response structures
      let userData: UserData;
      if (response && typeof response === "object") {
        // Handle nested structure: response.data.data
        if (
          "data" in response &&
          response.data &&
          typeof response.data === "object" &&
          "data" in response.data &&
          response.data.data
        ) {
          userData = response.data.data as UserData;
          console.log("Found nested data structure:", userData);
        }
        // If response has a data property with user data directly
        else if (
          "data" in response &&
          response.data &&
          "firstName" in (response.data as any)
        ) {
          userData = response.data as UserData;
          console.log("Found data property:", userData);
        }
        // If response is the user data directly
        else if ("firstName" in response) {
          userData = response as unknown as UserData;
          console.log("Found direct user data:", userData);
        }
        // If none of the above, try to use the response as is
        else {
          console.warn("Unexpected profile response structure:", response);
          userData = response as unknown as UserData;
        }

        setProfile(userData);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      setError(err.message || "Failed to fetch profile");
      showError("Error", "Failed to fetch profile data");
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const updateProfile = async (data: Partial<UserData>) => {
    try {
      setIsLoading(true);
      const response = await userApi.updateProfile(data);

      console.log("Raw update profile response:", response);

      // Handle different response structures
      let userData: UserData;
      if (response && typeof response === "object") {
        // Handle nested structure: response.data.data
        if (
          "data" in response &&
          response.data &&
          typeof response.data === "object" &&
          "data" in response.data &&
          response.data.data
        ) {
          userData = response.data.data as UserData;
          console.log("Found nested data structure:", userData);
        }
        // If response has a data property with user data directly
        else if (
          "data" in response &&
          response.data &&
          "firstName" in (response.data as any)
        ) {
          userData = response.data as UserData;
          console.log("Found data property:", userData);
        }
        // If response is the user data directly
        else if ("firstName" in response) {
          userData = response as unknown as UserData;
          console.log("Found direct user data:", userData);
        }
        // If none of the above, try to use the response as is
        else {
          console.warn(
            "Unexpected update profile response structure:",
            response
          );
          userData = response as unknown as UserData;
        }

        setProfile(userData);
        success("Success", "Profile updated successfully");
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      showError("Error", err.message || "Failed to update profile");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployment = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await userApi.updateEmployment(data);
      await fetchProfile();
      success("Success", "Employment information updated successfully");
      return true;
    } catch (err: any) {
      // Handle array of error messages from backend
      if (Array.isArray(err.message)) {
        throw err; // Pass array of error messages to component
      }
      const errorMessage =
        err.message || err.error || "Failed to update employment information";
      showError("Error", errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBusiness = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await userApi.updateBusiness(data);
      await fetchProfile();
      success("Success", "Business information updated successfully");
      return true;
    } catch (err: any) {
      showError(
        "Error",
        err.message || "Failed to update business information"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNextOfKin = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await userApi.updateNextOfKin(data);
      await fetchProfile();
      success("Success", "Next of kin information updated successfully");
      return true;
    } catch (err: any) {
      showError(
        "Error",
        err.message || "Failed to update next of kin information"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGuarantor = async (data: FormData) => {
    try {
      setIsLoading(true);
      const token = getToken();

      // Send the entire FormData (including file) to the guarantor endpoint
      const response = await fetch("/api/users/guarantor", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data, // Send FormData directly
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Failed to update guarantor information"
        );
      }

      await fetchProfile(); // Refresh profile to get updated guarantor data
      success("Success", "Guarantor information updated successfully");
      return true;
    } catch (err: any) {
      showError(
        "Error",
        err.message || "Failed to update guarantor information"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Bank account management
  const fetchBankAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getBankAccounts();

      // Handle different response structures
      let bankAccountsArray: BankAccount[];
      if (Array.isArray(response)) {
        // Direct array response
        bankAccountsArray = response as BankAccount[];
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        // Wrapped in data property
        bankAccountsArray = Array.isArray(response.data)
          ? (response.data as BankAccount[])
          : [];
      } else {
        // Fallback to empty array
        bankAccountsArray = [];
      }

      setBankAccounts(bankAccountsArray);
      return bankAccountsArray;
    } catch (err: any) {
      console.error("Failed to fetch bank accounts:", err);
      showError("Error", err.message || "Failed to fetch bank accounts");
      // Always return empty array on error
      const emptyArray: BankAccount[] = [];
      setBankAccounts(emptyArray);
      return emptyArray;
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const addBankAccount = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await userApi.addBankAccount(data);
      await fetchBankAccounts(); // Refresh bank accounts after adding
      success("Success", "Bank account added successfully");
      return true;
    } catch (err: any) {
      showError("Error", err.message || "Failed to add bank account");
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
      success("Success", "Default bank account updated successfully");
      return true;
    } catch (err: any) {
      showError(
        "Error",
        err.message || "Failed to update default bank account"
      );
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
      success("Success", "Bank account deleted successfully");
      return true;
    } catch (err: any) {
      showError("Error", err.message || "Failed to delete bank account");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Document management
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getDocuments();

      // Handle different response structures
      let documentsArray: Document[];
      if (Array.isArray(response)) {
        // Direct array response
        documentsArray = response as Document[];
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        // Wrapped in data property
        documentsArray = Array.isArray(response.data)
          ? (response.data as Document[])
          : [];
      } else {
        // Fallback to empty array
        documentsArray = [];
      }

      setDocuments(documentsArray);
      return documentsArray;
    } catch (err: any) {
      console.error("Failed to fetch documents:", err);
      showError("Error", err.message || "Failed to fetch documents");
      // Always return empty array on error to prevent undefined issues
      const emptyArray: Document[] = [];
      setDocuments(emptyArray);
      return emptyArray;
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const uploadDocument = async (
    file: File,
    documentType: string,
    description: string
  ) => {
    try {
      setIsLoading(true);
      const token = getToken();

      // Create FormData with the file and description
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);

      // Use the new document type-specific endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch(
        `/api/users/upload-document/${documentType}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        let errorMessage = error.message || "Failed to upload document";

        // Clean up error message for duplicate uploads
        if (errorMessage.includes("cannot be updated once uploaded")) {
          errorMessage = "Cannot be updated once uploaded.";
        }

        throw new Error(errorMessage);
      }

      await fetchDocuments(); // Refresh documents after upload
      return true;
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new Error("Upload timed out. Please try again.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      setIsLoading(true);
      await userApi.deleteDocument(documentId);
      await fetchDocuments(); // Refresh documents after deletion
      success("Success", "Document deleted successfully");
      return true;
    } catch (err: any) {
      showError("Error", err.message || "Failed to delete document");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Profile completion status (mocked since endpoints were removed)
  const checkInvestmentProfileStatus = async () => {
    // Return mocked data since API endpoint is not available
    const isComplete = true;
    setInvestmentProfileComplete(isComplete);
    return { isComplete, missingFields: [] };
  };

  const checkLoanProfileStatus = async () => {
    // Return mocked data since API endpoint is not available
    const isComplete = true;
    setLoanProfileComplete(isComplete);
    return { isComplete, missingFields: [] };
  };

  // Security
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      setIsLoading(true);
      await userApi.changePassword({ currentPassword, newPassword });
      success("Success", "Password changed successfully");
      return true;
    } catch (err: any) {
      showError("Error", err.message || "Failed to change password");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setupTransactionPin = async (pin: string) => {
    try {
      setIsLoading(true);
      await userApi.setupTransactionPin({ pin });
      success("Success", "Transaction PIN set successfully");
      return true;
    } catch (err: any) {
      showError("Error", err.message || "Failed to set transaction PIN");
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
        success("Success", "Transaction PIN verified successfully");
      }
      return response.success;
    } catch (err: any) {
      showError("Error", err.message || "Failed to verify transaction PIN");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadBankStatement = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const token = getToken();

      // Use the new document type-specific endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch(
        `/api/users/upload-document/BANK_STATEMENT`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        let errorMessage = error.message || "Failed to upload bank statement";

        // Clean up error message for duplicate uploads
        if (errorMessage.includes("cannot be updated once uploaded")) {
          errorMessage = "Cannot be updated once uploaded.";
        }

        throw new Error(errorMessage);
      }

      await fetchDocuments(); // Refresh documents after upload
      return true;
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new Error("Upload timed out. Please try again.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      setIsLoading(true);
      const response = await userApi.uploadProfilePicture(file);
      // Refresh profile to get updated avatarUrl
      await fetchProfile();
      success("Success", "Profile picture uploaded successfully");
      return response.data?.avatarUrl || "";
    } catch (err: any) {
      showError("Error", err.message || "Failed to upload profile picture");
      throw err;
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
    uploadBankStatement,
    uploadProfilePicture,
  };
}
