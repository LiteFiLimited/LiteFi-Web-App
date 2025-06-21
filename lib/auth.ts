import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Type for the authentication state
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
}

// Function to set authentication token in both localStorage and cookies
export const setAuthToken = (token: string, userId: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Set in localStorage for client-side access
  localStorage.setItem('accessToken', token);
  localStorage.setItem('userId', userId);
  
  // Set in cookies for server-side middleware access
  // Set cookie with secure flags for production
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = [
    `auth-token=${token}`,
    'Path=/',
    'SameSite=Strict',
    ...(isProduction ? ['Secure'] : []),
    'Max-Age=86400' // 24 hours
  ].join('; ');
  
  document.cookie = cookieOptions;
};

// Function to check if the user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('accessToken');
  return !!token;
};

// Function to get the current user's token
export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('accessToken');
};

// Function to get the current user's ID
export const getUserId = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('userId');
};

// Function to log out the user
export const logout = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Clear localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  
  // Clear auth cookies
  document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
  document.cookie = 'refresh-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
  
  // Redirect to login page
  window.location.href = '/auth/login';
};

// Hook to protect routes that require authentication
export const useAuth = (): AuthState => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    
    if (!token) {
      // Not authenticated, redirect to login with current path as redirect
      const currentPath = window.location.pathname;
      const redirectUrl = currentPath !== '/auth/login' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
      router.push(`/auth/login${redirectUrl}`);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userId: null
      });
    } else {
      // User is authenticated
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        userId: userId
      });
    }
  }, [router]);

  return authState;
};

// Hook to redirect authenticated users away from auth pages
export const useRedirectIfAuthenticated = (redirectTo: string = '/dashboard'): void => {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // User is authenticated, redirect to dashboard or specified route
      router.push(redirectTo);
    }
  }, [router, redirectTo]);
};

// Hook for pages that require authentication (simpler version of useAuth)
export const useRequireAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    
    setAuthState({
      isAuthenticated: !!token,
      isLoading: false,
      userId: userId
    });
  }, []);

  return authState;
};

// Function to handle authentication after login/register
export const handleAuthSuccess = (token: string, userId: string, redirectPath?: string): void => {
  // Set authentication tokens
  setAuthToken(token, userId);
  
  // Redirect to the intended page or dashboard
  const targetPath = redirectPath || '/dashboard';
  window.location.href = targetPath;
};

// Function to check if a route requires authentication
export const isProtectedRoute = (pathname: string): boolean => {
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/wallet',
    '/loans',
    '/investments',
    '/settings'
  ];
  
  return protectedRoutes.some(route => pathname.startsWith(route));
};

// Function to check if a route is public (doesn't require authentication)
export const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/sign-up',
    '/auth/verify-phone',
    '/auth/create-password',
    '/auth/reset-password',
    '/auth/create-new-password',
    '/terms',
    '/privacy',
    '/login',
    '/sign-up',
    '/verify-phone',
    '/create-password',
    '/reset-password',
    '/create-new-password'
  ];
  
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
}; 