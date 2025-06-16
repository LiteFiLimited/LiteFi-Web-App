# LiteFi Production Authentication Guide

## Overview

This guide documents the updated authentication flow for LiteFi Web Application that aligns with the backend API requirements. The authentication system now follows a **step-by-step verification process** where passwords are created **after** email and phone verification.

## Key Changes from Previous Implementation

### 🔄 **Major Flow Changes**
1. **No Password at Registration** - Users register without providing a password
2. **Separate Password Creation** - Passwords are created in a dedicated step after verification
3. **Email Verification First** - All users must verify their email before proceeding
4. **Smart Phone Verification** - Nigerian numbers use SMS OTP, international numbers auto-verify
5. **Token Management** - Tokens are only issued after complete verification and password creation

### 🗑️ **Removed Components**
- Password fields from registration form
- Password validation during sign-up
- Password strength meter from sign-up page
- Confirm password field from sign-up page

### ➕ **Added Components**
- Enhanced create-password page with validation
- Password strength meter in password creation
- Session management for email during verification flow
- Skip phone verification option
- Progress indicators for multi-step flow

## Updated Authentication Flow

### Step 1: User Registration
**Endpoint:** `POST /api/auth/register`

**Frontend Form Fields:**
- First Name (required)
- Last Name (required)
- Email (required)
- Phone Number (optional)
- Country (optional, defaults to 'NG')
- Referral Code (optional)
- Terms & Conditions acceptance (required)

**Key Changes:**
- ❌ Removed: Password field
- ❌ Removed: Confirm password field
- ✅ Made phone optional
- ✅ Added country field for phone context

**API Request:**
```javascript
const response = await authApi.register({
  firstName: "John",
  lastName: "Doe", 
  email: "user@example.com",
  phone: "+2348012345678", // Optional
  country: "NG", // Optional
  referralCode: "REF123" // Optional
});
```

**Success Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email to continue.",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": false,
      "phoneVerified": false,
      "verified": false
    },
    "verificationCode": "123456" // Only in development
  }
}
```

### Step 2: Email Verification
**Endpoint:** `POST /api/auth/verify-email`

**Process:**
1. User receives email verification code
2. User enters 6-digit code
3. Email is marked as verified
4. User proceeds to phone verification

**Frontend Implementation:**
```javascript
const handleVerifyEmail = async (otp: string) => {
  const response = await authApi.verifyEmail({
    email: formData.email,
    code: otp
  });

  if (response.success) {
    // Store email for subsequent steps
    sessionStorage.setItem('registrationEmail', formData.email);
    // Redirect to phone verification
    window.location.href = "/auth/verify-phone";
  }
};
```

### Step 3: Phone Verification
**Endpoint:** `POST /api/auth/send-phone-otp` (for Nigerian numbers)

**Smart Verification Logic:**
- **Nigerian Numbers (+234...)**: Requires SMS OTP verification
- **International Numbers**: Automatically verified (manual admin review)
- **No Phone Provided**: Can skip this step

**Frontend Implementation:**
```javascript
const handleSubmitPhone = async () => {
  const response = await authApi.sendPhoneOtp({ phone: phoneNumber });
  
  if (response.data.requiresOtp) {
    // Nigerian number - show OTP modal
    setShowVerificationModal(true);
  } else {
    // International number - proceed to password creation
    router.push(`/auth/create-password?email=${email}`);
  }
};
```

**Skip Option:**
Users can skip phone verification and proceed directly to password creation.

### Step 4: Password Creation
**Endpoint:** `POST /api/auth/create-password`

**Features:**
- Real-time password validation
- Password strength meter
- Comprehensive password requirements
- Account activation upon successful creation

**Frontend Implementation:**
```javascript
const handleSubmit = async () => {
  const response = await authApi.createPassword({
    email: email,
    password: password
  });

  if (response.success) {
    // Store authentication tokens
    setAuthToken(response.data.token, response.data.user.id);
    // Redirect to dashboard
    window.location.href = "/dashboard";
  }
};
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Step 5: Account Activation
After successful password creation:
- User receives authentication tokens
- Account is fully activated
- User can access protected routes
- Tokens are stored in both localStorage and HTTP cookies

