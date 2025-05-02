"use client";

import React from "react";
import { IoAlert } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface InsufficientBalanceModalProps {
  onClose: () => void;
  onFundWallet: () => void;
}

export default function InsufficientBalanceModal({
  onClose,
  onFundWallet,
}: InsufficientBalanceModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="bg-white w-full max-w-md p-8 z-10 relative mx-4">
        <div className="flex flex-col items-center text-center">
          {/* Error Icon */}
          <div className="rounded-full bg-red-500 p-4 flex items-center justify-center mb-6">
            <IoAlert className="text-white w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-medium mb-4">
            Insufficient Balance
          </h2>
          
          <p className="text-gray-600 mb-8">
            You don't have enough funds in your wallet to proceed with this investment. Please fund your account and try again or try paying using Mono
          </p>
          
          <Button 
            onClick={onFundWallet} 
            className="w-full bg-red-600 hover:bg-red-700 h-12 rounded-none"
          >
            Fund your wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
