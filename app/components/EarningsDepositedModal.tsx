"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface EarningsDepositedModalProps {
  amount: string;
  onViewWallet: () => void;
}

export default function EarningsDepositedModal({ amount, onViewWallet }: EarningsDepositedModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="bg-white w-full max-w-md p-8 z-10 relative mx-4">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="rounded-full bg-green-400 p-4 flex items-center justify-center mb-6">
            <Check className="text-white w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-medium mb-4">
            Earnings Deposited Successfully🎉
          </h2>
          
          <p className="text-gray-600 mb-2">
            Congratulations! <span className="font-bold">{amount}</span> has been successfully credited to your wallet. Your earnings are now available for use.
          </p>
          
          <Button 
            onClick={onViewWallet} 
            className="w-full bg-red-600 hover:bg-red-700 h-12 rounded-none mt-6"
          >
            View Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
