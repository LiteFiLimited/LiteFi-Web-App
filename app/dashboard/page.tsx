"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RxEyeClosed } from "react-icons/rx";
import { VscEye } from "react-icons/vsc";
import { FaCheck } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import CreateNewInvestmentModal from "@/app/components/CreateNewInvestmentModal";
import CopyButton from "@/app/components/CopyButton";
import { useToastContext } from "@/app/components/ToastProvider";
import { dashboardApi, userApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEligibility } from "@/app/components/EligibilityProvider";

// Import our new components
import { WalletCard } from "@/components/dashboard/WalletCard";
import { InvestmentCard } from "@/components/dashboard/InvestmentCard";
import { LoanCard } from "@/components/dashboard/LoanCard";
import { InvestmentsTable } from "@/components/dashboard/InvestmentsTable";
import { LoanPaymentsTable } from "@/components/dashboard/LoanPaymentsTable";

// Define the InvestmentType interface
interface InvestmentType {
  title: string;
  description: string;
  route: string;
  icon: string;
}

// Define interfaces for dashboard data
interface DashboardData {
  wallet?: {
    balance: number;
    currency: string;
    lastTransaction?: {
      id: string;
      type: string;
      amount: number;
      status: string;
      createdAt: string;
    };
  };
  investments?: {
    totalInvested: number;
    activeInvestments: number;
    totalReturns: number;
    recentInvestments?: Array<{
      id: string;
      name: string;
      amount: number;
      status: string;
      maturityDate: string;
      expectedReturns: number;
    }>;
    latestInvestment?: {
      id: string;
      name: string;
      amount: number;
      status: string;
      maturityDate: string;
    };
  };
  loans?: {
    totalBorrowed: number;
    activeLoans: number;
    outstandingAmount: number;
    latestLoan?: {
      id: string;
      type: string;
      amount: number;
      status: string;
      nextPaymentDate: string;
      nextPaymentAmount: number;
    };
  };
  upcomingPayments?: Array<{
    id: string;
    type: string;
    loanId?: string;
    investmentId?: string;
    reference?: string;
    amount: number;
    dueDate: string;
    status: string;
  }>;
}

