"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Shield, Lock } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToastContext } from "@/app/components/ToastProvider";

interface TransactionPinModalProps {
  open: boolean;
  onCloseAction: () => void;
  onSuccessAction?: () => void;
}

export default function TransactionPinModal({
  open,
  onCloseAction,
  onSuccessAction
}: TransactionPinModalProps) {
  const { setupTransactionPin } = useUserProfile();
  const { error } = useToastContext();
  
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinTouched, setPinTouched] = useState(false);
  const [confirmPinTouched, setConfirmPinTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validatePin = (pinValue: string) => {
    const errors: string[] = [];
    
    if (!pinValue) {
      errors.push("PIN is required");
    } else if (!/^\d+$/.test(pinValue)) {
      errors.push("PIN must contain only numbers");
    } else if (pinValue.length < 4 || pinValue.length > 6) {
      errors.push("PIN must be between 4 and 6 digits");
    }
    
    return errors;
  };

  const validateConfirmPin = (confirmPinValue: string) => {
    const errors: string[] = [];
    
    if (!confirmPinValue) {
      errors.push("PIN confirmation is required");
    } else if (confirmPinValue !== pin) {
      errors.push("PINs do not match");
    }
    
    return errors;
  };

  const pinErrors = pinTouched ? validatePin(pin) : [];
  const confirmPinErrors = confirmPinTouched ? validateConfirmPin(confirmPin) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setPinTouched(true);
    setConfirmPinTouched(true);

    // Validate both fields
    const pinValidationErrors = validatePin(pin);
    const confirmPinValidationErrors = validateConfirmPin(confirmPin);
    
    if (pinValidationErrors.length > 0 || confirmPinValidationErrors.length > 0) {
      error("Validation Error", "Please fix the validation errors");
      return;
    }

    setIsLoading(true);
    
    try {
      // The useUserProfile hook handles success/error toasts
      const success = await setupTransactionPin(pin, confirmPin);
      
      if (success) {
        // Clear form and close modal
        setPin("");
        setConfirmPin("");
        setPinTouched(false);
        setConfirmPinTouched(false);
        onCloseAction();
        
        // Call success callback if provided
        if (onSuccessAction) {
          onSuccessAction();
        }
      }
    } catch (err: any) {
      console.error("Setup transaction PIN error:", err);
      // Error is already handled by useUserProfile hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      // Clear form when closing
      setPin("");
      setConfirmPin("");
      setPinTouched(false);
      setConfirmPinTouched(false);
      onCloseAction();
    }
  };

  // Handle PIN input to only allow numbers and limit length
  const handlePinChange = (value: string, setter: (value: string) => void) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setter(numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-semibold">
              Set Up Transaction PIN
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            Create a secure PIN to authorize your transactions. This PIN will be required for withdrawals and other financial operations.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* PIN Input */}
          <div>
            <Label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
              Transaction PIN
            </Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => handlePinChange(e.target.value, setPin)}
                onBlur={() => setPinTouched(true)}
                className={`pr-10 ${pinErrors.length > 0 ? "border-red-500" : ""}`}
                placeholder="Enter 4-6 digit PIN"
                disabled={isLoading}
                maxLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPin(!showPin)}
                disabled={isLoading}
              >
                {showPin ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {pinErrors.length > 0 && (
              <div className="mt-1">
                {pinErrors.map((error, index) => (
                  <p key={index} className="text-xs text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Confirm PIN Input */}
          <div>
            <Label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Transaction PIN
            </Label>
            <div className="relative">
              <Input
                id="confirmPin"
                type={showConfirmPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => handlePinChange(e.target.value, setConfirmPin)}
                onBlur={() => setConfirmPinTouched(true)}
                className={`pr-10 ${confirmPinErrors.length > 0 ? "border-red-500" : ""}`}
                placeholder="Confirm your PIN"
                disabled={isLoading}
                maxLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                disabled={isLoading}
              >
                {showConfirmPin ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {confirmPinErrors.length > 0 && (
              <div className="mt-1">
                {confirmPinErrors.map((error, index) => (
                  <p key={index} className="text-xs text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* PIN Requirements */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm font-medium text-gray-700">PIN Requirements:</h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Must be between 4 and 6 digits</li>
              <li>• Must contain only numbers</li>
              <li>• Both PIN entries must match</li>
              <li>• Choose a PIN that's easy to remember but hard to guess</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || pinErrors.length > 0 || confirmPinErrors.length > 0}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Setting Up..." : "Set Up PIN"}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
