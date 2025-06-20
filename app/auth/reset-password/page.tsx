"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import ResetPasswordVerificationModal from "@/app/components/ResetPasswordVerificationModal";
import { useToastContext } from "@/app/components/ToastProvider";
import { authApi } from "@/lib/api";

import logoImage from "@/public/assets/images/logo.png";

// More comprehensive email validation regex
const EMAIL_REGEX = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const router = useRouter();
  const { success, error } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      setEmailTouched(true);
      return;
    }

    setIsLoading(true);
    try {
      // Request password reset
      const response = await authApi.requestPasswordReset({ email });
      
      // Store email for the verification step
      sessionStorage.setItem('resetPasswordEmail', email);
      
      // Show success message and verification modal
      success("Reset email sent", "Please check your email for the verification code");
      setShowVerificationModal(true);
    } catch (err: any) {
      // Extract error message
      let errorMessage = "An unexpected error occurred";
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      error("Reset password failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      // Store OTP for create new password page
      sessionStorage.setItem('resetPasswordOtp', otp);
      
      // Close modal and redirect to create new password page
      setShowVerificationModal(false);
      router.push(`/auth/create-new-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      let errorMessage = err?.message || "Failed to verify OTP";
      error("Verification failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      // Request new password reset
      await authApi.requestPasswordReset({ email });
      success("OTP Resent", "A new verification code has been sent to your email");
    } catch (err: any) {
      let errorMessage = err?.message || "Failed to resend OTP";
      error("Resend failed", errorMessage);
    }
  };

  const handleChangeEmail = () => {
    setShowVerificationModal(false);
  };

  const isEmailValid = EMAIL_REGEX.test(email);
  const showEmailError = emailTouched && !isEmailValid;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image 
            src={logoImage} 
            alt="LiteFi Logo" 
            width={100}
            height={30}
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
          <p className="text-gray-500">Provide the following details to reset your password</p>
        </div>

        <div className="bg-white p-8 shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className={`bg-gray-50 h-12 ${showEmailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                required
                disabled={isLoading}
              />
              {showEmailError && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12 mt-6"
              disabled={!isEmailValid || isLoading}
            >
              {isLoading ? "Sending Reset Email..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>

      {/* Reset Password Verification Modal */}
      {showVerificationModal && (
        <ResetPasswordVerificationModal
          email={email}
          onClose={() => setShowVerificationModal(false)}
          onVerify={handleVerifyOtp}
          onResendOtp={handleResendOtp}
          onChangeEmail={handleChangeEmail}
          isLoading={isLoading}
        />
      )}
    </div>
  );
} 