## Frontend Components Updated

### 1. Sign-Up Page (`app/auth/sign-up/page.tsx`)
**Changes:**
- Removed password and confirm password fields
- Added phone number as optional field
- Updated form validation
- Modified API integration for passwordless registration
- Enhanced email verification modal integration

### 2. Create Password Page (`app/auth/create-password/page.tsx`)
**Enhancements:**
- Added comprehensive password validation
- Integrated password strength meter
- Added progress indicators
- Implemented email parameter handling
- Added proper error handling and loading states

### 3. Phone Verification Form (`app/components/PhoneVerificationForm.tsx`)
**Improvements:**
- Added skip verification option
- Enhanced international number handling
- Improved session management
- Better error handling for OTP flow

### 4. Email Verification Modal (`app/components/EmailVerificationModal.tsx`)
**Updates:**
- Improved session storage management
- Enhanced error handling
- Better loading state management

## API Endpoints Updated

### 1. Registration Endpoint (`app/api/auth/register/route.ts`)
- Removed password validation
- Updated required fields validation
- Modified response structure
- Enhanced error handling

### 2. Create Password Endpoint (`app/api/auth/create-password/route.ts`)
- New endpoint for password creation
- Token generation and cookie setting
- Comprehensive validation
- Account activation logic

## Session Management

### Email Storage
During the verification flow, the user's email is stored in `sessionStorage`:
```javascript
sessionStorage.setItem('registrationEmail', email);
```

### Token Management
After password creation, tokens are stored in:
- **localStorage**: For client-side API requests
- **HTTP Cookies**: For server-side middleware

## Error Handling

### Common Error Scenarios
1. **Missing Email**: Redirect to sign-up
2. **Invalid Password**: Show validation errors
3. **Network Issues**: User-friendly error messages
4. **Session Expired**: Clear storage and redirect

### Frontend Error Implementation
```javascript
try {
  const response = await authApi.createPassword(data);
  // Handle success
} catch (error) {
  if (error.code === 'ERR_NETWORK') {
    error("Connection Error", "Please check your network connection");
  } else {
    error("Error", error.message || "An unexpected error occurred");
  }
}
```

## Security Considerations

### 1. Password Security
- Client-side validation before submission
- Server-side validation enforcement
- Password strength requirements
- Secure password transmission

### 2. Session Security
- Temporary email storage in sessionStorage
- Automatic cleanup after successful registration
- Token-based authentication
- HTTP-only cookies for refresh tokens

### 3. Verification Security
- Time-limited verification codes
- Rate limiting on verification attempts
- Secure OTP transmission via SMS

## Testing Considerations

### Unit Tests
- Form validation logic
- API integration functions
- Error handling scenarios
- Session management

### Integration Tests
- Complete registration flow
- Email verification process
- Phone verification for different number types
- Password creation and account activation

### User Acceptance Tests
- User can complete registration without issues
- Email verification works correctly
- Phone verification handles international numbers
- Password creation provides good UX

## Migration Checklist

For updating existing deployments:

- [ ] Update frontend registration form
- [ ] Implement create-password page
- [ ] Update API endpoints
- [ ] Test complete registration flow
- [ ] Update error handling
- [ ] Test session management
- [ ] Verify token storage
- [ ] Test skip phone verification option
- [ ] Update documentation
- [ ] Deploy and monitor

## Production Deployment Notes

### Environment Variables
Ensure these are set:
- `BACKEND_API_URL`: Backend API endpoint
- `NODE_ENV`: Set to 'production' for secure cookies

### Monitoring
Monitor these metrics:
- Registration completion rates
- Email verification success rates
- Phone verification success rates (Nigerian vs International)
- Password creation success rates
- User drop-off points in the flow

### Performance
- Optimize API response times
- Implement proper loading states
- Handle network failures gracefully
- Provide clear user feedback

This updated authentication flow provides a more secure and user-friendly experience while aligning with backend API requirements and industry best practices. 