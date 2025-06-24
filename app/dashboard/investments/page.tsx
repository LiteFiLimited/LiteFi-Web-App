"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { InvestmentType } from "@/types/investments";
import CreateNewInvestmentModal from "@/app/components/CreateNewInvestmentModal";
import { useInvestments } from "@/hooks/useInvestments";
import { formatCurrency } from "@/lib/utils";
import { DashboardCardSkeleton } from "@/components/dashboard/DashboardCardSkeleton";
import { useEligibility } from "@/app/components/EligibilityProvider";

export default function InvestmentsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [activeTab, setActiveTab] = useState<string>("active-investments");
  const [showCreateInvestmentModal, setShowCreateInvestmentModal] = useState(false);
  const router = useRouter();
  const { checkEligibility } = useEligibility();
  
  const { 
    activeInvestments, 
    pendingInvestments, 
    closedInvestments, 
    isLoading,
    hasInvestments
  } = useInvestments();
  
  // Check eligibility when component mounts
  useEffect(() => {
    const checkInvestmentEligibility = async () => {
      await checkEligibility('investment');
    };
    
    checkInvestmentEligibility();
  }, [checkEligibility]);
  
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
    { value: "USD", label: "USD" },
    { value: "NGN", label: "Naira" },
    { value: "GBP", label: "Pound" },
    { value: "EUR", label: "Euro" }
  ];
  
  // Calculate total investments by currency
  const getTotalInvestments = (currency: string) => {
    const investments = activeInvestments.filter(inv => inv.currency === currency);
    return investments.reduce((total, inv) => total + inv.amount, 0);
  };
  
  // Calculate total returns by currency
  const getTotalReturns = (currency: string) => {
    const investments = activeInvestments.filter(inv => inv.currency === currency);
    return investments.reduce((total, inv) => {
      return total + (inv.expectedReturns - inv.amount);
    }, 0);
  };
  
  // Calculate percentage increase
  const getPercentageIncrease = (currency: string) => {
    const total = getTotalInvestments(currency);
    const returns = getTotalReturns(currency);
    if (total === 0) return 0;
    return ((returns / total) * 100).toFixed(1);
  };
  
  // Format table data for active investments
  const formatActiveInvestmentsData = activeInvestments.map(inv => ({
    id: inv.id,
    principalAmount: `${inv.currency === 'NGN' ? '₦' : inv.currency === 'USD' ? '$' : inv.currency === 'GBP' ? '£' : '€'} ${formatCurrency(inv.amount)}`,
    currency: inv.currency,
    tenure: `${inv.tenure} ${inv.tenure === 1 ? 'month' : 'months'}`,
    startDate: inv.startDate ? new Date(inv.startDate).toLocaleDateString() : 'N/A',
    maturityDate: inv.maturityDate ? new Date(inv.maturityDate).toLocaleDateString() : 'N/A',
    totalPayouts: `${inv.currency === 'NGN' ? '₦' : inv.currency === 'USD' ? '$' : inv.currency === 'GBP' ? '£' : '€'} ${formatCurrency(inv.expectedReturns)}`
  }));
  
  // Format table data for pending investments
  const formatPendingInvestmentsData = pendingInvestments.map(inv => ({
    id: inv.id,
    principalAmount: `${inv.currency === 'NGN' ? '₦' : inv.currency === 'USD' ? '$' : inv.currency === 'GBP' ? '£' : '€'} ${formatCurrency(inv.amount)}`,
    currency: inv.currency,
    tenure: `${inv.tenure} ${inv.tenure === 1 ? 'month' : 'months'}`,
    startDate: 'Pending',
    maturityDate: 'Pending',
    totalPayouts: `${inv.currency === 'NGN' ? '₦' : inv.currency === 'USD' ? '$' : inv.currency === 'GBP' ? '£' : '€'} ${formatCurrency(inv.expectedReturns)}`,
    status: 'Under Review'
  }));
  
  // Format table data for closed investments
  const formatClosedInvestmentsData = closedInvestments.map(inv => ({
    id: inv.id,
    principalAmount: `${inv.currency === 'NGN' ? '₦' : inv.currency === 'USD' ? '$' : inv.currency === 'GBP' ? '£' : '€'} ${formatCurrency(inv.amount)}`,
    currency: inv.currency,
    tenure: `${inv.tenure} ${inv.tenure === 1 ? 'month' : 'months'}`,
    startDate: inv.startDate ? new Date(inv.startDate).toLocaleDateString() : 'N/A',
    maturityDate: inv.maturityDate ? new Date(inv.maturityDate).toLocaleDateString() : 'N/A',
    totalPayouts: `${inv.currency === 'NGN' ? '₦' : inv.currency === 'USD' ? '$' : inv.currency === 'GBP' ? '£' : '€'} ${formatCurrency(inv.expectedReturns)}`,
    canWithdraw: inv.status === 'MATURED'
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Investment</h1>
          <p className="text-muted-foreground">An overview of all your investments</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Create Investment Button */}
          <Button 
            onClick={() => setShowCreateInvestmentModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 h-10 rounded-none"
          >
            Create New Investment
          </Button>
        </div>
      </div>

      {isLoading ? (
        // Loading state for investment cards
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      ) : hasInvestments ? (
        // Investment Summary Cards
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6">
            <span className="text-sm text-gray-500">Total Investment NGN</span>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold">₦ {formatCurrency(getTotalInvestments("NGN"))}</p>
              {getTotalReturns("NGN") > 0 && (
                <div className="flex items-center">
                  <span className="font-bold text-black">+ ₦ {formatCurrency(getTotalReturns("NGN"))}</span>
                  <div className="flex items-center ml-2 text-green-600">
                    <span className="text-sm font-medium">{getPercentageIncrease("NGN")}%</span>
                    <Image 
                      src="/assets/svgs/increase.svg" 
                      alt="Increase" 
                      width={16} 
                      height={16}
                      className="ml-1"
                    />
                  </div>
                </div>
              )}
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
                  {currencyOptions.filter(c => c.value !== "NGN").map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold">
                {selectedCurrency === "USD" ? "$" : selectedCurrency === "GBP" ? "£" : "€"} {formatCurrency(getTotalInvestments(selectedCurrency))}
              </p>
              {getTotalReturns(selectedCurrency) > 0 && (
                <div className="flex items-center">
                  <span className="font-bold text-black">
                    + {selectedCurrency === "USD" ? "$" : selectedCurrency === "GBP" ? "£" : "€"} {formatCurrency(getTotalReturns(selectedCurrency))}
                  </span>
                  <div className="flex items-center ml-2 text-green-600">
                    <span className="text-sm font-medium">{getPercentageIncrease(selectedCurrency)}%</span>
                    <Image 
                      src="/assets/svgs/increase.svg" 
                      alt="Increase" 
                      width={16} 
                      height={16}
                      className="ml-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-6">
            <span className="text-sm text-gray-500">Investments Paid out</span>
            <p className="text-2xl font-bold mt-2">{closedInvestments.length}</p>
          </div>
        </div>
      ) : null}

      {!isLoading && !hasInvestments ? (
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
      ) : hasInvestments ? (
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
                Active Investments ({activeInvestments.length})
              </button>
              <button
                className={`py-3 px-6 text-sm whitespace-nowrap ${
                  activeTab === "pending-review"
                    ? "border-b-2 border-red-600 text-red-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("pending-review")}
              >
                Pending review ({pendingInvestments.length})
              </button>
              <button
                className={`py-3 px-6 text-sm whitespace-nowrap ${
                  activeTab === "closed-investments"
                    ? "border-b-2 border-red-600 text-red-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("closed-investments")}
              >
                Closed Investments ({closedInvestments.length})
              </button>
            </div>
          </div>

          {/* Table Content based on active tab */}
          <div className="bg-white p-0">
            <div className="overflow-x-auto">
              {activeTab === "active-investments" && (
                activeInvestments.length > 0 ? (
                  <ActiveInvestmentsTable data={formatActiveInvestmentsData} />
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-500">No active investments</p>
                  </div>
                )
              )}

              {activeTab === "pending-review" && (
                pendingInvestments.length > 0 ? (
                  <PendingReviewTable data={formatPendingInvestmentsData} />
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-500">No pending investments</p>
                  </div>
                )
              )}

              {activeTab === "closed-investments" && (
                closedInvestments.length > 0 ? (
                  <ClosedInvestmentsTable data={formatClosedInvestmentsData} />
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-500">No closed investments</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Create New Investment Modal */}
      {showCreateInvestmentModal && (
        <CreateNewInvestmentModal 
          investmentTypes={investmentTypes}
          onCloseAction={() => setShowCreateInvestmentModal(false)}
        />
      )}
    </div>
  );
}
