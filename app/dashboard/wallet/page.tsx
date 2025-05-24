"use client";

import { useState } from "react";
import Image from "next/image";
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

// Add this utility function at the top of the file after imports
function formatDate(dateString: string) {
  // Force a specific locale and format to ensure consistency between server and client
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
}

// Updated sample data for the chart with proper range values
const chartData = [
  {
    week: "Week 1",
    inflow: 400000,
    outflow: 240000,
  },
  {
    week: "Week 2",
    inflow: 300000,
    outflow: 198000,
  },
  {
    week: "Week 3",
    inflow: 200000,
    outflow: 100000,
  },
  {
    week: "Week 4",
    inflow: 600000,
    outflow: 380000,
  },
];

// Time period options for the dropdown
const timePeriodOptions = [
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "3-months", label: "Last 3 months" },
  { value: "6-months", label: "Last 6 months" },
  { value: "1-year", label: "Last year" }
];
 
// Sample transaction data
const transactionData = [
  {
    id: 1,
    type: "Withdrawal",
    description: "For personal expenses",
    status: "Pending",
    amount: "-100,000",
    date: "2025-04-15",
    balance: "1,200,000"
  },
  {
    id: 2,
    type: "Withdrawal",
    description: "To buy new gadgets",
    status: "Successful",
    amount: "-200,000",
    date: "2025-04-15",
    balance: "1,200,000"
  },
  {
    id: 3,
    type: "Account deposit",
    description: "To fund my account",
    status: "Successful",
    amount: "+1,200,000",
    date: "2025-04-15",
    balance: "1,200,000"
  },
  {
    id: 4,
    type: "Account deposit",
    description: "To fund my account",
    status: "Successful",
    amount: "+500,000",
    date: "2025-04-15",
    balance: "1,200,000"
  },
  {
    id: 5,
    type: "Account deposit",
    description: "To fund my account",
    status: "Successful",
    amount: "+1,200,000",
    date: "2025-04-15",
    balance: "1,200,000"
  },
  {
    id: 6,
    type: "Withdrawal",
    description: "Emergency funds", // Updated from "-"
    status: "Failed",
    amount: "-",
    date: "2025-04-15",
    balance: "-"
  },
];

export default function WalletPage() {
  const [showWalletBalance, setShowWalletBalance] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("this-month");
  const { success, error, info } = useToastContext();
  
  // Current month and total values for the chart summary
  const currentMonth = "April 2025";
  const inflowTotal = "18,883,902";
  const outflowTotal = "17,932,032";

  // Helper function to determine status styling
  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'successful':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-500';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
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
        <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
          <div className="bg-gray-50 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Your wallet balance</h3>
            <div className="flex items-center gap-2 mb-8">
              <div className="text-[32px] font-bold">
                {showWalletBalance ? "₦ 11,200,392" : "*****"}<span className="text-gray-500 font-bold text-lg">.00</span>
              </div>
              <button 
                onClick={() => setShowWalletBalance(!showWalletBalance)}
                className="text-gray-500 flex items-center hover:text-gray-700 transition-colors"
              >
                {showWalletBalance ? <VscEye size={20} /> : <RxEyeClosed size={20} />}
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => success("Funding initiated", "Redirecting to Mono for secure payment")}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Fund with Mono
              </button>
              <button 
                onClick={() => info("Withdrawal request", "Processing your withdrawal request")}
                className="flex-1 bg-white text-gray-800 px-4 py-3 rounded-none text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="text-sm text-gray-500">
              <p className="mb-1">You can also fund account using the details below</p>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <span className="text-gray-500">Acc name:</span> <span className="font-bold text-black">John Doe</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-1">Acc no:</span> <span className="font-bold text-black">3588020135</span>
                  <CopyButton
                    textToCopy="3588020135"
                    onCopySuccess={() => success("Account number copied to clipboard")}
                    onCopyError={() => error("Failed to copy account number")}
                    className="ml-2"
                  />
                </div>
                <div>
                  <span className="text-gray-500">Bank:</span> <span className="font-bold text-black">LiteFi MFB</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

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
                {currentMonth}
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            <Chart 
              data={chartData}
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
                <span className="text-lg font-bold ml-2">{inflowTotal}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.orange }}></div>
                <span className="text-gray-600">Outflow</span>
                <span className="text-lg font-bold ml-2">{outflowTotal}</span>
              </div>
            </div>
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
                {transactionData.map((transaction) => (
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
                        <div className={`font-bold ${transaction.amount.startsWith('+') ? 'text-green-600' : transaction.amount !== '-' ? 'text-red-600' : ''}`}>
                          {transaction.amount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold">
                        {transaction.balance}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-gray-100">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(Math.max(1, currentPage - 1));
                    }} 
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink 
                    href="#"
                    isActive={currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink 
                    href="#"
                    isActive={currentPage === 2}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(2);
                    }}
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink 
                    href="#"
                    isActive={currentPage === 3}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(3);
                    }}
                  >
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(currentPage + 1);
                    }} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Card>
    </>
  );
}