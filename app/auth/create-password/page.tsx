"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import logoImage from "@/public/assets/images/logo.png";

export default function CreatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      // Navigate to dashboard or home page after password creation
      router.push("/dashboard");
    }
  };

  const isPasswordValid = password.length >= 8 && password === confirmPassword;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center mb-2">
                1
              </div>
              <span className="text-sm font-medium opacity-50">Verify Phone</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center mb-2">
                2
              </div>
              <span className="text-sm font-medium">Create Password</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-6">Create password</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 flex items-center text-sm"
                  >
                    {showPassword ? (
                      <>
                        <EyeOffIcon className="h-4 w-4 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Show
                      </>
                    )}
                  </button>
                </div>
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a password"
                  className="bg-gray-50 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 flex items-center text-sm"
                  >
                    {showConfirmPassword ? (
                      <>
                        <EyeOffIcon className="h-4 w-4 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Show
                      </>
                    )}
                  </button>
                </div>
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm your password"
                  className="bg-gray-50 h-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12 mt-6"
              disabled={!isPasswordValid}
            >
              Complete Registration
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 