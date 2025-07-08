import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RxEyeClosed } from "react-icons/rx";
import { VscEye } from "react-icons/vsc";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { DashboardCardSkeleton } from "./DashboardCardSkeleton";

interface LoanCardProps {
  isLoading: boolean;
  isProfileComplete: boolean;
  showBalance: boolean;
  toggleShowBalance: () => void;
  outstandingAmount: number;
  activeLoans: number;
  nextPaymentAmount?: number;
  nextPaymentDate?: string;
  onRepaymentsClick: () => void;
  onRepayClick: () => void;
  onApplyForLoanClick: () => void;
  onCompleteProfileClick: () => void;
}

export function LoanCard({
  isLoading,
  isProfileComplete,
  showBalance,
  toggleShowBalance,
  outstandingAmount,
  activeLoans,
  nextPaymentAmount,
  nextPaymentDate,
  onRepaymentsClick,
  onRepayClick,
  onApplyForLoanClick,
  onCompleteProfileClick,
}: LoanCardProps) {
  if (isLoading) {
    return <DashboardCardSkeleton />;
  }

  const safeFormatCurrency = (value: number) => {
    try {
      return formatCurrency(value);
    } catch (error) {
      return new Intl.NumberFormat('en-NG').format(value);
    }
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
      <div className="bg-gray-50 p-6 border-b border-white">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Loan and Repayments</h3>
          <button 
            onClick={onRepaymentsClick}
            className="text-xs border border-gray-200 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            Repayments
            <Image
              src="/assets/svgs/arrow-right.svg"
              alt="Repayments"
              width={16}
              height={16}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4 mb-8">
          <div className="text-2xl font-bold">
            {showBalance ? 
              `₦ ${safeFormatCurrency(outstandingAmount)}` : 
              "*****"}
          </div>
          <button 
            onClick={toggleShowBalance}
            className="text-gray-500 flex items-center hover:text-gray-700 transition-colors"
          >
            {showBalance ? <VscEye size={20} /> : <RxEyeClosed size={20} />}
          </button>
        </div>
        <div className="flex">
          {isProfileComplete && activeLoans > 0 ? (
            <button 
              onClick={onRepayClick}
              className="bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Repay
            </button>
          ) : (
            <button 
              onClick={onApplyForLoanClick}
              className="bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Apply For Loan
            </button>
          )}
        </div>
      </div>
      {isProfileComplete && activeLoans > 0 ? (
        <div className="bg-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm mb-1">Next repayment</p>
              <p className="font-bold">₦{safeFormatCurrency(nextPaymentAmount || 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm mb-1">Due date</p>
              <p className="font-bold">{formatDate(nextPaymentDate)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 text-center">
          <p className="text-sm font-medium text-gray-700 mb-2">No data shown</p>
          <p className="text-sm text-gray-500 mb-4">Complete your profile set up to start using the features</p>
          <Button
            onClick={onCompleteProfileClick}
            variant="outline"
            className="rounded-none h-9 px-6 mx-auto text-red-600 border-red-600 hover:bg-red-50"
          >
            Complete profile set up
          </Button>
        </div>
      )}
    </Card>
  );
} 