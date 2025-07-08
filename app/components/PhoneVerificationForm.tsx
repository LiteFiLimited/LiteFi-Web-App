"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import PhoneVerificationModal from "@/app/components/PhoneVerificationModal";
import { useToastContext } from "@/app/components/ToastProvider";
import { authApi } from "@/lib/api";
import { isNigerianNumber, getPhoneNumberInfo } from "@/lib/phoneValidator";

import logoImage from "@/public/assets/images/logo.png";

interface PhoneVerificationFormProps {
  onCompleteAction: () => void;
}

export default function PhoneVerificationForm({ onCompleteAction }: PhoneVerificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { success, error, info } = useToastContext();

  const handleSubmitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      error("Phone number required", "Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the send-phone-otp endpoint first
      const response = await authApi.sendPhoneOtp({
        phone: phoneNumber
      });

      console.log("Send phone OTP response:", response);

      if (response.success || (response.data && response.data.verified)) {
        if (response.data?.requiresOtp) {
          // Nigerian number - show verification modal for OTP
          setVerificationId(response.data.verificationId || "");
          info("OTP Sent", "We've sent a verification code to your phone number");
          setShowVerificationModal(true);
        } else {
          // International number - automatically verified
          success("Phone number saved!", "International numbers are verified automatically");
          
          // Log the successful verification
          console.log("Phone verified automatically:", phoneNumber);
          
          // Complete the verification process
          setTimeout(() => {
            onCompleteAction();
          }, 1000);
        }
      } else {
        // Check if this is an "already verified" response
        const isAlreadyVerified = response.message?.toLowerCase().includes('already verified');
        
        if (isAlreadyVerified) {
          info("Phone already verified", "Your phone number is already verified. Proceeding to next step...");
          // Complete the verification process
          setTimeout(() => {
            onCompleteAction();
          }, 1500);
        } else {
          error("Verification failed", response.message || "Please try again");
        }
      }
    } catch (err) {
      error("Verification failed", "An unexpected error occurred");
      console.error("Phone verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!verificationId) {
      error("Verification failed", "Missing verification ID. Please try again.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authApi.verifyPhoneOtp({
        phone: phoneNumber,
        verificationId: verificationId,
        otp: otp
      });

      console.log("Phone OTP verification response:", response);

      if (response.success) {
        success("Phone verified successfully!", "Your phone number has been verified");
        setShowVerificationModal(false);
        // Complete the verification process
        onCompleteAction();
      } else {
        // Check if this is an "already verified" response
        const isAlreadyVerified = response.message?.toLowerCase().includes('already verified');
        
        if (isAlreadyVerified) {
          info("Phone already verified", "Your phone number is already verified. Proceeding to next step...");
          setShowVerificationModal(false);
          // Complete the verification process
          setTimeout(() => {
            onCompleteAction();
          }, 1500);
        } else {
          error("Verification failed", response.message || "Invalid verification code");
        }
      }
    } catch (err) {
      error("Verification failed", "An unexpected error occurred");
      console.error("Phone OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      // Use the resend phone OTP endpoint
      const response = await authApi.resendPhoneOtp({
        phone: phoneNumber
      });
      
      console.log("Resend phone OTP response:", response);
      
      if (response.success && response.data) {
        // Update verification ID from the resend response
        if (response.data.verificationId) {
          setVerificationId(response.data.verificationId);
        }
        info("OTP sent", "A new verification code has been sent to your phone");
      } else {
        // Check if this is an "already verified" response
        const isAlreadyVerified = response.message?.toLowerCase().includes('already verified');
        
        if (isAlreadyVerified) {
          info("Phone already verified", "Your phone number is already verified. Proceeding to next step...");
          setShowVerificationModal(false);
          // Complete the verification process
          setTimeout(() => {
            onCompleteAction();
          }, 1500);
        } else {
          error("Failed to resend OTP", response.message || "Please try again");
        }
      }
    } catch (err) {
      error("Failed to resend OTP", "An unexpected error occurred");
      console.error("Resend phone OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePhone = () => {
    setShowVerificationModal(false);
    setVerificationId("");
  };

  const isPhoneValid = phoneNumber && phoneNumber.length > 8;
  const phoneInfo = phoneNumber ? getPhoneNumberInfo(phoneNumber) : null;

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
          <h1 className="text-3xl font-bold mb-2">You are almost there</h1>
          <p className="text-gray-500">Provide the following details to complete your profile</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-12">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center mb-2">
                1
              </div>
              <span className="text-sm font-medium">Verify Phone</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center mb-2">
                2
              </div>
              <span className="text-sm font-medium opacity-50">Complete Setup</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-6">Your phone number</h2>
          
          <form onSubmit={handleSubmitPhone}>
            <div className="mb-4">
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone number
              </Label>
              <PhoneInput
                defaultCountry="NG"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value ? value.toString() : "")}
                international
                className="w-full"
                disabled={isLoading}
              />
              
              {/* Phone number info - only show country */}
              {phoneInfo && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Country:</strong> {phoneInfo.country}
                  </p>
                  {!phoneInfo.requiresVerification && (
                    <p className="text-xs text-blue-600 mt-1">
                      International numbers are automatically saved and verified manually by our team.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12 mt-6"
              disabled={!isPhoneValid || isLoading}
            >
              {isLoading ? "Processing..." : phoneInfo?.requiresVerification ? "Send OTP" : "Save Phone Number"}
            </Button>
          </form>
        </div>
      </div>

      {/* Phone Verification Modal */}
      {showVerificationModal && (
        <PhoneVerificationModal
          phoneNumber={phoneNumber}
          onCloseAction={() => setShowVerificationModal(false)}
          onVerifyAction={handleVerifyOtp}
          onResendOtpAction={handleResendOtp}
          onChangePhoneAction={handleChangePhone}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
