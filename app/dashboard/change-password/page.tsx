"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, ArrowLeft } from "lucide-react";
import { useToastContext } from "@/app/components/ToastProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { validatePassword, PasswordValidationResult } from "@/lib/passwordValidator";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";

import logoImage from "@/public/assets/images/logo.png";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { success, error } = useToastContext();
  const { changePassword } = useUserProfile();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordTouched, setCurrentPasswordTouched] = useState(false);
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    
    if (newPasswordTouched) {
      const validation = validatePassword(password);
      setPasswordErrors(validation.errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setCurrentPasswordTouched(true);
    setNewPasswordTouched(true);
    setConfirmPasswordTouched(true);

    // Validate current password
    if (!currentPassword.trim()) {
      error("Validation Error", "Current password is required");
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation.errors.length > 0) {
      setPasswordErrors(passwordValidation.errors);
      error("Validation Error", "Please fix the password requirements");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      error("Validation Error", "New passwords do not match");
      return;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      error("Validation Error", "New password must be different from current password");
      return;
    }

    setIsLoading(true);
    
    try {
      // The useUserProfile hook handles success/error toasts
      const success = await changePassword(currentPassword, newPassword, confirmPassword);
      
      if (success) {
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordErrors([]);
        
        // Navigate back to profile
        router.push("/dashboard/profile");
      }
    } catch (err: any) {
      console.error("Change password error:", err);
      // Error is already handled by useUserProfile hook
    } finally {
      setIsLoading(false);
    }
  };

  const currentPasswordError = currentPasswordTouched && !currentPassword.trim();
  const newPasswordError = newPasswordTouched && passwordErrors.length > 0;
  const confirmPasswordError = confirmPasswordTouched && newPassword !== confirmPassword;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src={logoImage} alt="LiteFi Logo" width={120} height={40} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Change Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Update your password to keep your account secure
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Back button */}
          <div className="mb-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 p-0 h-auto text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <Label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onBlur={() => setCurrentPasswordTouched(true)}
                  className={`pr-10 ${currentPasswordError ? "border-red-500" : ""}`}
                  placeholder="Enter your current password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {currentPasswordError && (
                <p className="mt-1 text-xs text-red-600">Current password is required</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  onBlur={() => setNewPasswordTouched(true)}
                  className={`pr-10 ${newPasswordError ? "border-red-500" : ""}`}
                  placeholder="Enter your new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password strength meter */}
              {newPassword && (
                <div className="mt-2">
                  <PasswordStrengthMeter password={newPassword} />
                </div>
              )}
              
              {/* Password validation errors */}
              {newPasswordTouched && passwordErrors.length > 0 && (
                <div className="mt-1">
                  {passwordErrors.map((error, index) => (
                    <p key={index} className="text-xs text-red-600">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setConfirmPasswordTouched(true)}
                  className={`pr-10 ${confirmPasswordError ? "border-red-500" : ""}`}
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium"
              >
                {isLoading ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </form>

          {/* Password Requirements */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains at least one uppercase letter</li>
              <li>• Contains at least one lowercase letter</li>
              <li>• Contains at least one number</li>
              <li>• Contains at least one special character (@$!%*?&)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
