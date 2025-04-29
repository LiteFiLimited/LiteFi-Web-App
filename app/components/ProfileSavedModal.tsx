"use client";

import React from "react";
import { FaCheck } from "react-icons/fa6";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

interface ProfileSavedModalProps {
  onClose: () => void;
  onStartInvesting?: () => void;
  onGetLoan?: () => void;
  type?: "investment" | "loan";
}

export default function ProfileSavedModal({
  onClose,
  onStartInvesting,
  onGetLoan,
  type = "investment"
}: ProfileSavedModalProps) {
  const router = useRouter();

  // Text based on modal type
  const content = {
    investment: {
      title: "Congratulations, you can start investing",
      body: "Thank you for updating your personal information. We're pleased to inform you that you can now start investing with us and enjoy great value for your money.",
      primaryButton: "Start Investing",
      primaryAction: onStartInvesting,
    },
    loan: {
      title: "Congratulations! Your Profile is Updated.",
      subtitle: "You Can Now Access a Loan!",
      body: "Thank you for updating all your profile details. You are now eligible to take a loan and access the financial support you need.",
      primaryButton: "Get a Loan",
      primaryAction: onGetLoan || (() => router.push('/dashboard/loans')),
    },
  };

  const activeContent = content[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="bg-white w-full max-w-md p-8 z-10 relative mx-4">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="rounded-full bg-green-400 p-4 flex items-center justify-center mb-6">
            <FaCheck className="text-white w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-medium mb-1">
            {activeContent.title}
          </h2>
          
          {type === "loan" && (
            <h3 className="text-xl font-medium mb-4 text-center">
              {content.loan.subtitle}
            </h3>
          )}
          
          <p className="text-gray-600 mb-8">
            {activeContent.body}
          </p>
          
          <div className="flex flex-col md:flex-row-reverse w-full gap-4">
            <Button 
              onClick={activeContent.primaryAction} 
              className="w-full bg-red-600 hover:bg-red-700 h-12"
            >
              {activeContent.primaryButton}
            </Button>
            
            <Button 
              onClick={onClose} 
              variant="outline"
              className="w-full border-gray-300 h-12"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}