"use client";

import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvestmentPendingModalProps {
  onViewStatus: () => void;
}

export default function InvestmentPendingModal({ onViewStatus }: InvestmentPendingModalProps) {
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
            Investment Pending Review
          </h2>
          
          <p className="text-gray-600 mb-8">
            Hang tight, we're reviewing your investment. Your investment request has been received and is currently under review. You'll be notified once it's approved and processed.
          </p>
          
          <Button 
            onClick={onViewStatus} 
            className="w-full bg-red-600 hover:bg-red-700 h-12 rounded-none"
          >
            View Status
          </Button>
        </div>
      </div>
    </div>
  );
}
