import axios from "axios";
import { getToken } from "./auth";
import { getApiUrl } from "./env-config";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  error?: string;
}

export interface Enable2FARequest {
  email: string;
}

export interface Enable2FAResponse {
  secret: string;
  message?: string;
  qrCodeUrl?: string;
  backupCodes?: string[];
}

export interface Verify2FARequest {
  email: string;
  token: string;
}

export interface Validate2FARequest {
  token: string;
}

export interface Disable2FARequest {
  token: string;
}

// Create axios instance for 2FA API
const API_URL = getApiUrl();

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("2FA API Error:", error);

    if (error.response?.status === 401) {
      // Handle authentication errors
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

// Generic API request function
async function apiRequest<T = any>(
  method: "get" | "post" | "put" | "patch" | "delete",
  endpoint: string,
  data?: any
): Promise<T> {
  try {
    const response = await axiosInstance.request({
      method,
      url: endpoint,
      data,
    });

    // Handle direct response format (not wrapped in success/data structure)
    return response.data;
  } catch (error: any) {
    console.error("2FA API Error:", error);

    if (error.response?.data) {
      // Transform error response to match our expected format
      throw {
        success: false,
        message: Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : error.response.data.message ||
            error.response.data.error ||
            "API Error",
        error: error.response.data.error || "APIError",
        statusCode: error.response.data.statusCode || error.response.status,
      };
    }

    throw {
      success: false,
      message: error.message || "Network error occurred",
      error: "NetworkError",
    };
  }
}

// 2FA API endpoints
export const twoFactorApi = {
  // Enable 2FA - returns secret and QR code for setup
  enable: async (
    data: Enable2FARequest
  ): Promise<ApiResponse<Enable2FAResponse>> => {
    try {
      const response = await apiRequest<Enable2FAResponse>(
        "post",
        "/auth/2fa/enable",
        data
      );

      // Transform direct API response to our expected format
      return {
        success: true,
        message: response.message || "2FA setup initiated successfully",
        data: {
          secret: response.secret,
          qrCodeUrl: response.qrCodeUrl,
          backupCodes: response.backupCodes,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to enable 2FA",
        error: error.error || "EnableError",
      };
    }
  },

  // Verify 2FA setup with code from authenticator app
  verify: async (data: Verify2FARequest): Promise<ApiResponse<void>> => {
    try {
      const response = await apiRequest<any>("post", "/auth/2fa/verify", data);

      // Transform direct API response to our expected format
      return {
        success: true,
        message: response.message || "2FA verification successful",
        data: undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to verify 2FA",
        error: error.error || "VerifyError",
      };
    }
  },

  // Validate 2FA code during login
  validate: (data: Validate2FARequest) =>
    apiRequest<ApiResponse<void>>("post", "/auth/2fa/validate", data),

  // Disable 2FA with verification code
  disable: (data: Disable2FARequest) =>
    apiRequest<ApiResponse<void>>("post", "/auth/2fa/disable", data),

  // Get 2FA status for current user
  getStatus: () =>
    apiRequest<ApiResponse<{ enabled: boolean }>>("get", "/auth/2fa/status"),
};

export default twoFactorApi;
