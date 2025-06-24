"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { RxEyeClosed } from "react-icons/rx";
import { VscEye } from "react-icons/vsc";
import { CHART_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import CopyButton from "@/app/components/CopyButton";
import { useToastContext } from "@/app/components/ToastProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { walletApi } from "@/lib/walletApi";
import { useUserProfile } from "@/hooks/useUserProfile";
import { formatCurrency } from "@/lib/utils";
import axios from "axios";

// Add this utility function at the top of the file after imports
function formatDate(dateString: string) {
  // Force a specific locale and format to ensure consistency between server and client
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
}

// Time period mapping for API

// Time period options for the dropdown
const timePeriodOptions = [
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "3-months", label: "Last 3 months" },
  { value: "6-months", label: "Last 6 months" },
  { value: "1-year", label: "Last year" }
];
 
// Interface for API transaction data
interface TransactionData {
  id: string;
  reference: string;
  type: string;
  amount: number;
  fee: number;
  status: string;
  description: string;
  createdAt: string;
  completedAt?: string;
  balance?: number; // This may need to be calculated or fetched separately
}

export default function WalletPage() {
  const [showWalletBalance, setShowWalletBalance] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("this-month");
  const [isLoading, setIsLoading] = useState(true);
  const [walletData, setWalletData] = useState<{
    id: string;
    balance: number;
    currency: string;
  } | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [chartIsLoading, setChartIsLoading] = useState(true);
  const [walletActivity, setWalletActivity] = useState<{
    totalInflow: number;
    totalOutflow: number;
    weeklyActivity: {
      week: string;
      inflow: number;
      outflow: number;
    }[];
  } | null>(null);
  const { profile, isLoading: profileLoading } = useUserProfile();
  const isProfileComplete = !profileLoading && profile !== null;
  const { success, error, info } = useToastContext();
  const router = useRouter();
  
  // Map time period options to API period parameter
  const timePeriodMapping: Record<string, "week" | "month" | "year"> = {
    "this-month": "week",
    "last-month": "week",
    "3-months": "month",
    "6-months": "month",
    "1-year": "year"
  };

  // Fetch wallet balance and transactions
  useEffect(() => {
    fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Fetch wallet activity for charts
  useEffect(() => {
    async function fetchWalletActivity() {
      try {
        setChartIsLoading(true);
        const period = timePeriodMapping[selectedTimePeriod];
        const activityResponse = await walletApi.getWalletActivity(period);
        if (activityResponse.status === 'success') {
          setWalletActivity(activityResponse.data);
        }
      } catch (err) {
        console.error("Error fetching wallet activity data:", err);
        error("Failed to load chart data. Please try again later.");
      } finally {
        setChartIsLoading(false);
      }
    }
    
    fetchWalletActivity();
  }, [selectedTimePeriod, error]);

  // Helper function to determine status styling
  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'successful':
      case 'completed':
        return 'text-green-600';
      case 'pending':
      case 'processing':
        return 'text-orange-500';
      case 'failed':
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleCompleteProfile = () => {
    info("Redirecting to profile setup", "Complete your profile to unlock all features");
    router.push('/dashboard/profile');
  };
  
  // Create a function to fetch wallet data that can be reused
  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const walletResponse = await walletApi.getWalletBalance();
      if (walletResponse.success) {
        setWalletData({
          id: walletResponse.data.id,
          balance: walletResponse.data.balance,
          currency: walletResponse.data.currency
        });
      }
      
      const transactionsResponse = await walletApi.getTransactions(currentPage, 10);
      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.data.transactions);
        setPagination(transactionsResponse.data.pagination);
      }
    } catch (err) {
      error("Failed to load wallet data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful Mono funding callback
  const handleFundSuccess = () => {
    // Display success message
    success("Payment successful", "Your wallet has been funded");
    // Refresh wallet data after successful funding
    fetchWalletData();
  };
  
  const handleWithdraw = () => {
    info("Withdrawal request", "Processing your withdrawal request");
    // Add the withdrawal logic here
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Wallet</h1>
      <p className="text-muted-foreground mb-6">
        An overview of all your spendings
      </p>

      {/* Grid for wallet balance and weekly chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Balance Card */}
        <WalletCard
          isLoading={isLoading}
          isProfileComplete={isProfileComplete}
          showBalance={showWalletBalance}
          toggleShowBalance={() => setShowWalletBalance(!showWalletBalance)}
          walletBalance={walletData?.balance || 0}
          userName={profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'User'}
          onHistoryClick={() => {}}
          onFundClick={handleFundSuccess}
          onWithdrawClick={handleWithdraw}
          onCompleteProfileClick={handleCompleteProfile}
        />

        {/* Weekly Chart */}
        <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-white">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Weekly Wallet Activity</h3>
              <Select
                value={selectedTimePeriod}
                onValueChange={setSelectedTimePeriod}
              >
                <SelectTrigger className="text-xs border border-gray-200 h-auto px-3 py-1 rounded-full hover:bg-gray-100 transition-colors w-auto gap-1">
                  <SelectValue placeholder="This month" />
                </SelectTrigger>
                <SelectContent>
                  {timePeriodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-6">
              <div className="text-lg font-medium">
                {
                  selectedTimePeriod === "this-month" ? "June 2025" :
                  selectedTimePeriod === "last-month" ? "May 2025" :
                  selectedTimePeriod === "3-months" ? "Last 3 months" :
                  selectedTimePeriod === "6-months" ? "Last 6 months" : "Last year"
                }
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            {chartIsLoading ? (
              <div className="animate-pulse flex flex-col space-y-4 h-[300px]">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-64 bg-gray-200 rounded"></div>
                <div className="flex justify-between">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : walletActivity ? (
              <>
                <Chart 
                  data={walletActivity.weeklyActivity}
                  xAxisDataKey="week"
                  bars={[
                    { dataKey: "inflow", color: CHART_COLORS.purple, name: "Inflow" },
                    { dataKey: "outflow", color: CHART_COLORS.orange, name: "Outflow" }
                  ]}
                  height={300}
                  className="mt-2"
                  yAxisFormatter={(value: number) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value.toString();
                  }}
                  hideLegend={true}
                />
                
                {/* Chart summary moved below the chart and displayed horizontally */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.purple }}></div>
                    <span className="text-gray-600">Inflow</span>
                    <span className="text-lg font-bold ml-2">₦ {formatCurrency(walletActivity.totalInflow)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.orange }}></div>
                    <span className="text-gray-600">Outflow</span>
                    <span className="text-lg font-bold ml-2">₦ {formatCurrency(walletActivity.totalOutflow)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <p className="text-gray-500">No activity data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Transactions - now spans full width */}
      <Card className="rounded-none shadow-none border-4 border-white overflow-hidden md:col-span-2 mt-6">
        <div className="bg-gray-50 p-6 border-b border-white">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Recent Transactions</h3>
            <Button 
              variant="outline" 
              className="rounded-none h-9 bg-white hover:bg-gray-50 text-xs"
            >
              Download statement
            </Button>
          </div>
        </div>
        <div className="bg-white p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <p className="text-gray-500">No transactions found</p>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">
                        <div>
                          <div className="font-medium text-base">
                            {transaction.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusStyle(transaction.status)}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <div className={`font-bold ${transaction.type === 'DEPOSIT' || transaction.type === 'LOAN_DISBURSEMENT' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'DEPOSIT' || transaction.type === 'LOAN_DISBURSEMENT' ? '+' : '-'} ₦ {formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold">
                          {transaction.balance !== undefined ? `₦ ${formatCurrency(transaction.balance)}` : '-'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-gray-100">
            {transactions.length > 0 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }} 
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {/* Generate page numbers dynamically */}
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                    // If total pages <= 5, show all pages
                    // If total pages > 5, show first 3, ellipsis, last page
                    let pageNum = i + 1;
                    
                    // If we're on later pages, adjust which page numbers to show
                    if (pagination.pages > 5 && currentPage > 3) {
                      if (i === 0) {
                        pageNum = 1;
                      } else if (i === 1 && currentPage > 4) {
                        return (
                          <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      } else {
                        pageNum = Math.min(
                          currentPage + i - 2, 
                          pagination.pages - (4 - i)
                        );
                      }
                    }
                    
                    // Show ellipsis before last page if many pages
                    if (pagination.pages > 5 && i === 3 && pageNum < pagination.pages - 1) {
                      return (
                        <PaginationItem key="ellipsis-end">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    // For the last position, always show the last page if many pages
                    if (pagination.pages > 5 && i === 4) {
                      pageNum = pagination.pages;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href="#"
                          isActive={currentPage === pageNum}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < pagination.pages) setCurrentPage(currentPage + 1);
                      }} 
                      className={currentPage === pagination.pages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}