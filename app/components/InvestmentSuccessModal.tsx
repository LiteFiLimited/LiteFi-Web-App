"use client";

import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvestmentSuccessModalProps {
  onClose: () => void;
  onViewInvestment: () => void;
}

export default function InvestmentSuccessModal({
  onClose,
  onViewInvestment,
}: InvestmentSuccessModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="bg-white w-full max-w-md p-8 z-10 relative mx-4">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="rounded-full bg-green-400 p-4 flex items-center justify-center mb-6">
            <Check className="text-white w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-medium mb-4">
            Investment Created Successfully🎉
          </h2>
          
          <p className="text-gray-600 mb-8">
            Your investment has been created and added to your portfolio. Sit back and watch your money grow!
          </p>
          
          <Button 
            onClick={onViewInvestment} 
            className="w-full bg-red-600 hover:bg-red-700 h-12 rounded-none"
          >
            View investment
          </Button>
        </div>
      </div>
    </div>
  );
}
