"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Smartphone, Copy, Check, AlertTriangle } from "lucide-react";
import { use2FA } from "@/hooks/use2FA";
import { useToastContext } from "@/app/components/ToastProvider";

interface TwoFactorSetupModalProps {
  open: boolean;
  onCloseAction: () => void;
  onSuccessAction?: () => void;
}

export default function TwoFactorSetupModal({
  open,
  onCloseAction,
  onSuccessAction
}: TwoFactorSetupModalProps) {
  const { enable2FA, verify2FA, isLoading, qrCodeUrl, secret, backupCodes, clearSetupData } = use2FA();
  const { success, error } = useToastContext();
  
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [verificationCode, setVerificationCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);

  const handleEnable2FA = async () => {
    const result = await enable2FA();
    if (result) {
      setStep('verify');
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      error("Validation Error", "Please enter the verification code");
      return;
    }

    const result = await verify2FA(verificationCode);
    if (result) {
      // If verification was successful, check if we have backup codes
      // If not, we'll show completion without backup codes step
      if (backupCodes && backupCodes.length > 0) {
        setStep('backup');
      } else {
        // Complete setup without backup codes
        success("2FA Enabled", "Two-factor authentication has been enabled successfully");
        handleComplete();
      }
    }
  };

  const handleComplete = () => {
    clearSetupData();
    setStep('setup');
    setVerificationCode("");
    setCodeTouched(false);
    setCopiedSecret(false);
    setCopiedBackupCodes(false);
    onCloseAction();
    
    if (onSuccessAction) {
      onSuccessAction();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      clearSetupData();
      setStep('setup');
      setVerificationCode("");
      setCodeTouched(false);
      setCopiedSecret(false);
      setCopiedBackupCodes(false);
      onCloseAction();
    }
  };

  const copyToClipboard = async (text: string, type: 'secret' | 'backup') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'secret') {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } else {
        setCopiedBackupCodes(true);
        setTimeout(() => setCopiedBackupCodes(false), 2000);
      }
      success("Copied", "Copied to clipboard");
    } catch (err) {
      error("Error", "Failed to copy to clipboard");
    }
  };

  const renderSetupStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Enable Two-Factor Authentication</h3>
        <p className="text-sm text-gray-600">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Before you begin</h4>
            <p className="text-sm text-blue-800">
              Make sure you have an authenticator app installed on your phone (Google Authenticator, Authy, or similar).
            </p>
          </div>
        </div>
      </div>

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
          type="button"
          onClick={handleEnable2FA}
          disabled={isLoading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        >
          {isLoading ? "Setting up..." : "Begin Setup"}
        </Button>
      </div>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Set Up Authenticator</h3>
        <p className="text-sm text-gray-600 mb-4">
          {qrCodeUrl ? 
            "Scan this QR code with your authenticator app, then enter the 6-digit code." :
            "Enter this secret in your authenticator app manually, then enter the 6-digit code."
          }
        </p>
      </div>

      {qrCodeUrl && (
        <div className="flex justify-center mb-4">
          <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 border rounded-lg" />
        </div>
      )}

      {secret && (
        <div className="bg-gray-50 p-3 rounded-md">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            {qrCodeUrl ? "Manual Entry Code (if you can't scan):" : "Secret Key for Manual Entry:"}
          </Label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white p-2 rounded border text-sm font-mono break-all">
              {secret}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(secret, 'secret')}
              className="shrink-0"
            >
              {copiedSecret ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          {!qrCodeUrl && (
            <p className="text-xs text-gray-600 mt-2">
              In your authenticator app, select "Enter a setup key" or "Manual entry" and use this secret.
            </p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
          Enter 6-digit code from your authenticator app
        </Label>
        <Input
          id="verificationCode"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onBlur={() => setCodeTouched(true)}
          className={`text-center text-lg tracking-wider ${codeTouched && !verificationCode.trim() ? "border-red-500" : ""}`}
          placeholder="000000"
          disabled={isLoading}
          maxLength={6}
        />
        {codeTouched && !verificationCode.trim() && (
          <p className="mt-1 text-xs text-red-600">Verification code is required</p>
        )}
      </div>

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
          type="button"
          onClick={handleVerify}
          disabled={isLoading || verificationCode.length !== 6}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        >
          {isLoading ? "Verifying..." : "Verify & Enable"}
        </Button>
      </div>
    </div>
  );

  const renderBackupStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">2FA Enabled Successfully!</h3>
        <p className="text-sm text-gray-600">
          Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
        </p>
      </div>

      {backupCodes && (
        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Important: Save Your Backup Codes</h4>
              <p className="text-sm text-yellow-800">
                These codes can only be used once each. Store them securely offline.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Backup Codes:</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(backupCodes.join('\n'), 'backup')}
              >
                {copiedBackupCodes ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedBackupCodes ? "Copied" : "Copy All"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <code key={index} className="text-xs font-mono bg-gray-100 p-1 rounded text-center">
                  {code}
                </code>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button
          type="button"
          onClick={handleComplete}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold">
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {step === 'setup' && "Secure your account with two-factor authentication"}
            {step === 'verify' && "Step 2 of 3: Verify your authenticator app"}
            {step === 'backup' && "Step 3 of 3: Save your backup codes"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-1">
          {step === 'setup' && renderSetupStep()}
          {step === 'verify' && renderVerifyStep()}
          {step === 'backup' && renderBackupStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
