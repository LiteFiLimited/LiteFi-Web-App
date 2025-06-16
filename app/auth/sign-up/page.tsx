"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import EmailVerificationModal from "@/app/components/EmailVerificationModal";
import { useToastContext } from "@/app/components/ToastProvider";
import { authApi } from "@/lib/api";
import { useRedirectIfAuthenticated } from "@/lib/auth";

// Import images directly
import heroImage from "@/public/assets/images/image.png";
import logoImage from "@/public/assets/images/logo.png";

export default function SignUp() {
  const { success, error, info } = useToastContext();
  
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "NG",
    referralCode: "",
    agreeToTerms: false
  });

  const [fieldTouched, setFieldTouched] = React.useState({
    firstName: false,
    lastName: false,
    email: false
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [showVerificationModal, setShowVerificationModal] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Clear any existing tokens when sign-up page loads (unless we're in registration process)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !isRegistering) {
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        console.log('Sign-up page: clearing existing token to allow new registration');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    }
  }, []);

  // Only redirect if already authenticated and not in the middle of registration
  React.useEffect(() => {
    console.log('Sign-up page: checking auth state', { isRegistering, hasToken: !!localStorage.getItem('token') });
    if (!isRegistering && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Sign-up page: redirecting to dashboard because user is already authenticated');
        window.location.href = '/dashboard';
      }
    }
  }, [isRegistering]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleInputBlur = (field: string) => {
    setFieldTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: checked
    }));
  };

  // Field validations
  const isNameValid = (name: string) => name.trim().length > 1;
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validations = {
    firstName: isNameValid(formData.firstName),
    lastName: isNameValid(formData.lastName),
    email: isEmailValid(formData.email)
  };

  const showErrors = {
    firstName: fieldTouched.firstName && !validations.firstName,
    lastName: fieldTouched.lastName && !validations.lastName,
    email: fieldTouched.email && !validations.email
  };

  const isFormValid = () => {
    return validations.firstName && validations.lastName && validations.email && formData.agreeToTerms;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to display errors
    setFieldTouched({
      firstName: true,
      lastName: true,
      email: true
    });

    if (isFormValid()) {
      setIsLoading(true);
      setIsRegistering(true);
      try {
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          country: formData.country,
          referralCode: formData.referralCode || undefined
        };
        
        console.log("Registration data:", userData);
        
        const response = await authApi.register(userData);
        
        console.log("Registration response:", response);

        if (response.success) {
          success("Registration successful!", "Please verify your email to continue");
          
          // Store user data for verification flow
          setUserId(response.data?.user?.id || "");
          setShowVerificationModal(true);
        } else {
          error("Registration failed", response.message || "Please try again");
          setIsRegistering(false);
        }
      } catch (err) {
        console.error("Registration error details:", err);
        error("Registration failed", "An unexpected error occurred");
        setIsRegistering(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      error("Please fix the errors in the form", "All required fields must be filled correctly");
    }
  };

  const handleVerifyEmail = async (otp: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyEmail({
        email: formData.email,
        code: otp
      });

      if (response.success) {
        success("Email verified successfully!", "Now let's verify your phone number");
        setShowVerificationModal(false);
        
        // Store email for subsequent steps
        sessionStorage.setItem('registrationEmail', formData.email);
        
        // Continue registration flow - redirect to phone verification
        setTimeout(() => {
          window.location.href = "/auth/verify-phone";
        }, 1500);
      } else {
        error("Verification failed", response.message || "Please try again");
      }
    } catch (err) {
      error("Verification failed", "An unexpected error occurred");
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.resendOtp({
        email: formData.email,
        type: 'email'
      });
      
      if (response.success) {
        info("Verification code sent", `A new code has been sent to ${formData.email}`);
      } else {
        error("Failed to resend code", response.message || "Please try again");
      }
    } catch (err) {
      error("Failed to resend code", "An unexpected error occurred");
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    // Close modal and let user change email
    setShowVerificationModal(false);
    setIsRegistering(false);
    // Clear the stored token since user wants to change email
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-[55%]">
        <div className="h-screen w-full p-4">
          <Image
            src={heroImage}
            alt="Sign up hero"
            className="object-fill h-full w-full rounded-lg"
            style={{ width: '100%', height: '100%' }}
            priority
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-[45%] flex justify-center items-start">
        <div className="bg-white w-full max-h-[calc(100vh-2rem)] overflow-y-auto px-8 pt-8 m-4">
          <div className="flex justify-start mb-4">
            <Image 
              src={logoImage} 
              alt="LiteFi Logo" 
              width={80}
              height={24}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          <h1 className="text-2xl font-bold mb-2 text-start">Create an account</h1>
          <p className="text-gray-500 text-sm mb-4 text-start">Create an account to access easy loans and smart investments</p>

          <form className="space-y-3 pb-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="Enter your first name" 
                className={`bg-gray-50 ${showErrors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('firstName')}
                required
                disabled={isLoading}
              />
              {showErrors.firstName && (
                <p className="text-xs text-red-500">First name must be at least 2 characters</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Enter your last name" 
                className={`bg-gray-50 ${showErrors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('lastName')}
                required
                disabled={isLoading}
              />
              {showErrors.lastName && (
                <p className="text-xs text-red-500">Last name must be at least 2 characters</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className={`bg-gray-50 ${showErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('email')}
                required
                disabled={isLoading}
              />
              {showErrors.email && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral code (Optional)</Label>
              <Input 
                id="referralCode" 
                placeholder="Enter referral code" 
                className="bg-gray-50"
                value={formData.referralCode}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.agreeToTerms}
                onCheckedChange={handleCheckboxChange}
                required
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-xs text-gray-500">
                By creating an account, I agree to your{" "}
                <Link href="/terms" className="text-red-600 hover:underline">
                  Terms of use
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-red-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-red-600 hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <EmailVerificationModal
          email={formData.email}
          onCloseAction={() => setShowVerificationModal(false)}
          onVerifyAction={handleVerifyEmail}
          onResendOtpAction={handleResendOtp}
          onChangeEmailAction={handleChangeEmail}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}