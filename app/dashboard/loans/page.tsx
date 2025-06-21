"use client";

import React, { useState } from "react";
import { InactiveLoanCard } from "@/components/loans/InactiveLoanCard";
import { ActiveLoanCard } from "@/components/loans/ActiveLoanCard";
import { EmptyLoanCard } from "@/components/loans/EmptyLoanCard";
import { LoanCardSkeleton } from "@/components/loans/LoanCardSkeleton";
import { UpcomingRepaymentsTable } from "@/components/loans/UpcomingRepaymentsTable";
import { PendingApprovalTable } from "@/components/loans/PendingApprovalTable";
import { CompletedLoansTable } from "@/components/loans/CompletedLoansTable";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLoans } from "@/hooks/useLoans";
import { LoanType } from "@/types/loans";

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<string>("upcoming-repayments");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { 
    isLoading, 
    loanTypesForUI, 
    activeLoansForUI, 
    hasActiveLoans, 
    upcomingRepayments, 
    pendingApprovals, 
    completedLoans 
  } = useLoans();
  
  // Check if a loan is active based on API data
  const isLoanActive = (loanTitle: string): boolean => {
    return activeLoansForUI.some(loan => loan.type === loanTitle);
  };

  // Find active loan data from API data
  const getActiveLoanData = (loanTitle: string) => {
    return activeLoansForUI.find(loan => loan.type === loanTitle);
  };

  // Loading state component
  const LoadingState = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
    </div>
  );

  // Empty state component when no loans are available
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-white p-6 border border-gray-200">
      <div className="text-gray-500 text-center">
        <h3 className="text-lg font-medium mb-2">No data available</h3>
        <p>You have no loans in this category</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Loans</h1>
          <p className="text-muted-foreground">Manage your loans from this page</p>
        </div>
      </div>

      {isLoading ? (
        <>
          {/* Loan cards skeleton grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array(4).fill(0).map((_, index) => (
              <LoanCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Loan cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loanTypesForUI.map((loan: LoanType) => {
              // Check if loan is active
              if (isLoanActive(loan.title)) {
                const activeLoanData = getActiveLoanData(loan.title);
                if (activeLoanData) {
                  return (
                    <ActiveLoanCard key={loan.title} loan={loan} activeLoanData={activeLoanData} />
                  );
                }
              }
              return (
                <EmptyLoanCard key={loan.title} loan={loan} />
              );
            })}
          </div>

          {/* Show All Loan Types if no active loans */}
          {!hasActiveLoans && loanTypesForUI.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {loanTypesForUI.map((loan: LoanType) => (
                <InactiveLoanCard key={loan.title} loan={loan} />
              ))}
            </div>
          )}

          {/* Loans Repayment Table Section */}
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
                  Upcoming Repayments
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
                  isLoading ? (
                    <UpcomingRepaymentsTable data={[]} isLoading={true} />
                  ) : upcomingRepayments.length > 0 ? (
                    <UpcomingRepaymentsTable data={upcomingRepayments} isLoading={false} />
                  ) : (
                    <EmptyState />
                  )
                )}

                {activeTab === "pending-approval" && (
                  isLoading ? (
                    <PendingApprovalTable data={[]} isLoading={true} />
                  ) : pendingApprovals.length > 0 ? (
                    <PendingApprovalTable data={pendingApprovals} isLoading={false} />
                  ) : (
                    <EmptyState />
                  )
                )}

                {activeTab === "completed" && (
                  isLoading ? (
                    <CompletedLoansTable data={[]} isLoading={true} />
                  ) : completedLoans.length > 0 ? (
                    <CompletedLoansTable data={completedLoans} isLoading={false} />
                  ) : (
                    <EmptyState />
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
