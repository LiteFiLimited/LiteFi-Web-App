"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import PhoneVerificationModal from "@/app/components/PhoneVerificationModal";
import { useToastContext } from "@/app/components/ToastProvider";
import { authApi } from "@/lib/api";
import { getPhoneNumberInfo } from "@/lib/phoneValidator";

import logoImage from "@/public/assets/images/logo.png";

interface PhoneVerificationFormProps {
  onCompleteAction: () => void;
}

export default function PhoneVerificationForm({ onCompleteAction }: PhoneVerificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { success, error, info } = useToastContext();

  // Handle stored email from login redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('registrationEmail');
      if (storedEmail) {
        console.log('Phone verification: found stored email from login redirect:', storedEmail);
        // Keep the email for context but don't clear it yet
        // It will be cleared when the user completes the entire flow
      }
    }
  }, []);

  // Helper function to complete verification and clean up stored email
  const completeVerification = () => {
    // Clear stored email from login redirect
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('registrationEmail');
    }
    onCompleteAction();
  };

  const handleSubmitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      error("Phone number required", "Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    
    try {
      // All phone numbers are now saved in international format automatically
      const response = await authApi.sendPhoneOtp({
        phone: phoneNumber
      });

      console.log("Send phone OTP response:", response);

      if (response.success || (response.data && response.data.verified)) {
        // All numbers are now automatically verified and saved in international format
        success("Phone number saved!", "Your phone number has been saved and verified automatically");
        
        // Log the successful verification
        console.log("Phone verified automatically:", phoneNumber);
        
        // Complete the verification process
        setTimeout(() => {
          completeVerification();
        }, 1000);
      } else {
        // Check if this is an "already verified" response
        const isAlreadyVerified = response.message?.toLowerCase().includes('already verified');
        
        if (isAlreadyVerified) {
          info("Phone already verified", "Your phone number is already verified. Proceeding to next step...");
          // Complete the verification process
          setTimeout(() => {
            completeVerification();
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
              
              {/* Phone number info - simplified for all numbers */}
              {phoneInfo && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Format:</strong> {phoneInfo.country}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    All phone numbers are automatically saved in international format.
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12 mt-6"
              disabled={!isPhoneValid || isLoading}
            >
              {isLoading ? "Processing..." : "Save Phone Number"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
