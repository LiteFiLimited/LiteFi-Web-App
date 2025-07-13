"use client";

import { useState, useEffect } from "react";
import { twoFactorApi, Enable2FAResponse } from "@/lib/twoFactorApi";
import { useToastContext } from "@/app/components/ToastProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

export interface Use2FAState {
  isEnabled: boolean;
  isLoading: boolean;
  qrCodeUrl: string | null;
  secret: string | null;
  backupCodes: string[] | null;
}

export interface Use2FAActions {
  enable2FA: () => Promise<Enable2FAResponse | null>;
  verify2FA: (code: string) => Promise<boolean>;
  validate2FA: (code: string) => Promise<boolean>;
  disable2FA: (code: string) => Promise<boolean>;
  clearSetupData: () => void;
}

export function use2FA(): Use2FAState & Use2FAActions {
  const { error, success } = useToastContext();
  const { profile } = useUserProfile();

  const [state, setState] = useState<Use2FAState>({
    isEnabled: false,
    isLoading: false,
    qrCodeUrl: null,
    secret: null,
    backupCodes: null,
  });

  // Load 2FA status on component mount
  // useEffect(() => {
  //   loadStatus();
  // }, []);

  // Note: 2FA status loading is disabled until backend implementation is complete
  // Status will be provided through login response in the future

  const loadStatus = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await twoFactorApi.getStatus();
      setState((prev) => ({
        ...prev,
        isEnabled: response.data?.enabled || false,
        isLoading: false,
      }));
    } catch (err: any) {
      console.error("Failed to load 2FA status:", err);
      setState((prev) => ({ ...prev, isLoading: false }));
      error("Error", "Failed to load 2FA status");
    }
  };

  const enable2FA = async (): Promise<Enable2FAResponse | null> => {
    try {
      console.log("🔧 Starting 2FA enable process...");
      setState((prev) => ({ ...prev, isLoading: true }));

      // Get user's email from profile
      if (!profile?.email) {
        console.error("❌ No email found in profile:", profile);
        error("Error", "User email not found. Please refresh and try again.");
        setState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }

      console.log("📧 Email:", profile.email);
      console.log("📡 Making API call to enable 2FA...");

      const response = await twoFactorApi.enable({
        email: profile.email,
      });

      console.log("✅ API Response:", response);

      if (response.success && response.data) {
        console.log("🎉 2FA enabled successfully!");
        success(
          "Success",
          "2FA setup initiated successfully! Please scan the QR code with your authenticator app."
        );
        setState((prev) => ({
          ...prev,
          qrCodeUrl: response.data!.qrCodeUrl || null,
          secret: response.data!.secret,
          backupCodes: response.data!.backupCodes || null,
          isLoading: false,
        }));
        return response.data;
      } else {
        console.log("⚠️ API returned success=false or no data");
        error("Error", response.message || "Failed to enable 2FA");
        setState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }
    } catch (err: any) {
      console.error("❌ Failed to enable 2FA:", err);
      setState((prev) => ({ ...prev, isLoading: false }));
      error("Error", err.message || "Failed to enable 2FA");
      return null;
    }
  };

  const verify2FA = async (code: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Get user's email from profile
      if (!profile?.email) {
        console.error("❌ No email found in profile:", profile);
        error("Error", "User email not found. Please refresh and try again.");
        setState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }

      console.log(
        "🔍 Verifying 2FA with email:",
        profile.email,
        "and code:",
        code
      );

      const response = await twoFactorApi.verify({
        email: profile.email,
        token: code,
      });

      console.log("✅ Verify API Response:", response);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          isEnabled: true,
          isLoading: false,
        }));

        success("Success", "2FA has been enabled successfully!");
        return true;
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
        error("Error", response.message || "Failed to verify 2FA");
        return false;
      }
    } catch (err: any) {
      console.error("❌ Failed to verify 2FA:", err);
      setState((prev) => ({ ...prev, isLoading: false }));
      error("Error", err.message || "Invalid verification code");
      return false;
    }
  };

  const validate2FA = async (code: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await twoFactorApi.validate({ token: code });

      setState((prev) => ({ ...prev, isLoading: false }));
      success("Success", "2FA validation successful!");
      return true;
    } catch (err: any) {
      console.error("Failed to validate 2FA:", err);
      setState((prev) => ({ ...prev, isLoading: false }));
      error("Error", err.message || "Invalid 2FA code");
      return false;
    }
  };

  const disable2FA = async (code: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await twoFactorApi.disable({ token: code });

      setState((prev) => ({
        ...prev,
        isEnabled: false,
        qrCodeUrl: null,
        secret: null,
        backupCodes: null,
        isLoading: false,
      }));

      success("Success", "2FA has been disabled successfully!");
      return true;
    } catch (err: any) {
      console.error("Failed to disable 2FA:", err);
      setState((prev) => ({ ...prev, isLoading: false }));
      error("Error", err.message || "Failed to disable 2FA");
      return false;
    }
  };

  const clearSetupData = () => {
    setState((prev) => ({
      ...prev,
      qrCodeUrl: null,
      secret: null,
      backupCodes: null,
      isLoading: false,
    }));
  };

  return {
    ...state,
    enable2FA,
    verify2FA,
    validate2FA,
    disable2FA,
    clearSetupData,
  };
}

export default use2FA;
