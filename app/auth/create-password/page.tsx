"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import logoImage from "@/public/assets/images/logo.png";

export default function CreatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    
    if (isPasswordValid) {
      // Navigate to dashboard or home page after password creation
      router.push("/dashboard");
    }
  };

  const isPasswordLongEnough = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword && confirmPassword !== "";
  const isPasswordValid = isPasswordLongEnough && doPasswordsMatch;

  const showPasswordError = passwordTouched && !isPasswordLongEnough;
  const showConfirmPasswordError = confirmPasswordTouched && !doPasswordsMatch && confirmPassword !== "";

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
          <h1 className="text-3xl font-bold mb-2">Create a password</h1>
          <p className="text-gray-500">Create a secure password to protect your account</p>
        </div>

        {showPasswordError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            <p className="text-sm">Password must be at least 8 characters</p>
          </div>
        )}

        <div className="bg-white p-8 shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password">Password</Label>
                <div 
                  className="flex items-center gap-1 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <>
                      <EyeOffIcon className="h-4 w-4" />
                      <span className="text-sm">Hide</span>
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-4 w-4" />
                      <span className="text-sm">Show</span>
                    </>
                  )}
                </div>
              </div>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Create a password" 
                className={`bg-gray-50 h-12 ${showPasswordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                required
                minLength={8}
              />
              <p className={`text-xs ${showPasswordError ? 'text-red-500' : 'text-gray-500'} mt-1`}>
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div 
                  className="flex items-center gap-1 text-gray-400 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <>
                      <EyeOffIcon className="h-4 w-4" />
                      <span className="text-sm">Hide</span>
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-4 w-4" />
                      <span className="text-sm">Show</span>
                    </>
                  )}
                </div>
              </div>
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm your password" 
                className={`bg-gray-50 h-12 ${showConfirmPasswordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmPasswordTouched(true)}
                required
              />
              {showConfirmPasswordError && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12 mt-6"
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 