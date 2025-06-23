import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RxEyeClosed } from "react-icons/rx";
import { VscEye } from "react-icons/vsc";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { DashboardCardSkeleton } from "./DashboardCardSkeleton";

interface InvestmentCardProps {
  isLoading: boolean;
  isProfileComplete: boolean;
  showBalance: boolean;
  toggleShowBalance: () => void;
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  onCreateInvestmentClick: () => void;
  onViewInvestmentsClick: () => void;
  onCompleteProfileClick: () => void;
}

export function InvestmentCard({
  isLoading,
  isProfileComplete,
  showBalance,
  toggleShowBalance,
  totalInvested,
  totalReturns,
  activeInvestments,
  onCreateInvestmentClick,
  onViewInvestmentsClick,
  onCompleteProfileClick,
}: InvestmentCardProps) {
  if (isLoading) {
    return <DashboardCardSkeleton />;
  }

  return (
    <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
      <div className="bg-gray-50 p-6 border-b border-white">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Your Investment Portfolio</h3>
          <button 
            onClick={onViewInvestmentsClick}
            className="text-xs border border-gray-200 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            This week
            <Image
              src="/assets/svgs/arrow-right.svg"
              alt="View Investments"
              width={16}
              height={16}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4 mb-8">
          <div className="text-2xl font-bold">
            {showBalance ? 
              `₦ ${formatCurrency(totalInvested)}` : 
              "*****"}
          </div>
          <button 
            onClick={toggleShowBalance}
            className="text-gray-500 flex items-center hover:text-gray-700 transition-colors"
          >
            {showBalance ? <VscEye size={20} /> : <RxEyeClosed size={20} />}
          </button>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onCreateInvestmentClick}
            className="bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Create New Investment
          </button>
          {isProfileComplete && activeInvestments > 0 && (
            <button 
              onClick={onViewInvestmentsClick}
              className="bg-white text-gray-800 px-4 py-3 rounded-none text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              View Investment
            </button>
          )}
        </div>
      </div>
      {isProfileComplete && totalReturns > 0 ? (
        <div className="bg-white p-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Interest earned</span>
            <div className="flex items-center">
              <span className="font-bold text-black">+ ₦ {formatCurrency(totalReturns)}</span>
              <div className="flex items-center ml-2 text-green-600">
                <span className="text-sm font-medium">12.5%</span>
                <Image 
                  src="/assets/svgs/increase.svg" 
                  alt="Increase" 
                  width={16} 
                  height={16}
                />
              </div>
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