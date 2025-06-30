"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import mailAnimation from "@/public/assets/gif/mail.gif";

interface PhoneVerificationModalProps {
  phoneNumber: string;
  onCloseAction: () => void;
  onVerifyAction: (otp: string) => void;
  onResendOtpAction: () => void;
  onChangePhoneAction: () => void;
  isLoading?: boolean;
}

export default function PhoneVerificationModal({
  phoneNumber,
  onCloseAction,
  onVerifyAction,
  onResendOtpAction,
  onChangePhoneAction,
  isLoading = false,
}: PhoneVerificationModalProps) {
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
    onVerifyAction(otp);
  };

  const handleResendOtp = () => {
    onResendOtpAction();
    setResendCountdown(60); // Reset countdown after resend
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCloseAction} />
      
      {/* Modal */}
      <div className="bg-white w-full max-w-md p-8 z-10 relative mx-4 rounded-none">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Verify your phone number
        </h2>
        
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-orange-500 p-4 flex items-center justify-center">
            <Image 
              src={mailAnimation} 
              alt="Phone verification" 
              width={30} 
              height={30} 
              className="w-7 h-7 object-contain"
            />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-gray-600">Verification OTP sent to</p>
          <p className="font-medium">{phoneNumber}</p>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <Input 
              id="otp" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP" 
              className="bg-gray-50 h-12" 
              required
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 h-12 mt-4"
            disabled={!otp || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Phone"}
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
            <span className="text-gray-500">Wrong phone? </span>
            <button 
              onClick={onChangePhoneAction} 
              className="text-red-600 hover:underline font-medium"
              disabled={isLoading}
            >
              Change phone number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 