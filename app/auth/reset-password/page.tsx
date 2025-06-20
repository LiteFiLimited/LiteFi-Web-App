"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import ResetPasswordVerificationModal from "@/app/components/ResetPasswordVerificationModal";

import logoImage from "@/public/assets/images/logo.png";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show verification modal
    setShowVerificationModal(true);
  };

  const handleVerifyOtp = (otp: string) => {
    console.log("Verifying OTP:", otp);
    // Close modal and redirect to create new password page
    setShowVerificationModal(false);
    router.push("/create-new-password");
  };

  const handleResendOtp = () => {
    console.log("Resending OTP to:", email);
  };

  const handleChangeEmail = () => {
    setShowVerificationModal(false);
  };

  const isEmailValid = email.includes("@") && email.includes(".");

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
                className="bg-gray-50 h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12 mt-6"
              disabled={!isEmailValid}
            >
              Reset Password
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
        />
      )}
    </div>
  );
} 