"use client";

import React, { useState, useEffect } from "react";
import { InactiveLoanCard } from "@/components/loans/InactiveLoanCard";
import { ActiveLoanCard } from "@/components/loans/ActiveLoanCard";
import { EmptyLoanCard } from "@/components/loans/EmptyLoanCard";
import { PendingLoanCard } from "@/components/loans/PendingLoanCard";
import { LoanCardSkeleton } from "@/components/loans/LoanCardSkeleton";
import { UpcomingRepaymentsTable } from "@/components/loans/UpcomingRepaymentsTable";
import { PendingApprovalTable } from "@/components/loans/PendingApprovalTable";
import { CompletedLoansTable } from "@/components/loans/CompletedLoansTable";
import { EmptyState } from "@/components/loans/EmptyState";
import { LoanType, ActiveLoan, Loan, LoanProduct } from "@/types/loans";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLoans } from "@/hooks/useLoans";
import { useEligibility } from "@/app/components/EligibilityProvider";

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<string>("upcoming-repayments");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { checkEligibility } = useEligibility();
  
  const { 
    loanTypesForUI: loanTypes, 
    activeLoansForUI: activeLoans,
    upcomingRepayments,
    pendingApprovals,
    completedLoans,
    loans,
    isLoading,
    fetchLoans,
    fetchLoanProducts
  } = useLoans();
  
  // Check eligibility when component mounts
  useEffect(() => {
    const checkLoanEligibility = async () => {
      await checkEligibility('loan');
    };
    
    checkLoanEligibility();
  }, [checkEligibility]);
  
  // Load initial data
  useEffect(() => {
    fetchLoanProducts();
    fetchLoans();
  }, []);
  
  // Get loan status by loan type
  const getLoanStatus = (loanTitle: string): { isActive: boolean; isPending: boolean; status: string; loanId: string } => {
    // Find the loan by title
    if (loans && loans.length > 0) {
      const matchingLoan = loans.find(loan => {
        const loanType = loan.product?.type;
        return loanType === loanTitle.toUpperCase().replace(' ', '_');
      });
      
      if (matchingLoan) {
        return {
          isActive: matchingLoan.status === 'ACTIVE',
          isPending: matchingLoan.status === 'PENDING' || matchingLoan.status === 'APPROVED', 
          status: matchingLoan.status,
          loanId: matchingLoan.id
        };
      }
    }
    
    return { isActive: false, isPending: false, status: '', loanId: '' };
  };
  
  // Find active/pending loan data
  const getLoanData = (loanTitle: string): { data: any; status: string; loanId: string; nextRepaymentDate?: string } | undefined => {
    // Find the loan from API data
    if (loans && loans.length > 0) {
      const matchingLoan = loans.find(loan => {
        const loanType = loan.product?.type;
        return loanType === loanTitle.toUpperCase().replace(' ', '_');
      });
      
      if (matchingLoan) {
        // Get next repayment date if available
        let nextRepaymentDate: string | undefined;
        if (matchingLoan.repayments && matchingLoan.repayments.length > 0) {
          const pendingRepayments = matchingLoan.repayments
            .filter(rep => rep.status === 'PENDING')
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
            
          if (pendingRepayments.length > 0) {
            nextRepaymentDate = pendingRepayments[0].dueDate;
          }
        }
        
        // Format data to match the expected interface for ActiveLoan
        if (matchingLoan.status === 'ACTIVE') {
          const loanAmount = matchingLoan.amount;
          const formattedAmount = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
          }).format(loanAmount);
          
          // Calculate monthly payment if duration is available
          const monthlyPayment = matchingLoan.duration 
            ? loanAmount / matchingLoan.duration 
            : 0;
          
          const formattedMonthlyPayment = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
          }).format(monthlyPayment);
          
          return {
            data: {
              type: loanTitle,
              dueDate: matchingLoan.dueDate || 'N/A',
              dueAmount: formattedMonthlyPayment,
              totalAmount: formattedAmount,
              route: 'repay'
            },
            status: matchingLoan.status,
            loanId: matchingLoan.id,
            nextRepaymentDate
          };
        } else if (matchingLoan.status === 'PENDING' || matchingLoan.status === 'APPROVED') {
          const loanAmount = matchingLoan.amount;
          const formattedAmount = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
          }).format(loanAmount);
          
          return {
            data: {
              amount: formattedAmount,
              submittedDate: new Date(matchingLoan.createdAt).toLocaleDateString()
            },
            status: matchingLoan.status,
            loanId: matchingLoan.id
          };
        }
      }
    }
    
    return undefined;
  };

  // Use data directly from the useLoans hook for all components
  // Fallback loan types in case the API doesn't return any
  const fallbackLoanTypes: LoanType[] = [
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
  
  // Use fallback loan types if API returns empty array
  const displayLoanTypes = loanTypes && loanTypes.length > 0 ? loanTypes : fallbackLoanTypes;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Loans</h1>
          <p className="text-muted-foreground">Manage your loans from this page</p>
        </div>
      </div>

      {/* Loan cards grid - Show for both demo mode and real mode */}
      {!isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loanTypes.map((loan) => {
            // Check if this loan type has an active or pending instance
            const status = getLoanStatus(loan.title);
            const loanData = getLoanData(loan.title);
            
            if (isLoading) {
              return <LoanCardSkeleton key={loan.title} />;
            }
            
            // If there's an active loan of this type
            if (status.isActive && loanData && loanData.status === 'ACTIVE') {
              return (
                <ActiveLoanCard 
                  key={loan.title} 
                  loan={loan} 
                  activeLoanData={loanData.data} 
                  loanId={loanData.loanId}
                  nextRepaymentDate={loanData.nextRepaymentDate}
                />
              );
            } 
            // If there's a pending loan of this type
            else if (status.isPending && loanData) {
              return (
                <PendingLoanCard 
                  key={loan.title} 
                  loan={loan}
                  status={loanData.status}
                  submittedDate={loanData.data.submittedDate}
                  amount={loanData.data.amount}
                  loanId={loanData.loanId}
                />
              );
            } 
            // If no loan of this type exists
            else {
              return <EmptyLoanCard key={loan.title} loan={loan} isLoading={isLoading} />;
            }
          })}
        </div>
      ) : (
        // Skeleton loaders while loading
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <LoanCardSkeleton key={i} />
          ))}
        </div>
      )}
      
      {/* Empty state - Show when no loans are active */}
      {!isLoading && loans.length === 0 && (
        <>
          {/* Text header for both mobile and desktop */}
          <div className="bg-white text-center p-8 mb-6">
            <h2 className="text-xl font-medium mb-2">You do not have any active loan</h2>
            <p className="text-gray-500">You're all set! No active loans at the moment. Ready to explore new financing options?</p>
          </div>
          
          {/* Loan cards - different layouts for mobile and desktop */}
          {isMobile ? (
            <div className="space-y-4">
              {displayLoanTypes.map((loan) => (
                <div key={loan.title} className="h-full">
                  <InactiveLoanCard loan={loan} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayLoanTypes.map((loan) => (
                <div key={loan.title} className="h-full">
                  <InactiveLoanCard loan={loan} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Loans Repayment Table Section - Show only when there are active loans */}
      {!isLoading && loans.length > 0 && (
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
                <div className="py-8">
                  {/* Skeleton loader for table */}
                  <div className="animate-pulse mx-6">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ) : upcomingRepayments.length > 0 ? (
                <UpcomingRepaymentsTable data={upcomingRepayments} />
              ) : (
                <div className="py-8 px-6">
                  <EmptyState 
                    type="loan"
                    title="No upcoming repayments" 
                    message="You don't have any upcoming loan repayments at the moment."
                    loanTypes={loanTypes}
                    showLoanTypes={false}
                  />
                </div>
              )
            )}

            {activeTab === "pending-approval" && (
              isLoading ? (
                <div className="py-8">
                  {/* Skeleton loader for table */}
                  <div className="animate-pulse mx-6">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ) : pendingApprovals.length > 0 ? (
                <PendingApprovalTable data={pendingApprovals} />
              ) : (
                <div className="py-8 px-6">
                  <EmptyState 
                    type="loan"
                    title="No pending loan applications" 
                    message="You don't have any loan applications waiting for approval."
                    buttonText="Apply for a Loan"
                    buttonLink="/dashboard/loans"
                    loanTypes={loanTypes}
                    showLoanTypes={false}
                  />
                </div>
              )
            )}

            {activeTab === "completed" && (
              isLoading ? (
                <div className="py-8">
                  {/* Skeleton loader for table */}
                  <div className="animate-pulse mx-6">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ) : completedLoans.length > 0 ? (
                <CompletedLoansTable data={completedLoans} isLoading={isLoading} />
              ) : (
                <div className="py-8 px-6">
                  <EmptyState 
                    type="loan"
                    title="No completed loans" 
                    message="You don't have any fully paid or rejected loans yet."
                    loanTypes={loanTypes}
                    showLoanTypes={false}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
