"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useToastContext } from "@/app/components/ToastProvider";
import { authApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useRedirectIfAuthenticated } from "@/lib/auth";

// Import images directly
import heroImage from "@/public/assets/images/image.png";
import logoImage from "@/public/assets/images/logo.png";

function LoginContent() {
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

        console.log("Login response:", response);

        // Check for the actual backend response structure
        // Backend returns: {message, user, accessToken, refreshToken}
        // Not: {success: true, data: {user, token}}
        if (response.user && response.accessToken) {
          // Store the token and user ID using the new auth function
          const { setAuthToken, handleAuthSuccess } = await import('@/lib/auth');
          setAuthToken(response.accessToken, response.user.id);
          
          // Store user data in local storage
          localStorage.setItem('userData', JSON.stringify(response.user));
          
          success("Login successful!", "Welcome back to LiteFi");
          
          // Redirect to the original path or dashboard
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 1500);
        } else {
          // Check if this is an incomplete registration flow
          if (response.message?.toLowerCase().includes('password not set') || 
              response.message?.toLowerCase().includes('complete registration') ||
              response.message?.toLowerCase().includes('create password')) {
            error("Registration incomplete", "Please complete your registration by setting a password");
            
            // Store email for password creation flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Redirect to password creation after a short delay
            setTimeout(() => {
              window.location.href = `/auth/create-password?email=${encodeURIComponent(email)}`;
            }, 2000);
          } else if (response.message?.toLowerCase().includes('verify') && 
                     response.message?.toLowerCase().includes('email')) {
            error("Email verification required", "Please verify your email to continue");
            
            // Store email for email verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Redirect to sign-up for email verification
            setTimeout(() => {
              window.location.href = `/auth/sign-up`;
            }, 2000);
          } else if (response.message?.toLowerCase().includes('verify') && 
                     (response.message?.toLowerCase().includes('phone') || 
                      response.message?.toLowerCase().includes('otp'))) {
            error("Phone verification required", "Please verify your phone number to continue");
            
            // Store email for phone verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Redirect to phone verification
            setTimeout(() => {
              window.location.href = `/auth/verify-phone`;
            }, 2000);
          } else if (response.message?.toLowerCase().includes('verify') && 
                     (response.message?.toLowerCase().includes('email') || 
                      response.message?.toLowerCase().includes('mail'))) {
            error("Email verification required", "Please verify your email to continue");
            
            // Store email for email verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Redirect to sign-up for email verification
            setTimeout(() => {
              window.location.href = `/auth/sign-up`;
            }, 2000);
          } else if (response.message?.toLowerCase().includes('otp') && 
                     (response.message?.toLowerCase().includes('phone') || 
                      response.message?.toLowerCase().includes('sms'))) {
            error("Phone verification required", "Please verify your phone number with OTP to continue");
            
            // Store email for phone verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Redirect to phone verification
            setTimeout(() => {
              window.location.href = `/auth/verify-phone`;
            }, 2000);
          } else if (response.message?.toLowerCase().includes('otp') && 
                     (response.message?.toLowerCase().includes('email') || 
                      response.message?.toLowerCase().includes('mail'))) {
            error("Email verification required", "Please verify your email with OTP to continue");
            
            // Store email for email verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Redirect to sign-up for email verification
            setTimeout(() => {
              window.location.href = `/auth/sign-up`;
            }, 2000);
          } else {
            error("Login failed", response.message || "Invalid email or password");
          }
        }
      } catch (err: any) {
        console.error("Login error:", err);
        
        // Extract the actual error message from the server response
        let errorMessage = "An unexpected error occurred";
        
        // Handle the different error response structures from the backend
        if (err?.response?.status === 401) {
          // Unauthorized - invalid credentials
          errorMessage = err?.response?.data?.message || "Invalid email or password";
        } else if (err?.response?.status === 400) {
          // Bad request - validation errors or account issues
          errorMessage = err?.response?.data?.message || "Please check your credentials";
        } else if (err?.response?.status === 404) {
          // User not found
          errorMessage = "Account not found. Please check your email or sign up for a new account";
        } else if (err?.response?.status === 409) {
          // Account exists but needs completion (email verification, etc.)
          errorMessage = err?.response?.data?.message || "Please complete your account setup";
        } else if (err?.response?.data?.message) {
          // Any other backend error with a message
          errorMessage = err.response.data.message;
        } else if (err?.message && typeof err.message === 'string') {
          // Direct error message
          errorMessage = err.message;
        } else if (err?.error && typeof err.error === 'string') {
          // Error property
          errorMessage = err.error;
        } else if (typeof err === 'string') {
          // Error as string
          errorMessage = err;
        } else if (err?.response?.status >= 500) {
          // Server errors
          errorMessage = "Server is currently unavailable. Please try again later";
        } else if (err?.code === 'NETWORK_ERROR' || !err?.response) {
          // Network errors
          errorMessage = "Unable to connect to server. Please check your internet connection";
        }
        
        console.log("Extracted error message:", errorMessage);
        
        // Handle incomplete registration scenarios in catch block
        if (errorMessage.toLowerCase().includes('verify') && 
            (errorMessage.toLowerCase().includes('phone') || 
             errorMessage.toLowerCase().includes('otp'))) {
          error("Phone verification required", "Please verify your phone number to continue");
          
          // Store email for phone verification flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Redirect to phone verification
          setTimeout(() => {
            window.location.href = `/auth/verify-phone`;
          }, 2000);
        } else if (errorMessage.toLowerCase().includes('verify') && 
                   (errorMessage.toLowerCase().includes('email') || 
                    errorMessage.toLowerCase().includes('mail'))) {
          error("Email verification required", "Please verify your email to continue");
          
          // Store email for email verification flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Redirect to sign-up for email verification
          setTimeout(() => {
            window.location.href = `/auth/sign-up`;
          }, 2000);
        } else if (errorMessage.toLowerCase().includes('otp') && 
                   (errorMessage.toLowerCase().includes('phone') || 
                    errorMessage.toLowerCase().includes('sms'))) {
          error("Phone verification required", "Please verify your phone number with OTP to continue");
          
          // Store email for phone verification flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Redirect to phone verification
          setTimeout(() => {
            window.location.href = `/auth/verify-phone`;
          }, 2000);
        } else if (errorMessage.toLowerCase().includes('otp') && 
                   (errorMessage.toLowerCase().includes('email') || 
                    errorMessage.toLowerCase().includes('mail'))) {
          error("Email verification required", "Please verify your email with OTP to continue");
          
          // Store email for email verification flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Redirect to sign-up for email verification
          setTimeout(() => {
            window.location.href = `/auth/sign-up`;
          }, 2000);
        } else if (errorMessage.toLowerCase().includes('password not set') || 
                   errorMessage.toLowerCase().includes('complete registration') ||
                   errorMessage.toLowerCase().includes('create password')) {
          error("Registration incomplete", "Please complete your registration by setting a password");
          
          // Store email for password creation flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Redirect to password creation after a short delay
          setTimeout(() => {
            window.location.href = `/auth/create-password?email=${encodeURIComponent(email)}`;
          }, 2000);
        } else {
          error("Login failed", errorMessage);
        }
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

export default function Login() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}