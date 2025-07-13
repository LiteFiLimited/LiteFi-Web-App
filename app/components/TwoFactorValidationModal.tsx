"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle } from "lucide-react";
import { use2FA } from "@/hooks/use2FA";

interface TwoFactorValidationModalProps {
  open: boolean;
  onCloseAction: () => void;
  onSuccessAction: () => void;
  onCancelAction?: () => void;
  title?: string;
  description?: string;
}

export default function TwoFactorValidationModal({
  open,
  onCloseAction,
  onSuccessAction,
  onCancelAction,
  title = "Two-Factor Authentication",
  description = "Please enter your 6-digit authentication code to continue."
}: TwoFactorValidationModalProps) {
  const { validate2FA, isLoading } = use2FA();
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleValidate = async () => {
    if (!code.trim() || code.length !== 6) {
      setCodeTouched(true);
      return;
    }

    const isValid = await validate2FA(code);
    if (isValid) {
      handleSuccess();
    } else {
      setAttempts(prev => prev + 1);
      setCode("");
      setCodeTouched(false);
    }
  };

  const handleSuccess = () => {
    setCode("");
    setCodeTouched(false);
    setAttempts(0);
    onSuccessAction();
  };

  const handleClose = () => {
    if (!isLoading) {
      setCode("");
      setCodeTouched(false);
      setAttempts(0);
      if (onCancelAction) {
        onCancelAction();
      } else {
        onCloseAction();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6 && !isLoading) {
      handleValidate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {attempts > 0 && (
            <div className="bg-red-50 p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Invalid Code</p>
                <p>Please check your authenticator app and try again.</p>
                {attempts >= 3 && (
                  <p className="mt-1 text-xs">
                    If you continue to have trouble, contact support.
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="validationCode" className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit authentication code
            </Label>
            <Input
              id="validationCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onBlur={() => setCodeTouched(true)}
              onKeyPress={handleKeyPress}
              className={`text-center text-lg tracking-wider ${
                codeTouched && (!code.trim() || code.length !== 6) ? "border-red-500" : ""
              }`}
              placeholder="000000"
              disabled={isLoading}
              maxLength={6}
              autoFocus
            />
            {codeTouched && (!code.trim() || code.length !== 6) && (
              <p className="mt-1 text-xs text-red-600">
                Please enter a valid 6-digit code
              </p>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Open your authenticator app to get your verification code.</p>
            <p>This code changes every 30 seconds.</p>
          </div>

          <div className="flex gap-3 pt-2">
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
              type="button"
              onClick={handleValidate}
              disabled={isLoading || code.length !== 6}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
