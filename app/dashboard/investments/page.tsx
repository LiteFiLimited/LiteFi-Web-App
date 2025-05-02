"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActiveInvestmentsTable } from "@/components/investments/ActiveInvestmentsTable";
import { PendingReviewTable } from "@/components/investments/PendingReviewTable";
import { ClosedInvestmentsTable } from "@/components/investments/ClosedInvestmentsTable";
import { InvestmentType, Investment } from "@/types/investments";

export default function InvestmentsPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [activeTab, setActiveTab] = useState<string>("active-investments");
  const router = useRouter();
  
  // Investment types data
  const investmentTypes: InvestmentType[] = [
    {
      title: "Litefi Naira Investment",
      description: "Explore new Naira-based investment opportunities",
      route: "naira-investment",
      icon: "/assets/svgs/naira.svg"
    },
    {
      title: "Litefi Foreign Investment",
      description: "Grow your wealth globally",
      route: "foreign-investment",
      icon: "/assets/svgs/currency.svg"
    }
  ];

  // Currency options for the dropdown
  const currencyOptions = [
    { value: "usd", label: "USD" },
    { value: "naira", label: "Naira" },
    { value: "pound", label: "Pound" },
    { value: "euro", label: "Euro" }
  ];

  // Sample data for Active Investments
  const activeInvestmentsData = [
    {
      principalAmount: "₦ 2,500,000",
      currency: "NGN",
      tenure: "12 months",
      startDate: "15-02-2025",
      maturityDate: "15-02-2026",
      totalPayouts: "₦ 3,250,000"
    },
    {
      principalAmount: "$ 5,000",
      currency: "USD",
      tenure: "24 months",
      startDate: "10-01-2025",
      maturityDate: "10-01-2027",
      totalPayouts: "$ 7,000"
    }
  ];

  // Sample data for Pending Review
  const pendingReviewData = [
    {
      principalAmount: "₦ 1,750,000",
      currency: "NGN",
      tenure: "6 months",
      startDate: "Pending",
      maturityDate: "Pending",
      totalPayouts: "₦ 2,100,000",
      status: "Under Review"
    },
    {
      principalAmount: "€ 3,000",
      currency: "EUR",
      tenure: "12 months",
      startDate: "Pending",
      maturityDate: "Pending",
      totalPayouts: "€ 3,900",
      status: "Processing"
    }
  ];

  // Sample data for Closed Investments
  const closedInvestmentsData = [
    {
      principalAmount: "₦ 5,000,000",
      currency: "NGN",
      tenure: "12 months",
      startDate: "15-02-2024",
      maturityDate: "15-02-2025",
      totalPayouts: "₦ 6,500,000"
    },
    {
      principalAmount: "£ 10,000",
      currency: "GBP",
      tenure: "36 months",
      startDate: "05-12-2021",
      maturityDate: "05-12-2024",
      totalPayouts: "£ 15,000"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Investment</h1>
          <p className="text-muted-foreground">An overview of all your investments</p>
        </div>
        
        {/* Demo Toggle */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="demo-mode" className="text-sm text-gray-500">
            Demo Mode
          </Label>
          <Switch
            id="demo-mode"
            checked={isDemoMode}
            onCheckedChange={setIsDemoMode}
          />
        </div>
      </div>

      {/* Investment Summary Cards */}
      {isDemoMode ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6">
            <span className="text-sm text-gray-500">Total Investment NGN</span>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold">₦ 1,500,000</p>
              <div className="flex items-center">
                <span className="font-bold text-black">+ ₦ 120k</span>
                <div className="flex items-center ml-2 text-green-600">
                  <span className="text-sm font-medium">12.6%</span>
                  <Image 
                    src="/assets/svgs/increase.svg" 
                    alt="Increase" 
                    width={16} 
                    height={16}
                    className="ml-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total foreign Investment</span>
              <Select
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
              >
                <SelectTrigger className="text-xs border border-gray-200 h-auto px-3 py-1 rounded-full hover:bg-gray-100 transition-colors w-auto gap-1">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold">$ 5,200</p>
              <div className="flex items-center">
                <span className="font-bold text-black">+ $ 200</span>
                <div className="flex items-center ml-2 text-green-600">
                  <span className="text-sm font-medium">10.8%</span>
                  <Image 
                    src="/assets/svgs/increase.svg" 
                    alt="Increase" 
                    width={16} 
                    height={16}
                    className="ml-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            <span className="text-sm text-gray-500">Investments Paid out</span>
            <p className="text-2xl font-bold mt-2">203</p>
          </div>
        </div>
      ) : null}

      {!isDemoMode ? (
        <div className="bg-white p-8">
          {/* Empty state message */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium mb-2">You do not have any active investment</h2>
            <p className="text-gray-500">You're all set! No active investments at the moment. Ready to explore new opportunities to grow your wealth?</p>
          </div>

          <div className="bg-gray-50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {investmentTypes.map((investment) => (
                <div 
                  key={investment.title} 
                  className="bg-white p-6 relative overflow-hidden"
                >
                  <div 
                    className={`absolute ${investment.title === "Litefi Naira Investment" ? "right-2" : "right-01"} top-0`}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${investment.icon})`,
                      backgroundPosition: "right center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: investment.title === "Litefi Naira Investment" ? 
                        "clamp(20%, 15%, 30%)" : "50%",
                      opacity: 1.0,
                    }}
                  />
                  
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2">
                      {investment.title === "Litefi Naira Investment" ? (
                        <>🏦 {investment.title}</>
                      ) : (
                        <>🌍 {investment.title}</>
                      )}
                    </h3>
                    <p className="text-gray-600 mb-6">{investment.description}</p>
                    <button 
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm"
                      onClick={() => {
                        router.push(`/dashboard/investments/${investment.route}`);
                      }}
                    >
                      Create Investment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-none shadow-none border-4 border-white overflow-hidden mt-6">
          {/* Tabs for investment sections */}
          <div className="border-b overflow-x-auto scrollbar-hide bg-white">
            <div className="flex">
              <button
                className={`py-3 px-6 text-sm whitespace-nowrap ${
                  activeTab === "active-investments"
                    ? "border-b-2 border-red-600 text-red-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("active-investments")}
              >
                Active Investments
              </button>
              <button
                className={`py-3 px-6 text-sm whitespace-nowrap ${
                  activeTab === "pending-review"
                    ? "border-b-2 border-red-600 text-red-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("pending-review")}
              >
                Pending review
              </button>
              <button
                className={`py-3 px-6 text-sm whitespace-nowrap ${
                  activeTab === "closed-investments"
                    ? "border-b-2 border-red-600 text-red-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("closed-investments")}
              >
                Closed Investments
              </button>
            </div>
          </div>

          {/* Table Content based on active tab */}
          <div className="bg-white p-0">
            <div className="overflow-x-auto">
              {activeTab === "active-investments" && (
                <ActiveInvestmentsTable data={activeInvestmentsData} />
              )}

              {activeTab === "pending-review" && (
                <PendingReviewTable data={pendingReviewData} />
              )}

              {activeTab === "closed-investments" && (
                <ClosedInvestmentsTable data={closedInvestmentsData} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
