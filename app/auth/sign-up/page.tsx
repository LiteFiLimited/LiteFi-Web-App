"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import EmailVerificationModal from "@/app/components/EmailVerificationModal";
import { useToastContext } from "@/app/components/ToastProvider";

// Import images directly
import heroImage from "@/public/assets/images/image.png";
import logoImage from "@/public/assets/images/logo.png";

export default function SignUp() {
  const { success, error, info } = useToastContext();
  
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    agreeToTerms: false
  });

  const [fieldTouched, setFieldTouched] = React.useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [showVerificationModal, setShowVerificationModal] = React.useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Field validations
  const isNameValid = (name: string) => name.trim().length > 1;
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password: string) => password.length >= 8;
  const isConfirmPasswordValid = (confirmPassword: string) => confirmPassword === formData.password && confirmPassword.length > 0;

  const validations = {
    firstName: isNameValid(formData.firstName),
    lastName: isNameValid(formData.lastName),
    email: isEmailValid(formData.email),
    password: isPasswordValid(formData.password),
    confirmPassword: isConfirmPasswordValid(formData.confirmPassword)
  };

  const showErrors = {
    firstName: fieldTouched.firstName && !validations.firstName,
    lastName: fieldTouched.lastName && !validations.lastName,
    email: fieldTouched.email && !validations.email,
    password: fieldTouched.password && !validations.password,
    confirmPassword: fieldTouched.confirmPassword && !validations.confirmPassword
  };

  const isFormValid = () => {
    return validations.firstName && validations.lastName && validations.email && validations.password && validations.confirmPassword && formData.agreeToTerms;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to display errors
    setFieldTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (isFormValid()) {
      success("Account created successfully!", "Please verify your email to continue");
      setShowVerificationModal(true);
    } else {
      error("Please fix the errors in the form", "All required fields must be filled correctly");
    }
  };

  const handleVerifyEmail = (otp: string) => {
    // Handle OTP verification here
    console.log("Verifying OTP:", otp);
    success("Email verified successfully!", "Welcome to LiteFi! Redirecting to dashboard...");
    // If verification is successful, redirect to dashboard or next step
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  };

  const handleResendOtp = () => {
    // Handle resending OTP here
    console.log("Resending OTP to:", formData.email);
    info("Verification code sent", `A new code has been sent to ${formData.email}`);
  };

  const handleChangeEmail = () => {
    // Close modal and let user change email
    setShowVerificationModal(false);
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
              />
              {showErrors.email && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 flex items-center text-sm"
                >
                  {showPassword ? (
                    <>
                      <EyeOffIcon className="h-4 w-4 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Show
                    </>
                  )}
                </button>
              </div>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className={`bg-gray-50 ${showErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('password')}
                required
              />
              {showErrors.password && (
                <p className="text-xs text-red-500">Password must be at least 8 characters</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 flex items-center text-sm"
                >
                  {showConfirmPassword ? (
                    <>
                      <EyeOffIcon className="h-4 w-4 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Show
                    </>
                  )}
                </button>
              </div>
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm your password"
                className={`bg-gray-50 ${showErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('confirmPassword')}
                required
              />
              {showErrors.confirmPassword && (
                <p className="text-xs text-red-500">Passwords must match</p>
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
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.agreeToTerms}
                onCheckedChange={handleCheckboxChange}
                required
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
              disabled={!isFormValid()}
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-red-600 hover:underline">
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
          onClose={() => setShowVerificationModal(false)}
          onVerify={handleVerifyEmail}
          onResendOtp={handleResendOtp}
          onChangeEmail={handleChangeEmail}
        />
      )}
    </div>
  );
}