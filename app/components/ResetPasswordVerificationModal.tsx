"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Mail } from "lucide-react";

import mailAnimation from "@/public/assets/gif/mail.gif";

interface ResetPasswordVerificationModalProps {
  email: string;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResendOtp: () => void;
  onChangeEmail: () => void;
  isLoading?: boolean;
}

export default function ResetPasswordVerificationModal({
  email,
  onClose,
  onVerify,
  onResendOtp,
  onChangeEmail,
  isLoading = false,
}: ResetPasswordVerificationModalProps) {
  const [otp, setOtp] = React.useState("");
  const [resendCountdown, setResendCountdown] = React.useState(0);

  // Start countdown when component mounts (initial OTP sent)
  React.useEffect(() => {
    setResendCountdown(60);
  }, []);

  // Countdown timer effect
  React.useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const handleResendOtp = () => {
    onResendOtp();
    setResendCountdown(60); // Reset countdown after resend
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="bg-white w-full max-w-md p-8 z-10 relative mx-4 rounded-none">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Enter OTP to reset your password
        </h2>
        
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-orange-500 p-4 flex items-center justify-center">
            <Image 
              src={mailAnimation} 
              alt="Email verification" 
              width={30} 
              height={30} 
              className="w-7 h-7 object-contain"
            />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-gray-600">Verification email sent to</p>
          <p className="font-medium">{email}</p>
        </div>
        
        <p className="text-gray-500 text-sm text-center mb-6">
          If you can't find the email, please check your spam folder.
        </p>
        
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <Input 
              id="otp" 
              value={otp} 
              onChange={handleOtpChange}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter 6-digit OTP" 
              className="bg-gray-50 h-12 text-center text-lg tracking-wider" 
              required
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 h-12 mt-4"
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        
        <div className="flex justify-between mt-6 text-sm">
          <div>
            <span className="text-gray-500">Resend OTP? </span>
            {resendCountdown > 0 ? (
              <span className="text-gray-400">
                Resend in {resendCountdown}s
              </span>
            ) : (
              <button 
                onClick={handleResendOtp} 
                className="text-red-600 hover:underline font-medium"
                disabled={isLoading}
              >
                Resend OTP
              </button>
            )}
          </div>
          
          <div>
            <span className="text-gray-500">Wrong e-mail? </span>
            <button 
              onClick={onChangeEmail} 
              className="text-red-600 hover:underline font-medium"
              disabled={isLoading}
            >
              Change email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 