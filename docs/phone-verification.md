# Phone Verification System Documentation

This document provides detailed information about the phone verification system implemented in the LiteFi Web Application.

## Overview

The phone verification system handles both Nigerian and international phone numbers with different verification approaches:

- **Nigerian Numbers**: Verified using SMS OTP via KudiSMS
- **International Numbers**: Automatically saved and verified manually by admin

## Phone Number Detection

### Nigerian Number Patterns

The system identifies Nigerian numbers using the following patterns:

1. **International Format**: `+234` followed by 10 digits (total 13 digits)
2. **Local Format**: `0` followed by 10 digits (total 11 digits)
3. **Common Prefixes**: 
   - MTN: 0703, 0706, 0803, 0806, 0810, 0813, 0814, 0816, 0903, 0906
   - Airtel: 0701, 0708, 0802, 0808, 0812, 0901, 0902, 0904, 0907, 0912
   - Glo: 0705, 0805, 0807, 0811, 0815, 0905, 0915
   - 9mobile: 0704, 0709, 0804, 0809, 0817, 0818, 0819, 0908, 0909, 0913, 0916, 0917, 0918

### International Numbers

Any phone number that doesn't match Nigerian patterns is considered international.

## API Endpoints

### Phone Verification

**Endpoint**: `POST /api/auth/verify-phone`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "phone": "08012345678",
  "code": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Operation successful"
}
```

**Behavior**:
- For Nigerian numbers: `code` is required and verified against KudiSMS
- For international numbers: `code` is optional, phone is automatically verified

### Resend Phone OTP

**Endpoint**: `POST /api/auth/resend-otp`

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "phone": "08012345678",
  "type": "phone"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Operation successful"
}
```

**Note**: Only works for Nigerian numbers. International numbers will return an error.

## Frontend Implementation

### Phone Validation Utilities

The `lib/phoneValidator.ts` file provides utilities for phone number validation:

```typescript
import { isNigerianNumber, getPhoneNumberInfo, validatePhoneNumber } from '@/lib/phoneValidator';

// Check if a number is Nigerian
const isNigerian = isNigerianNumber('+2348012345678'); // true

// Get phone number information
const phoneInfo = getPhoneNumberInfo('+2348012345678');
// Returns: { country: 'Nigeria', requiresVerification: true, verificationMethod: 'SMS OTP via KudiSMS' }

// Validate phone number
const validation = validatePhoneNumber('08012345678');
// Returns: { isValid: true, isNigerian: true, requiresVerification: true, formattedNumber: '0801 234 5678', errors: [] }
```

### Phone Verification Flow

1. **Phone Input**: User enters phone number using `PhoneInput` component
2. **Number Detection**: System detects if number is Nigerian or international
3. **Verification Process**:
   - **Nigerian**: Show OTP modal, send SMS, verify code
   - **International**: Automatically save and mark as verified
4. **Completion**: Redirect to next step in registration flow

### Components

#### PhoneVerificationForm

Main component for phone verification with the following features:
- Phone number input with country detection
- Real-time validation and info display
- Automatic handling of Nigerian vs international numbers
- Integration with toast notifications

#### PhoneVerificationModal

Modal component for OTP verification:
- OTP input field
- Resend OTP functionality
- Loading states
- Error handling

## Error Handling

### Common Error Scenarios

1. **Invalid Phone Format**:
   ```json
   {
     "statusCode": 400,
     "message": "Bad Request",
     "error": "Phone number is required"
   }
   ```

2. **Missing OTP for Nigerian Number**:
   ```json
   {
     "statusCode": 400,
     "message": "Bad Request",
     "error": "Verification code is required for Nigerian numbers"
   }
   ```

3. **Invalid OTP Format**:
   ```json
   {
     "statusCode": 400,
     "message": "Bad Request",
     "error": "Invalid verification code format. Must be a 6-digit code."
   }
   ```

4. **Unauthorized Request**:
   ```json
   {
     "statusCode": 401,
     "message": "Unauthorized"
   }
   ```

## Integration with KudiSMS

For production implementation, the system should integrate with KudiSMS API for Nigerian numbers:

1. **Send OTP**: When user requests verification for Nigerian number
2. **Verify OTP**: When user submits the received code
3. **Resend OTP**: When user requests a new code

### Mock Implementation

Currently, the system uses mock responses:
- OTP `123456` always succeeds
- Any other OTP fails
- International numbers are automatically verified

## Security Considerations

1. **Rate Limiting**: Implement rate limiting for OTP requests
2. **OTP Expiry**: Set appropriate expiry times for OTPs
3. **Attempt Limits**: Limit number of verification attempts
4. **Token Validation**: Always validate JWT tokens in API requests

## Testing

### Test Cases

1. **Nigerian Number Verification**:
   - Valid Nigerian number with correct OTP
   - Valid Nigerian number with incorrect OTP
   - Invalid Nigerian number format

2. **International Number Verification**:
   - Valid international number (auto-verified)
   - Invalid international number format

3. **Resend OTP**:
   - Successful resend for Nigerian number
   - Error for international number resend

### Mock Data

Use these test numbers for development:
- Nigerian: `+2348012345678`, `08012345678`
- International: `+1234567890`, `+447123456789`
- Test OTP: `123456`

## Future Enhancements

1. **Real KudiSMS Integration**: Replace mock implementation
2. **Phone Number Formatting**: Improve display formatting
3. **Additional Carriers**: Support for new Nigerian carriers
4. **Bulk Verification**: Admin interface for manual verification
5. **Analytics**: Track verification success rates 