# LiteFi Authentication System Documentation

This document provides a comprehensive guide to the authentication system implemented in the LiteFi Web Application.

## Table of Contents
1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Authentication Flow](#authentication-flow)
4. [Implementation Details](#implementation-details)
5. [Error Handling](#error-handling)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)

## Overview

The LiteFi authentication system uses a token-based authentication approach with JWT (JSON Web Tokens). The system supports user registration, login, email verification, password reset, and logout functionalities.

## API Endpoints

The authentication system exposes the following endpoints:

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/auth/register` | POST | Register a new user | `{ email, password, firstName, lastName, referralCode? }` | `{ success, message, data: { user, token } }` |
| `/auth/login` | POST | Authenticate a user | `{ email, password }` | `{ success, message, data: { user, token } }` |
| `/auth/verify-email` | POST | Verify user's email | `{ userId, otp }` | `{ success, message }` |
| `/auth/resend-verification` | POST | Resend verification email | `{ email }` | `{ success, message }` |
| `/auth/reset-password` | POST | Request password reset | `{ email }` | `{ success, message }` |
| `/auth/create-new-password` | POST | Set new password | `{ token, password }` | `{ success, message }` |
| `/auth/logout` | POST | Logout user | None | `{ success, message }` |

## Authentication Flow

### Registration Process
1. User submits registration form with email, password, first name, and last name
2. Server validates the input and checks for existing users
3. If validation passes, a new user is created in the database
4. A verification email is sent to the user's email address
5. User receives a JWT token for initial authentication
6. User is prompted to verify their email

### Login Process
1. User submits login form with email and password
2. Server validates credentials against the database
3. If valid, a JWT token is generated and returned to the client
4. Token is stored in localStorage for subsequent authenticated requests
5. User is redirected to the dashboard or requested page

### Email Verification
1. User receives an email with a verification code (OTP)
2. User enters the code in the verification modal
3. Server validates the code against the stored OTP for that user
4. If valid, user's email is marked as verified in the database

### Password Reset
1. User requests password reset by providing their email
2. Server sends a password reset link with a token to the user's email
3. User clicks the link and sets a new password
4. Server validates the token and updates the user's password

## Implementation Details

### API Client Configuration

The API client is implemented using Axios with the following configuration:

```typescript
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
});
```

Key configuration details:
- Base URL points to the API server
- Timeout set to 10 seconds to prevent hanging requests
- `withCredentials` is disabled to avoid CORS issues

### Token Management

JWT tokens are stored in the browser's localStorage:

```typescript
// Store token after login/registration
localStorage.setItem('token', response.data.token);

// Retrieve token for authenticated requests
const token = localStorage.getItem('token') || '';
```

### Request/Response Interceptors

The API client uses interceptors for debugging and error handling:

```typescript
// Request interceptor
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

// Response interceptor
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
```

## Error Handling

The authentication system handles various error scenarios:

### Network Errors
- Connection issues to the server
- Timeout errors
- CORS-related errors

### Authentication Errors
- Invalid credentials
- Account not found
- Email already in use
- Password requirements not met

### Server Errors
- Internal server errors
- Service unavailable

Each error is handled with appropriate user feedback through toast notifications.

## Security Considerations

The authentication system implements several security measures:

1. **Password Requirements**: Passwords must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters

2. **Token-based Authentication**: JWT tokens are used for stateless authentication

3. **Email Verification**: Users must verify their email address to ensure account ownership

4. **HTTPS**: All API communications should be over HTTPS in production

## Troubleshooting

### Common Issues and Solutions

#### Network Error during API Requests
- **Symptom**: "AxiosError: Network Error" in console
- **Possible Causes**:
  - Server is not running
  - Incorrect API URL
  - CORS issues
  - Network connectivity problems
- **Solutions**:
  - Verify the server is running at the correct URL
  - Check network connectivity
  - Ensure CORS headers are properly configured on the server
  - Disable `withCredentials` if not needed

#### Authentication Token Issues
- **Symptom**: Unauthorized errors despite being logged in
- **Possible Causes**:
  - Token expired
  - Token malformed
  - Token not included in requests
- **Solutions**:
  - Implement token refresh mechanism
  - Ensure token is properly stored
  - Check that token is included in Authorization header

#### Form Validation Errors
- **Symptom**: Registration or login fails with validation errors
- **Solutions**:
  - Check form field requirements
  - Ensure email format is valid
  - Verify password meets complexity requirements

### Debugging Tips

1. Check browser console for detailed error messages
2. Verify network requests in the Network tab of browser dev tools
3. Confirm server logs for backend errors
4. Test API endpoints directly using tools like Postman or curl
