// API response types
import axios from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  error?: string;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

// Base API URL - for Next.js API routes, use relative URLs or same origin
// In development, Next.js runs on port 3000 by default
const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Set timeout to prevent hanging requests
  timeout: 10000,
  // Enable credentials for cookie support
  withCredentials: true,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      method: config.method,
      url: (config.baseURL || '') + (config.url || ''),
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error Details:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        }
      });
    } else {
      console.error('Response error:', error.response || error);
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error: any): ApiResponse => {
  console.error('API Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      success: false,
      message: error.response.data.message || 'An error occurred',
      statusCode: error.response.status,
      error: error.response.data.error
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      success: false,
      message: 'No response from server. Please check if the server is running.',
      error: 'Network error'
    };
  } else if (error.code === 'ERR_NETWORK') {
    // Specific handling for network errors
    return {
      success: false,
      message: 'Cannot connect to server. Please check your network connection and server status.',
      error: 'Network error'
    };
  } else if (error.code === 'ECONNABORTED') {
    // Timeout error
    return {
      success: false,
      message: 'Request timed out. Please try again later.',
      error: 'Timeout error'
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      success: false,
      message: error.message || 'An error occurred',
      error: 'Request error'
    };
  }
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  headers: Record<string, string> = {},
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  try {
    // Get token from localStorage if available
    let token = '';
    if (typeof window !== 'undefined' && requiresAuth) {
      token = localStorage.getItem('accessToken') || '';
    }

    // Add authorization header if token exists and auth is required
    const requestHeaders = { ...headers };
    if (token && requiresAuth) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Make the request using axios
    const config = {
      method,
      url: endpoint,
      headers: requestHeaders,
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? data : undefined,
    };

    const response = await axiosInstance(config);

    return {
      success: true,
      message: response.data.message || '',
      data: response.data.data || response.data,
      statusCode: response.status
    };
  } catch (error) {
    return handleApiError(error);
  }
}

// Auth API functions
export const authApi = {
  register: (userData: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    country?: string;
    referralCode?: string;
  }): Promise<ApiResponse<{
    user: UserData;
    verificationCode?: string;
  }>> => {
    return apiRequest('/api/auth/register', 'POST', userData, {}, false);
  },

  login: (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>('/api/auth/login', 'POST', credentials, {}, false);
  },

  logout: (): Promise<ApiResponse> => {
    return apiRequest('/api/auth/logout', 'POST', {}, {}, false);
  },

  verifyEmail: (data: {
    email: string;
    code: string;
  }): Promise<ApiResponse> => {
    return apiRequest('/api/auth/verify-email', 'POST', data, {}, false);
  },

  sendPhoneOtp: (data: {
    phone: string;
  }): Promise<ApiResponse<{
    isNigerianNumber: boolean;
    requiresOtp: boolean;
    verificationId?: string;
    phone: string;
    verified?: boolean;
  }>> => {
    return apiRequest('/api/auth/send-phone-otp', 'POST', data, {}, false);
  },

  verifyPhoneOtp: (data: {
    phone: string;
    verificationId: string;
    otp: string;
  }): Promise<ApiResponse<{
    phone: string;
    verified: boolean;
  }>> => {
    return apiRequest('/api/auth/verify-phone-otp', 'POST', data, {}, false);
  },

  // Keep the old verifyPhone for backward compatibility (now deprecated)
  verifyPhone: (data: {
    phone: string;
    code?: string;
  }): Promise<ApiResponse> => {
    return apiRequest('/api/auth/verify-phone', 'POST', data, {}, false);
  },

  resendOtp: (data: {
    email?: string;
    phone?: string;
    type: 'email' | 'phone';
  }): Promise<ApiResponse<{
    isNigerianNumber?: boolean;
    requiresOtp?: boolean;
    verificationId?: string;
    phone?: string;
  }>> => {
    return apiRequest('/api/auth/resend-otp', 'POST', data, {}, false);
  },

  resendVerification: (data: {
    email: string;
  }): Promise<ApiResponse> => {
    return apiRequest('/api/auth/resend-verification', 'POST', data, {}, false);
  },

  resetPassword: async (email: string): Promise<ApiResponse> => {
    return apiRequest('/auth/reset-password', 'POST', { email }, {}, false);
  },

  createNewPassword: async (data: {
    token: string;
    password: string;
  }): Promise<ApiResponse> => {
    return apiRequest('/auth/create-new-password', 'POST', data, {}, false);
  },

  createPassword: (data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>('/api/auth/create-password', 'POST', data, {}, false);
  }
};

export default apiRequest; 