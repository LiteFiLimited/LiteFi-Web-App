"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useToastContext } from "@/app/components/ToastProvider";
import { authApi } from "@/lib/api";
import { validatePassword } from "@/lib/passwordValidator";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";

import logoImage from "@/public/assets/images/logo.png";

function CreatePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToastContext();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Get email from URL params or session storage
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const sessionEmail = sessionStorage.getItem("registrationEmail");
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (sessionEmail) {
      setEmail(sessionEmail);
    } else {
      // If no email found, redirect to sign-up
      error("Session expired", "Please start the registration process again");
      router.push("/auth/sign-up");
    }
  }, [searchParams, router, error]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Validate password in real-time
    const validation = validatePassword(newPassword);
    setPasswordErrors(validation.errors);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    
    if (!email) {
      error("Missing email", "Please start the registration process again");
      router.push("/auth/sign-up");
      return;
    }

    if (isPasswordValid && doPasswordsMatch) {
      setIsLoading(true);
      try {
        const response = await authApi.createPassword({
          email: email,
          password: password
        });

        // Check for the actual backend response structure
        // Backend returns: {message, user, accessToken, refreshToken}
        if (response.user && response.accessToken) {
          // Store the authentication tokens
          const { setAuthToken } = await import('@/lib/auth');
          setAuthToken(response.accessToken, response.user.id);
          
          success("Account created successfully!", "Welcome to LiteFi");
          
          // Clear registration data
          sessionStorage.removeItem("registrationEmail");
          
          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        } else {
          error("Password creation failed", response.message || "Please try again");
        }
      } catch (err) {
        console.error("Password creation error:", err);
        error("Password creation failed", "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!isPasswordValid) {
        error("Invalid password", "Please ensure your password meets all requirements");
      } else if (!doPasswordsMatch) {
        error("Passwords don't match", "Please make sure both passwords are identical");
      }
    }
  };

  // Validation
  const validation = validatePassword(password);
  const isPasswordValid = validation.isValid;
  const doPasswordsMatch = password === confirmPassword && confirmPassword !== "";
  const isFormValid = isPasswordValid && doPasswordsMatch;

  const showPasswordError = passwordTouched && !isPasswordValid;
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
          <h1 className="text-3xl font-bold mb-2">You are almost there</h1>
          <p className="text-gray-500">Create a secure password to complete your account setup</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-12">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mb-2">
                ✓
              </div>
              <span className="text-sm font-medium">Verify Phone</span>
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
          <h2 className="text-xl font-bold mb-6">Create a password</h2>
          
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
                placeholder="Create a secure password" 
                className={`bg-gray-50 h-12 ${showPasswordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                required
                disabled={isLoading}
              />
              
              {/* Password strength meter */}
              {password && <PasswordStrengthMeter password={password} />}
              
              {/* Password requirements */}
              {passwordTouched && passwordErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((error, index) => (
                    <p key={index} className="text-xs text-red-500">{error}</p>
                  ))}
                </div>
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
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12 mt-6"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
            </Button>
          </form>
        </div>

        {email && (
          <div className="text-center text-sm text-gray-500">
            Creating account for: <strong>{email}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <CreatePasswordContent />
    </Suspense>
  );
} 