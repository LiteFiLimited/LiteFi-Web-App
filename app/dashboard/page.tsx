"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RxEyeClosed } from "react-icons/rx";
import { VscEye } from "react-icons/vsc";

export default function DashboardPage() {
  const [showWalletBalance, setShowWalletBalance] = useState(false);
  const [showInvestmentBalance, setShowInvestmentBalance] = useState(false);
  const [showLoanBalance, setShowLoanBalance] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Your Financial Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome back, Andrew tate</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-white">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Your wallet balance</h3>
              <button className="text-xs border border-gray-200 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">
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
                {showWalletBalance ? "₦ 1,500,000" : "*****"}
              </div>
              <button 
                onClick={() => setShowWalletBalance(!showWalletBalance)}
                className="text-gray-500 flex items-center hover:text-gray-700 transition-colors"
              >
                {showWalletBalance ? <VscEye size={20} /> : <RxEyeClosed size={20} />}
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors">
                Fund with Mono
              </button>
              <button className="flex-1 bg-gray-100 text-gray-800 px-4 py-3 rounded-none text-sm font-medium border border-gray-300 hover:bg-gray-200 transition-colors">
                Withdraw
              </button>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="text-sm text-gray-500">
              <p>You can also fund account using the details below</p>
              <div className="flex items-center mt-1">
                <span className="font-bold text-black">John Doe 3588020135 LiteFi MFB</span>
                <button className="ml-2 hover:opacity-70 transition-opacity">
                  <Image
                    src="/assets/svgs/copy.svg"
                    alt="Copy"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-white">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Your Investment Portfolio</h3>
              <button className="text-xs border border-gray-200 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">
                This week
                <Image
                  src="/assets/svgs/arrow-down.svg"
                  alt="This week"
                  width={16}
                  height={16}
                />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4 mb-8">
              <div className="text-2xl font-bold">
                {showInvestmentBalance ? "₦ 0.00" : "*****"}
              </div>
              <button 
                onClick={() => setShowInvestmentBalance(!showInvestmentBalance)}
                className="text-gray-500 flex items-center hover:text-gray-700 transition-colors"
              >
                {showInvestmentBalance ? <VscEye size={20} /> : <RxEyeClosed size={20} />}
              </button>
            </div>
            <div className="flex">
              <button className=" bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors">
                Create Investment
              </button>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Interest earned</span>
              <span className="font-bold text-black">+ 0.00</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-white">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Your Loan Overview</h3>
              <button className="text-xs border border-gray-200 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">
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
                {showLoanBalance ? "₦ 0.00" : "*****"}
              </div>
              <button 
                onClick={() => setShowLoanBalance(!showLoanBalance)}
                className="text-gray-500 flex items-center hover:text-gray-700 transition-colors"
              >
                {showLoanBalance ? <VscEye size={20} /> : <RxEyeClosed size={20} />}
              </button>
            </div>
          </div>
          <div className="bg-white p-6">
            <p className="text-sm">Update profile to borrow</p>
          </div>
        </Card>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-2">No data shown</h2>
        <p className="text-gray-500 mb-5">Complete your profile set up to start using the features</p>
        <button className="bg-red-600 text-white px-4 py-2 rounded-none hover:bg-red-700 transition-colors">
          Complete profile set up
        </button>
      </div>
    </>
  );
} 