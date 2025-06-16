# Authentication Integration

This document provides a comprehensive overview of the authentication system implemented in the LiteFi Web Application.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Client-Side Authentication](#client-side-authentication)
- [Protected Routes](#protected-routes)
- [Components](#components)
- [Future Improvements](#future-improvements)

## Overview

The authentication system in LiteFi Web App provides secure user registration, login, and session management. It includes features such as:

- User registration with email verification
- Secure login with JWT token-based authentication
- Protected routes that require authentication
- Logout functionality
- Password reset flow (implemented but not fully connected)

## Architecture

The authentication system follows a client-server architecture with:

1. **Frontend**: Next.js App Router for client-side rendering and routing
2. **Backend**: Next.js API Routes for server-side logic
3. **Storage**: Client-side token storage using localStorage
4. **Protection**: Middleware for route protection

### Authentication Flow

1. **Registration**:
   - User submits registration form
   - API validates input and creates a new user
   - A verification email is sent to the user
   - User verifies email with OTP
   - User is redirected to dashboard

2. **Login**:
   - User submits login credentials
   - API validates credentials and returns a JWT token
   - Token is stored in localStorage
   - User is redirected to dashboard

3. **Protected Routes**:
   - Middleware checks for valid token
   - If no token is found, user is redirected to login
   - If token is found, request proceeds

4. **Logout**:
   - Token is removed from localStorage
   - User is redirected to login page

## API Endpoints

### User Registration

```
POST /api/auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "referralCode": "OPTIONAL_CODE"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123456",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false,
      "isPhoneVerified": false,
      "createdAt": "2023-05-29T19:27:19.951Z"
    },
    "token": "jwt_token_here"
  }
}
```

### User Login

```
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123456",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": true,
      "isPhoneVerified": false,
      "createdAt": "2023-05-29T19:27:19.951Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Email Verification

```
POST /api/auth/verify-email
```

**Request Body**:
```json
{
  "code": "123456"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Operation successful"
}
```

### Phone Verification

```
POST /api/auth/verify-phone
```

**Request Body**:
```json
{
  "phone": "08012345678",
  "code": "123456"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Operation successful"
}
```

**Note**: For Nigerian numbers, the `code` field is required. For international numbers, the `code` field is optional and the phone number is automatically marked as verified.

### Resend OTP

```
POST /api/auth/resend-otp
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "phone": "08012345678",
  "type": "email"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Operation successful"
}
```

**Note**: The `type` field can be "email" or "phone". Either `email` or `phone` must be provided depending on the type of OTP to resend.

### Logout

```
POST /api/auth/logout
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Client-Side Authentication

### API Service

The `lib/api.ts` file provides a centralized service for making API requests. It includes:

- Generic `apiRequest` function for making HTTP requests
- Automatic token inclusion in requests
- Error handling for API responses
- Type definitions for API responses

```typescript
// Example usage
import { authApi } from '@/lib/api';

// Register a new user
const response = await authApi.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@example.com',
  password: 'Password123!'
});

// Login
const loginResponse = await authApi.login({
  email: 'user@example.com',
  password: 'Password123!'
});
```

### Authentication Utilities

The `lib/auth.ts` file provides utilities for client-side authentication:

- `isAuthenticated()`: Check if user is authenticated
- `getToken()`: Get the current user's token
- `logout()`: Log out the user
- `useAuth()`: React hook to protect routes
- `useRedirectIfAuthenticated()`: React hook to redirect authenticated users

```typescript
// Example usage
import { useAuth, logout } from '@/lib/auth';

// In a protected component
const { isAuthenticated, isLoading } = useAuth();

// To log out
const handleLogout = () => {
  logout();
};
```

## Protected Routes

Protected routes are implemented using Next.js middleware in `middleware.ts`. The middleware:

1. Checks for authentication token in cookies or headers
2. Redirects unauthenticated users to the login page
3. Preserves the original URL as a redirect parameter

```typescript
// Middleware configuration
export const config = {
  matcher: [
    // Public routes that are rewritten
    '/login',
    '/sign-up',
    '/verify-phone',
    '/create-password',
    '/reset-password',
    '/create-new-password',
    // Protected routes
    '/dashboard/:path*',
  ],
};
```

## Components

### Login Component

The login component (`app/auth/login/page.tsx`) provides:

- Email and password validation
- Error handling for invalid credentials
- Loading state during authentication
- Redirect to original URL after successful login

### Registration Component

The registration component (`app/auth/sign-up/page.tsx`) provides:

- Form validation for all required fields
- Password strength requirements
- Terms and conditions acceptance
- Email verification flow

### Email Verification Modal

The email verification modal (`app/components/EmailVerificationModal.tsx`) provides:

- OTP input and validation
- Resend OTP functionality
- Option to change email address
- Loading state during verification

### Logout Button

The logout button component (`components/shared/LogoutButton.tsx`) provides:

- Configurable appearance
- Loading state during logout
- Automatic redirection after logout

## Future Improvements

1. **Token Refresh**: Implement token refresh mechanism for extended sessions
2. **Remember Me**: Add option to keep users logged in across sessions
3. **Social Login**: Integration with social login providers (Google, Facebook, etc.)
4. **Two-Factor Authentication**: Add additional security with 2FA
5. **Session Management**: Allow users to view and manage active sessions
6. **Password Strength Meter**: Visual indicator of password strength during registration
7. **Account Lockout**: Implement account lockout after multiple failed login attempts
8. **Audit Logging**: Track authentication events for security monitoring

## Implementation Details

The authentication system is currently implemented with mock endpoints that simulate the behavior of a real backend. In a production environment, these endpoints would connect to a database and implement proper security measures such as:

- Password hashing with bcrypt
- Secure JWT token generation and validation
- Rate limiting to prevent brute force attacks
- CSRF protection
- Proper HTTP security headers

When connecting to a real backend, only the API implementation needs to be updated while the client-side code can remain largely unchanged. 