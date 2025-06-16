"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useToastContext } from "@/app/components/ToastProvider";
import { authApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useRedirectIfAuthenticated } from "@/lib/auth";

// Import images directly
import heroImage from "@/public/assets/images/image.png";
import logoImage from "@/public/assets/images/logo.png";

export default function Login() {
  const { success, error } = useToastContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Redirect if already authenticated
  useRedirectIfAuthenticated();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/dashboard");

  // Get the redirect path from URL parameters if available
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      try {
        const response = await authApi.login({
          email,
          password
        });

        if (response.success && response.data) {
          // Store the token and user ID using the new auth function
          const { setAuthToken, handleAuthSuccess } = await import('@/lib/auth');
          setAuthToken(response.data.token, response.data.user.id);
          
          success("Login successful!", "Welcome back to LiteFi");
          
          // Redirect to the original path or dashboard
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 1500);
        } else {
          error("Login failed", response.message || "Invalid email or password");
        }
      } catch (err) {
        error("Login failed", "An unexpected error occurred");
        console.error("Login error:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setEmailTouched(true);
      setPasswordTouched(true);
      error("Login failed", "Please check your email and password");
    }
  };

  // Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

  const showEmailError = emailTouched && !isEmailValid;
  const showPasswordError = passwordTouched && !isPasswordValid;

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-[55%]">
        <div className="h-screen w-full p-4">
          <Image
            src={heroImage}
            alt="Login hero"
            className="object-fill h-full w-full rounded-lg"
            style={{ width: '100%', height: '100%' }}
            priority
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-[45%] flex justify-center items-start">
        <div className="bg-white w-full max-h-[calc(100vh-2rem)] overflow-y-auto px-8 pt-10 m-4">
          <div className="flex justify-start mb-6">
            <Image 
              src={logoImage} 
              alt="LiteFi Logo" 
              width={80}
              height={24}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          <h1 className="text-2xl font-bold mb-2 text-start">Log into your account</h1>
          <p className="text-gray-500 text-sm mb-6 text-start">Provide the details below to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5 pb-8">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className={`bg-gray-50 ${showEmailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                required 
                disabled={isLoading}
              />
              {showEmailError && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 flex items-center text-sm"
                  disabled={isLoading}
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
                placeholder="Enter your password"
                className={`bg-gray-50 ${showPasswordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                required
                disabled={isLoading}
              />
              {showPasswordError && (
                <p className="text-xs text-red-500">Password must be at least 8 characters</p>
              )}
            </div>

            <div className="flex justify-end">
              <Link href="/auth/reset-password" className="text-red-600 text-sm hover:underline">
                Reset Password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={((!isFormValid && (emailTouched || passwordTouched)) || isLoading)}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-red-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}