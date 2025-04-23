"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { PhoneInput } from "@/app/components/ui/phone-input";
import { Label } from "@/app/components/ui/label";

import logoImage from "@/public/assets/images/logo.png";

interface PhoneVerificationFormProps {
  onComplete: () => void;
}

export default function PhoneVerificationForm({ onComplete }: PhoneVerificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP sending here
    console.log("Sending OTP to:", phoneNumber);
    // Go to next step or show OTP verification
    onComplete();
  };

  const isPhoneValid = phoneNumber && phoneNumber.length > 8;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image 
            src={logoImage} 
            alt="LiteFi Logo" 
            width={100}
            height={30}
            style={{ width: 'auto', height: 'auto' }}
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
            <div className="flex flex-col items-center opacity-50">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center mb-2">
                2
              </div>
              <span className="text-sm font-medium">Create Password</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-6">Your phone number</h2>
          
          <form onSubmit={handleSubmit}>
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
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12 mt-6"
              disabled={!isPhoneValid}
            >
              Send OTP
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 