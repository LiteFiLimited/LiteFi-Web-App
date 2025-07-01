import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RxEyeClosed } from "react-icons/rx";
import { VscEye } from "react-icons/vsc";
import Image from "next/image";
import CopyButton from "@/app/components/CopyButton";
import { formatCurrency } from "@/lib/utils";
import { DashboardCardSkeleton } from "./DashboardCardSkeleton";
import { WalletFundingModule } from "./WalletFundingModule";

interface WalletCardProps {
  isLoading: boolean;
  isProfileComplete: boolean;
  showBalance: boolean;
  toggleShowBalance: () => void;
  walletBalance: number;
  userName: string;
  onHistoryClick: () => void;
  onFundClick: () => void;
  onWithdrawClick: () => void;
  onCompleteProfileClick: () => void;
}

export function WalletCard({
  isLoading,
  isProfileComplete,
  showBalance,
  toggleShowBalance,
  walletBalance,
  userName,
  onHistoryClick,
  onFundClick,
  onWithdrawClick,
  onCompleteProfileClick,
}: WalletCardProps) {
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

  return (
    <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
      <div className="bg-gray-50 p-6 border-b border-white">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Your wallet balance</h3>
          <button 
            onClick={onHistoryClick}
            className="text-xs border border-gray-200 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            History
            <Image
              src="/assets/svgs/arrow-right.svg"
              alt="History"
              width={16}
              height={16}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4 mb-8">
          <div className="text-2xl font-bold">
            {showBalance ? 
              `₦ ${safeFormatCurrency(walletBalance)}` : 
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
          <WalletFundingModule 
            className="flex-1"
            buttonClassName="w-full bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors"
            onSuccess={onFundClick}
          />
          <button 
            onClick={onWithdrawClick}
            className="flex-1 bg-white text-gray-800 px-4 py-3 rounded-none text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Withdraw
          </button>
        </div>
      </div>
      {isProfileComplete ? (
        <div className="bg-white p-6">
          <div className="text-sm text-gray-500">
            <p className="mb-1">You can also fund account using the details below</p>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-gray-500">Acc name:</span> <span className="font-bold text-black">{userName}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">Acc no:</span> <span className="font-bold text-black">3588020135</span>
                <CopyButton
                  textToCopy="3588020135"
                  onCopySuccess={() => {}}
                  onCopyError={() => {}}
                  className="ml-2"
                />
              </div>
              <div>
                <span className="text-gray-500">Bank:</span> <span className="font-bold text-black">LiteFi MFB</span>
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