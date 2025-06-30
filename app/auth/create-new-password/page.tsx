"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useToastContext } from "@/app/components/ToastProvider";
import { authApi } from "@/lib/api";

import logoImage from "@/public/assets/images/logo.png";

function PasswordResetForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { success, error } = useToastContext();

  useEffect(() => {
    // Check if we have the necessary data
    const resetPasswordEmail = sessionStorage.getItem('resetPasswordEmail');
    const resetPasswordOtp = sessionStorage.getItem('resetPasswordOtp');

    if (!resetPasswordEmail || !resetPasswordOtp) {
      error("Invalid reset attempt", "Please start the password reset process again");
      router.push('/auth/reset-password');
    }
  }, [router, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordValid) {
      setIsLoading(true);
      try {
        const resetPasswordOtp = sessionStorage.getItem('resetPasswordOtp');
        
        if (!resetPasswordOtp) {
          throw new Error("Reset code not found. Please try again.");
        }

        // Call the API to confirm password reset
        await authApi.confirmPasswordReset({
          email,
          code: resetPasswordOtp,
          newPassword: password
        });

        // Clear the stored reset data
        sessionStorage.removeItem('resetPasswordEmail');
        sessionStorage.removeItem('resetPasswordOtp');

        // Show success message
        success("Password reset successful", "You can now log in with your new password");

        // Redirect to login page
        setTimeout(() => {
          router.push(`/auth/login?email=${encodeURIComponent(email)}`);
        }, 1500);
      } catch (err: any) {
        // Extract error message
        let errorMessage = "An unexpected error occurred";
        if (err?.message) {
          errorMessage = err.message;
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        error("Password reset failed", errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      setPasswordTouched(true);
      setConfirmPasswordTouched(true);
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
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create new password</h1>
          <p className="text-gray-500">Create a new password for your account</p>
        </div>

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
                disabled={isLoading}
              />
              {showPasswordError ? (
                <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
              )}
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
                disabled={isLoading}
              />
              {showConfirmPasswordError && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            
            {passwordTouched && confirmPasswordTouched && !isPasswordValid && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
                <p className="text-sm">Please ensure your password is at least 8 characters and both passwords match</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12 mt-6"
              disabled={!isPasswordValid || isLoading}
            >
              {isLoading ? "Setting New Password..." : "Create New Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateNewPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PasswordResetForm />
    </Suspense>
  );
}
