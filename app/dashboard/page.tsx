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

  // Use the useUserProfile hook to get consistent profile data
  const { profile, isLoading: profileLoading } = useUserProfile();
  
  // State for dashboard data
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

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

  // Create a function to fetch dashboard data that can be reused
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get dashboard summary
      const dashboardResponse = await dashboardApi.getDashboardSummary();
      if (dashboardResponse.success && dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
      } else {
        error("Failed to load dashboard data", dashboardResponse.message || "Please try again later");
      }
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      error("Failed to load dashboard data", err.message || "Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
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

  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Safe accessor for nested properties with null/undefined checks
  const safeValue = (obj: any, path: string, defaultValue: any = null) => {
    try {
      const result = path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
      return result !== undefined ? result : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // Filter loan payments from upcoming payments
  const loanPayments = dashboardData?.upcomingPayments?.filter(payment => 
    payment.type === "LOAN_REPAYMENT"
  ) || [];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Financial Dashboard</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">Welcome back, {profile ? `${profile.firstName} ${profile.lastName}` : 'User'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <WalletCard 
          isLoading={isLoading || profileLoading}
          isProfileComplete={!profileLoading && profile !== null}
          showBalance={showWalletBalance}
          toggleShowBalance={() => setShowWalletBalance(!showWalletBalance)}
          walletBalance={safeValue(dashboardData, 'wallet.balance', 0)}
          userName={profile ? `${profile.firstName} ${profile.lastName}` : 'User'}
          onHistoryClick={handleHistoryClick}
          onFundClick={() => fetchDashboardData()} // Refresh data after successful funding
          onWithdrawClick={() => info("Withdrawal request", "Processing your withdrawal request")}
          onCompleteProfileClick={handleCompleteProfile}
        />

        {/* Investment Card */}
        <InvestmentCard 
          isLoading={isLoading}
          isProfileComplete={!profileLoading && profile !== null}
          showBalance={showInvestmentBalance}
          toggleShowBalance={() => setShowInvestmentBalance(!showInvestmentBalance)}
          totalInvested={safeValue(dashboardData, 'investments.totalInvested', 0)}
          totalReturns={safeValue(dashboardData, 'investments.totalReturns', 0)}
          activeInvestments={safeValue(dashboardData, 'investments.activeInvestments', 0)}
          onCreateInvestmentClick={() => {
                  info("Opening investment options", "Choose your preferred investment type");
                  setShowCreateInvestmentModal(true);
                }}
          onViewInvestmentsClick={() => router.push('/dashboard/investments')}
          onCompleteProfileClick={handleCompleteProfile}
        />

        {/* Loan Card */}
        <LoanCard 
          isLoading={isLoading}
          isProfileComplete={!profileLoading && profile !== null}
          showBalance={showLoanBalance}
          toggleShowBalance={() => setShowLoanBalance(!showLoanBalance)}
          outstandingAmount={safeValue(dashboardData, 'loans.outstandingAmount', 0)}
          activeLoans={safeValue(dashboardData, 'loans.activeLoans', 0)}
          nextPaymentAmount={safeValue(dashboardData, 'loans.latestLoan.nextPaymentAmount', 0)}
          nextPaymentDate={safeValue(dashboardData, 'loans.latestLoan.nextPaymentDate')}
          onRepaymentsClick={handleRepaymentsClick}
          onRepayClick={() => router.push('/dashboard/loans')}
          onApplyForLoanClick={() => {
                    info("Redirecting to loan application", "Choose from our available loan options");
                    router.push('/dashboard/loans');
                  }}
          onCompleteProfileClick={handleCompleteProfile}
        />
      </div>

      {/* Investments Table - Only show when there are active investments */}
      {!profileLoading && profile !== null && safeValue(dashboardData, 'investments.activeInvestments', 0) > 0 && (
        <InvestmentsTable 
          isLoading={isLoading}
          investments={safeValue(dashboardData, 'investments.recentInvestments', [])}
          activeInvestments={safeValue(dashboardData, 'investments.activeInvestments', 0)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onViewInvestment={handleViewInvestment}
        />
      )}

      {/* Loan Payments Table - Only show when there are active loans */}
      {!profileLoading && profile !== null && safeValue(dashboardData, 'loans.activeLoans', 0) > 0 && (
        <LoanPaymentsTable 
          isLoading={isLoading}
          payments={loanPayments}
          activeLoans={safeValue(dashboardData, 'loans.activeLoans', 0)}
          onViewLoans={() => router.push('/dashboard/loans')}
          onRepayLoan={handleRepayLoan}
        />
      )}

      {/* Create Investment Modal */}
      {showCreateInvestmentModal && (
        <CreateNewInvestmentModal 
          investmentTypes={investmentTypes}
          onClose={() => setShowCreateInvestmentModal(false)}
        />
      )}
    </>
  );
}