// User interface from login response
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function DashboardPage() {
  const [showWalletBalance, setShowWalletBalance] = useState(false);
  const [showInvestmentBalance, setShowInvestmentBalance] = useState(false);
  const [showLoanBalance, setShowLoanBalance] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateInvestmentModal, setShowCreateInvestmentModal] = useState(false);
  const router = useRouter();
  const { success, error, info } = useToastContext();
  const { checkEligibility } = useEligibility();

  // Use the useUserProfile hook to get consistent profile data
  const { profile, isLoading: profileLoading } = useUserProfile();
  
  // Debug profile data
  useEffect(() => {
    console.log('Dashboard profile data:', {
      profile,
      profileLoading,
      hasFirstName: profile?.firstName,
      hasLastName: profile?.lastName,
      fullProfileObject: profile
    });
  }, [profile, profileLoading]);
  
  // State for eligibility status
  const [isLoading, setIsLoading] = useState(true);
  const [investmentEligible, setInvestmentEligible] = useState(false);
  const [loanEligible, setLoanEligible] = useState(false);
  
  // We're no longer using dashboardData - we'll get individual component data from their respective APIs
  const [walletBalance, setWalletBalance] = useState(0);

  // Investment types data - same structure as in the investments page
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

  // Create a function to check eligibility status
  const checkEligibilityStatus = async () => {
    setIsLoading(true);
    try {
      // Get eligibility status for both investment and loan
      const eligibilityResponse = await userApi.getEligibilityStatus();
      if (eligibilityResponse.success && eligibilityResponse.data) {
        setInvestmentEligible(eligibilityResponse.data.investment.complete);
        setLoanEligible(eligibilityResponse.data.loan.complete);
      } else {
        error("Failed to load eligibility status", eligibilityResponse.message || "Please try again later");
      }
      
      // Get wallet balance (this is still needed for the wallet card)
      try {
        const walletResponse = await userApi.getWalletBalance();
        if (walletResponse.success && walletResponse.data) {
          setWalletBalance(walletResponse.data.balance);
        }
      } catch (walletErr) {
        console.error("Error fetching wallet balance:", walletErr);
      }
    } catch (err: any) {
      console.error("Error fetching eligibility data:", err);
      error("Failed to load profile data", err.message || "Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  // Check eligibility status on component mount
  useEffect(() => {
    checkEligibilityStatus();
  }, []);

  // Helper function to determine status styling
  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'on track':
      case 'active':
      case 'completed':
        return 'text-green-600';
      case 'overdue':
      case 'pending':
        return 'text-orange-500';
      case 'failed':
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Navigation handlers
  const handleCompleteProfile = () => {
    info("Redirecting to profile setup", "Complete your profile to unlock all features");
    router.push('/dashboard/profile');
  };
  
  const handleHistoryClick = () => {
    info("Viewing transaction history", "Redirecting to wallet page");
    router.push('/dashboard/wallet');
  };

  const handleRepaymentsClick = () => {
    info("Viewing loan repayments", "Redirecting to loans page");
    router.push('/dashboard/loans');
  };

  const handleViewInvestment = (id: string) => {
    router.push(`/dashboard/investments/${id}`);
  };

  const handleRepayLoan = (id: string) => {
    router.push(`/dashboard/loans/${id}`);
  };

  // We no longer need the formatDate function since we're not displaying 
  // the tables with dates anymore

  // We no longer need the safe accessor function or to filter loan payments
  // since we're no longer using dashboardData

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Financial Dashboard</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Welcome back, {
          profile && profile.firstName && profile.lastName 
            ? `${profile.firstName} ${profile.lastName}` 
            : profile && (profile.firstName || profile.lastName)
            ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
            : profileLoading 
            ? 'Loading...' 
            : 'User'
        }
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <WalletCard 
          isLoading={isLoading || profileLoading}
          isProfileComplete={!profileLoading && profile !== null}
          showBalance={showWalletBalance}
          toggleShowBalance={() => setShowWalletBalance(!showWalletBalance)}
          walletBalance={walletBalance}
          userName={
            profile && profile.firstName && profile.lastName 
              ? `${profile.firstName} ${profile.lastName}` 
              : profile && (profile.firstName || profile.lastName)
              ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
              : 'User'
          }
          onHistoryClick={handleHistoryClick}
          onFundClick={() => checkEligibilityStatus()} // Refresh data after successful funding
          onWithdrawClick={() => info("Withdrawal request", "Processing your withdrawal request")}
          onCompleteProfileClick={handleCompleteProfile}
        />

        {/* Investment Card */}
        <InvestmentCard 
          isLoading={isLoading}
          isProfileComplete={investmentEligible}
          showBalance={showInvestmentBalance}
          toggleShowBalance={() => setShowInvestmentBalance(!showInvestmentBalance)}
          totalInvested={0} // No longer coming from dashboardData
          totalReturns={0}  // No longer coming from dashboardData
          activeInvestments={0} // No longer coming from dashboardData
          onCreateInvestmentClick={async () => {
                  const isEligible = await checkEligibility('investment');
                  if (isEligible) {
                    info("Opening investment options", "Choose your preferred investment type");
                    setShowCreateInvestmentModal(true);
                  }
                }}
          onViewInvestmentsClick={async () => {
                  await checkEligibility('investment');
                  router.push('/dashboard/investments');
                }}
          onCompleteProfileClick={handleCompleteProfile}
        />

        {/* Loan Card */}
        <LoanCard 
          isLoading={isLoading}
          isProfileComplete={loanEligible}
          showBalance={showLoanBalance}
          toggleShowBalance={() => setShowLoanBalance(!showLoanBalance)}
          outstandingAmount={0} // No longer coming from dashboardData
          activeLoans={0} // No longer coming from dashboardData
          nextPaymentAmount={0} // No longer coming from dashboardData
          nextPaymentDate={undefined}
          onRepaymentsClick={handleRepaymentsClick}
          onRepayClick={() => router.push('/dashboard/loans')}
          onApplyForLoanClick={async () => {
                    await checkEligibility('loan');
                    router.push('/dashboard/loans');
                  }}
          onCompleteProfileClick={handleCompleteProfile}
        />
      </div>

      {/* We've removed the investments and loan payments tables since we're 
      no longer using dashboardData. The user will need to go to the specific
      pages to view their investments and loans. */}

      {/* Create Investment Modal */}
      {showCreateInvestmentModal && (
        <CreateNewInvestmentModal 
          investmentTypes={investmentTypes}
          onCloseAction={() => setShowCreateInvestmentModal(false)}
        />
      )}
    </>
  );
}