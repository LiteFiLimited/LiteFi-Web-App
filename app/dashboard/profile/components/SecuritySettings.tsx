"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import TransactionPinModal from "@/app/components/TransactionPinModal";
import TwoFactorSetupModal from "@/app/components/TwoFactorSetupModal";
import { use2FA } from "@/hooks/use2FA";

export default function SecuritySettings() {
  const router = useRouter();
  const [showTransactionPinModal, setShowTransactionPinModal] = useState(false);
  const [show2FASetupModal, setShow2FASetupModal] = useState(false);
  const [show2FADisableModal, setShow2FADisableModal] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false); // Local state for now
  
  const { 
    isLoading: is2FALoading, 
    disable2FA
  } = use2FA();

  const handle2FAToggle = async (enabled: boolean) => {
    if (enabled) {
      // Enable 2FA - show setup modal
      setShow2FASetupModal(true);
    } else {
      // Disable 2FA - show disable modal
      setShow2FADisableModal(true);
    }
  };

  const handleDisable2FA = async () => {
    if (!disableCode.trim()) return;
    
    const success = await disable2FA(disableCode);
    if (success) {
      setShow2FADisableModal(false);
      setDisableCode("");
      setIs2FAEnabled(false); // Update local state
    }
  };
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Security</h2>
      
      {/* Gray divider line that doesn't touch the edges */}
        <div className="h-px bg-gray-200 mb-2"></div>
      
      <p className="text-gray-600 mb-6">To update profile, send request to LendBook admin with the details</p>

      {/* All options in a single container */}
      <div className="border border-gray-200">
        {/* Change Password Section */}
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium">Change Password</h3>
            </div>
            <Button 
              variant="outline" 
              className="h-10 rounded-none border-gray-300"
              onClick={() => router.push("/dashboard/change-password")}
            >
              Change
            </Button>
          </div>
        </div>

        {/* Divider that doesn't touch the edges */}
        <div className="px-6">
          <div className="h-px bg-gray-200"></div>
        </div>

        {/* 2 Factor Authentication Section */}
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium">2 Factor Authentication</h3>
              <p className="text-sm text-gray-500 mt-1">
                {is2FAEnabled ? "2FA is enabled" : "Add extra security to your account"}
              </p>
            </div>
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={handle2FAToggle}
              disabled={is2FALoading}
              className="data-[state=checked]:bg-red-600"
            />
          </div>
        </div>

        {/* Divider that doesn't touch the edges */}
        <div className="px-6">
          <div className="h-px bg-gray-200"></div>
        </div>

        {/* Transaction Pin Section */}
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium">Transaction Pin</h3>
            </div>
            <Button 
              variant="outline" 
              className="h-10 rounded-none border-gray-300"
              onClick={() => setShowTransactionPinModal(true)}
            >
              Set Up
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction PIN Modal */}
      <TransactionPinModal
        open={showTransactionPinModal}
        onCloseAction={() => setShowTransactionPinModal(false)}
        onSuccessAction={() => {
          // You can add any additional logic here when PIN is successfully set
          console.log("Transaction PIN set successfully");
        }}
      />

      {/* 2FA Setup Modal */}
      <TwoFactorSetupModal
        open={show2FASetupModal}
        onCloseAction={() => setShow2FASetupModal(false)}
        onSuccessAction={() => {
          setIs2FAEnabled(true); // Update local state when successfully enabled
        }}
      />

      {/* 2FA Disable Modal */}
      {show2FADisableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Disable Two-Factor Authentication</h3>
            <p className="text-gray-600 mb-4">
              Enter a code from your authenticator app to disable 2FA:
            </p>
            <input
              type="text"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full p-3 border border-gray-300 rounded-md text-center text-lg tracking-wider mb-4"
              placeholder="000000"
              maxLength={6}
              disabled={is2FALoading}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShow2FADisableModal(false);
                  setDisableCode("");
                }}
                disabled={is2FALoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDisable2FA}
                disabled={is2FALoading || disableCode.length !== 6}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {is2FALoading ? "Disabling..." : "Disable 2FA"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
