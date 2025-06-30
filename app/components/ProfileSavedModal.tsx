"use client";

import React from "react";
import { FaCheck } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ProfileSavedModalProps {
  open: boolean;
  onClose: () => void;
  onViewProfile: () => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
}

export default function ProfileSavedModal({
  open,
  onClose,
  onViewProfile,
  allFormsCompleted,
  onGetLoan
}: ProfileSavedModalProps) {
  const router = useRouter();

  if (!open) return null;

  const handleLoanAction = () => {
    onClose(); // Close modal first
    if (onGetLoan) {
      onGetLoan();
    } else {
      router.push('/dashboard/loans');
    }
  };

  const content = allFormsCompleted ? {
    title: "Congratulations! Your Profile is Updated.",
    subtitle: "You Can Now Access a Loan!",
    body: "Thank you for updating all your profile details. You are now eligible to take a loan and access the financial support you need.",
    primaryButton: "Get a Loan",
    primaryAction: handleLoanAction,
  } : {
    title: "Profile Section Updated",
    body: "Your profile section has been successfully updated. Continue updating other sections to complete your profile.",
    primaryButton: "View Profile",
    primaryAction: onViewProfile,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="bg-white w-full max-w-md p-8 z-10 relative mx-4 rounded-lg">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="rounded-full bg-green-400 p-4 flex items-center justify-center mb-6">
            <FaCheck className="text-white w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-medium mb-1">
            {content.title}
          </h2>
          
          {allFormsCompleted && (
            <h3 className="text-xl font-medium mb-4 text-center">
              {content.subtitle}
            </h3>
          )}
          
          <p className="text-gray-600 mb-8">
            {content.body}
          </p>
          
          <div className="flex flex-col md:flex-row-reverse w-full gap-4">
            <Button 
              onClick={content.primaryAction} 
              className="w-full bg-red-600 hover:bg-red-700 h-12"
            >
              {content.primaryButton}
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