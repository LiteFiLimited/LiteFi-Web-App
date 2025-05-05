"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InactiveLoanCard } from "@/components/loans/InactiveLoanCard";
import { ActiveLoanCard } from "@/components/loans/ActiveLoanCard";
import { EmptyLoanCard } from "@/components/loans/EmptyLoanCard";
import { UpcomingRepaymentsTable } from "@/components/loans/UpcomingRepaymentsTable";
import { PendingApprovalTable } from "@/components/loans/PendingApprovalTable";
import { CompletedLoansTable } from "@/components/loans/CompletedLoansTable";
import { LoanType, ActiveLoan } from "@/types/loans";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function LoansPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upcoming-repayments");
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Loan types data
  const loanTypes: LoanType[] = [
    {
      title: "Salary Loan",
      amount: "10 million",
      description: "Get a salary loan now and repay in easy monthly instalments.",
      route: "salary-loan"
    },
    {
      title: "Working Capital Loan",
      amount: "10 million",
      description: "Boost Your Business Cash Flow – Get Fast, Flexible Financing for Your Daily Operations",
      route: "working-capital-loan"
    },
    {
      title: "Auto Loan",
      amount: "100 million",
      description: "Drive Your Dream Car with Ease – Get an Auto Loan with Flexible Repayment Plans",
      route: "auto-loan"
    },
    {
      title: "Travel Loan",
      amount: "100 million",
      description: "Explore the World Without Financial Worries – Get a Travel Loan with Proof of Funds Today",
      route: "travel-loan"
    }
  ];

  // Active loans data (for demo mode)
  const activeLoans: ActiveLoan[] = [
    {
      type: "Salary Loan",
      dueDate: "Apr 30, 2025",
      dueAmount: "₦ 150,000",
      totalAmount: "₦ 1.12M",
      route: "salary-loan"
    }
  ];

  // Check if a loan is active in demo mode
  const isLoanActive = (loanTitle: string): boolean => {
    if (!isDemoMode) return false;
    return activeLoans.some(loan => loan.type === loanTitle);
  };

  // Find active loan data
  const getActiveLoanData = (loanTitle: string): ActiveLoan | undefined => {
    return activeLoans.find(loan => loan.type === loanTitle);
  };

  // Sample loan repayment data for upcoming repayments
  const upcomingRepaymentsData = [
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Salary Loan",
      outstandingBalance: "₦ 90,000",
      dueDate: "15-02-2025",
      amountDue: "₦ 40,000",
    },
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Auto Loan",
      outstandingBalance: "₦ 150,000",
      dueDate: "15-02-2025",
      amountDue: "₦ 100,000",
    },
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Working Capital",
      outstandingBalance: "₦ 150,000",
      dueDate: "15-02-2025",
      amountDue: "₦ 20,000",
    },
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Tavel Loan",
      outstandingBalance: "₦ 150,000",
      dueDate: "15-02-2025",
      amountDue: "₦ 40,000",
    },
  ];

  // Sample loan repayment data for pending approval
  const pendingApprovalData = [
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Salary Loan",
      amount: "₦ 90,000",
      submittedDate: "15-02-2025",
      status: "Application in review",
    },
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Auto Loan",
      amount: "₦ 150,000",
      submittedDate: "15-02-2025",
      status: "Pending Disbursement",
    },
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Working Capital",
      amount: "₦ 150,000",
      submittedDate: "15-02-2025",
      status: "Application in review",
    },
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Tavel Loan",
      amount: "₦ 150,000",
      submittedDate: "15-02-2025",
      status: "Pending Disbursement",
    },
  ];

  // Sample loan repayment data for completed
  const completedData = [
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Salary Loan",
      amount: "₦ 90,000",
      closedDate: "15-02-2025",
      status: "Fully Paid",
    },
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Auto Loan",
      amount: "₦ 150,000",
      closedDate: "15-02-2025",
      status: "Rejected",
    },
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Working Capital",
      amount: "₦ 150,000",
      closedDate: "15-02-2025",
      status: "Fully Paid",
    },
    {
      applicationId: "#QY737HK",
      loanId: "#DW98A",
      type: "Tavel Loan",
      amount: "₦ 150,000",
      closedDate: "15-02-2025",
      status: "Fully Paid",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Loans</h1>
          <p className="text-muted-foreground">Manage your loans from this page</p>
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

      {/* Only show loan cards grid when in demo mode */}
      {isDemoMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loanTypes.map((loan) => {
            const isActive = isLoanActive(loan.title);
            const activeLoanData = getActiveLoanData(loan.title);
            
            return isActive && activeLoanData ? (
              <ActiveLoanCard key={loan.title} loan={loan} activeLoanData={activeLoanData} />
            ) : (
              <EmptyLoanCard key={loan.title} loan={loan} />
            );
          })}
        </div>
      )}

      {/* Display loan types when not in demo mode */}
      {!isDemoMode && (
        <>
          {/* On mobile, display loan types outside the container */}
          {isMobile && (
            <>
              <div className="bg-white p-8 mb-6">
                <div className="text-center">
                  <h2 className="text-xl font-medium mb-2">You do not have any active loan</h2>
                  <p className="text-gray-500">You're all set! No active loans at the moment. Ready to explore new financing options?</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {loanTypes.map((loan) => (
                  <div key={loan.title} className="h-full">
                    <InactiveLoanCard loan={loan} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Medium and desktop view - Keep everything in one container */}
          {!isMobile && (
            <div className="bg-white p-8 mt-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-medium mb-2">You do not have any active loan</h2>
                <p className="text-gray-500">You're all set! No active loans at the moment. Ready to explore new financing options?</p>
              </div>

              <div className="bg-gray-50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loanTypes.map((loan) => (
                    <div key={loan.title} className="h-full">
                      <InactiveLoanCard loan={loan} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loans Repayment Table Section - Only show when in demo mode */}
      {isDemoMode && (
        <div className="rounded-none shadow-none border-4 border-white overflow-hidden mt-6">
          {/* Tabs for loan repayment sections */}
          <div className="border-b overflow-x-auto scrollbar-hide bg-white">
            <div className="flex">
              <button
                className={`py-3 px-6 text-sm whitespace-nowrap ${
                  activeTab === "upcoming-repayments"
                    ? "border-b-2 border-red-600 text-red-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("upcoming-repayments")}
              >
                Up coming Repayments
              </button>
              <button
                className={`py-3 px-6 text-sm whitespace-nowrap ${
                  activeTab === "pending-approval"
                    ? "border-b-2 border-red-600 text-red-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("pending-approval")}
              >
                Pending Approval
              </button>
              <button
                className={`py-3 px-6 text-sm whitespace-nowrap ${
                  activeTab === "completed"
                    ? "border-b-2 border-red-600 text-red-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Table Content based on active tab */}
          <div className="bg-white p-0">
            <div className="overflow-x-auto">
              {activeTab === "upcoming-repayments" && (
                <UpcomingRepaymentsTable data={upcomingRepaymentsData} />
              )}

              {activeTab === "pending-approval" && (
                <PendingApprovalTable data={pendingApprovalData} />
              )}

              {activeTab === "completed" && (
                <CompletedLoansTable data={completedData} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}