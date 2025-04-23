"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

// Import images directly
import heroImage from "@/public/assets/images/image.png";
import logoImage from "@/public/assets/images/logo.png";

export default function SignUp() {
  return (
    <div className="bg-background min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-3/5">
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
      <div className="w-full md:w-2/5 flex justify-center items-start">
        <div className="bg-white w-full max-h-[calc(100vh-2rem)] overflow-y-auto px-8 pt-10 m-4 rounded-lg">
          <div className="flex justify-start mb-6">
            <Image 
              src={logoImage} 
              alt="LiteFi Logo" 
              width={80}
              height={24}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          <h1 className="text-2xl font-bold mb-2 text-start">Create an account</h1>
          <p className="text-gray-500 text-sm mb-6 text-start">Create an account to access easy loans and smart investments</p>

          <form className="space-y-5 pb-8">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter your first name" className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter your last name" className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral code (Optional)</Label>
              <Input id="referralCode" placeholder="Enter referral code" className="bg-gray-50" />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" />
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

            <Button className="w-full bg-red-600 hover:bg-red-700">Create Account</Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-red-600 hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 