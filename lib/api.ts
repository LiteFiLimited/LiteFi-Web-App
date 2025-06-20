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

export default axiosInstance; 