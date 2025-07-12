"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TransactionPinModal from "@/app/components/TransactionPinModal";

export default function SecuritySettings() {
  const router = useRouter();
  const [showTransactionPinModal, setShowTransactionPinModal] = useState(false);
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
            </div>
            <Button variant="outline" className="h-10 rounded-none border-gray-300">
              Set Up
            </Button>
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
    </div>
  );
}
