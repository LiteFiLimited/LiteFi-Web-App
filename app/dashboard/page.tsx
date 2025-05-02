"use client";

import { useState } from "react";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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

export default function DashboardPage() {
  const [showWalletBalance, setShowWalletBalance] = useState(false);
  const [showInvestmentBalance, setShowInvestmentBalance] = useState(false);
  const [showLoanBalance, setShowLoanBalance] = useState(false);
  const [selectedInvestmentPeriod, setSelectedInvestmentPeriod] = useState("week");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Demo Profile Status Toggle - in real app this would come from backend
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Time period options for the investment dropdown
  const investmentPeriodOptions = [
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "quarter", label: "This quarter" },
    { value: "year", label: "This year" }
  ];

  // Sample investment data
  const investmentData = [
    {
      id: 1,
      name: "House rent",
      principalAmount: "₦ 1,400,000",
      earning: "₦ 14,000",
      tenure: "24 months",
      startDate: "12.05.2025",
      maturityDate: "12.05.2027",
      progress: 60
    },
    {
      id: 2,
      name: "Vacation in Bali",
      principalAmount: "₦ 500,000",
      earning: "₦ 4,000",
      tenure: "32 months",
      startDate: "12.05.2025",
      maturityDate: "12.05.2027",
      progress: 10
    },
    {
      id: 3,
      name: "Short term savings",
      principalAmount: "₦ 100,000",
      earning: "₦ 1,300",
      tenure: "12 months",
      startDate: "12.05.2025",
      maturityDate: "12.05.2027",
      progress: 100
    }
  ];

  // Sample loan payment data
  const loanPaymentData = [
    {
      id: 1,
      type: "Salary Loan",
      dueDate: "12.05.2025",
      amount: "₦ 40,000",
      tenure: "24 months",
      status: "Overdue"
    },
    {
      id: 2,
      type: "Working Capital Loan",
      dueDate: "12.05.2025",
      amount: "₦ 5,000",
      tenure: "32 months",
      status: "On track"
    },
    {
      id: 3,
      type: "Auto Loan",
      dueDate: "12.05.2025",
      amount: "₦ 10,000",
      tenure: "12 months",
      status: "On track"
    }
  ];

  // Helper function to determine status styling
  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'on track':
        return 'text-green-600';
      case 'overdue':
        return 'text-orange-500';
      default:
        return 'text-gray-600';
    }
  };

  // Navigation handlers
  const handleCompleteProfile = () => {
    router.push('/dashboard/profile');
  };
  
  const handleHistoryClick = () => {
    router.push('/dashboard/wallet');
  };

  const handleRepaymentsClick = () => {
    router.push('/dashboard/loans');
  };

  const handleViewInvestment = (id: number) => {
    router.push(`/dashboard/investments/${id}`);
  };

  return (
    <>
      {/* Replace Profile Status Toggle with Demo Mode Switch */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Financial Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Label htmlFor="demo-mode" className="text-sm text-gray-500">
            Demo Mode
          </Label>
          <Switch
            id="demo-mode"
            checked={isProfileComplete}
            onCheckedChange={setIsProfileComplete}
          />
        </div>
      </div>
      
      <p className="text-muted-foreground mb-6">Welcome back, Andrew tate</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-white">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Your wallet balance</h3>
              <button 
                onClick={handleHistoryClick}
                className="text-xs border border-gray-200 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
              >
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
                {showWalletBalance ? "₦ 11,200,392.00" : "*****"}
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
              <button className="flex-1 bg-white text-gray-800 px-4 py-3 rounded-none text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors">
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
                  <button className="ml-2 hover:opacity-70 transition-opacity">
                    <Image
                      src="/assets/svgs/copy.svg"
                      alt="Copy"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
                <div>
                  <span className="text-gray-500">Bank:</span> <span className="font-bold text-black">LiteFi MFB</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Investment Portfolio Card */}
        <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-white">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Your Investment Portfolio</h3>
              <Select
                value={selectedInvestmentPeriod}
                onValueChange={setSelectedInvestmentPeriod}
              >
                <SelectTrigger className="text-xs border border-gray-200 h-auto px-3 py-1 rounded-full hover:bg-gray-100 transition-colors w-auto gap-1">
                  <SelectValue placeholder="This week" />
                </SelectTrigger>
                <SelectContent>
                  {investmentPeriodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <div className="flex space-x-2">
              <button 
                onClick={() => router.push('/dashboard/investments/create')}
                className="bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Create Investment
              </button>
              {isProfileComplete && (
                <button 
                  onClick={() => router.push('/dashboard/investments')}
                  className="bg-white text-gray-800 px-4 py-3 rounded-none text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  View Investment
                </button>
              )}
            </div>
          </div>
          {isProfileComplete ? (
            <div className="bg-white p-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Interest earned</span>
                <div className="flex items-center">
                  <span className="font-bold text-black">+ ₦ 2,383</span>
                  <div className="flex items-center ml-2 text-green-600">
                    <span className="text-sm font-medium">12.5%</span>
                    <Image 
                      src="/assets/svgs/increase.svg" 
                      alt="Increase" 
                      width={16} 
                      height={16}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 text-center">
              <p className="text-sm font-medium text-gray-700 mb-2">No data shown</p>
              <p className="text-sm text-gray-500 mb-4">Complete your profile set up to start using the features</p>
              <Button
                onClick={handleCompleteProfile}
                variant="outline"
                className="rounded-none h-9 px-6 mx-auto text-red-600 border-red-600 hover:bg-red-50"
              >
                Complete profile set up
              </Button>
            </div>
          )}
        </Card>

        {/* Loan Balance Card */}
        <Card className="rounded-none shadow-none border-4 border-white overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-white">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Loan and Repayments</h3>
              <button 
                onClick={handleRepaymentsClick}
                className="text-xs border border-gray-200 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
              >
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
            <div className="flex">
              {isProfileComplete ? (
                <button className="bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors">
                  Repay
                </button>
              ) : (
                <button 
                  onClick={() => router.push('/dashboard/loans')}
                  className="bg-red-600 text-white px-4 py-3 rounded-none text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Apply For Loan
                </button>
              )}
            </div>
          </div>
          {isProfileComplete ? (
            <div className="bg-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Next repayment</p>
                  <p className="font-bold">₦51,431.50</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm mb-1">Due date</p>
                  <p className="font-bold">Apr 30, 2025</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 text-center">
              <p className="text-sm font-medium text-gray-700 mb-2">No data shown</p>
              <p className="text-sm text-gray-500 mb-4">Complete your profile set up to start using the features</p>
              <Button
                onClick={handleCompleteProfile}
                variant="outline"
                className="rounded-none h-9 px-6 mx-auto text-red-600 border-red-600 hover:bg-red-50"
              >
                Complete profile set up
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Investments Overview Section - Only show when profile is complete */}
      {isProfileComplete && (
        <>
          <Card className="rounded-none shadow-none border-4 border-white overflow-hidden mt-6">
            <div className="bg-gray-50 p-6 border-b border-white">
              <h2 className="text-xl font-bold">Investments</h2>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <div className="bg-green-600 rounded-full p-1 mr-2 flex items-center justify-center">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <span className="text-base font-bold text-gray-700">3 investments maturing</span>
                </div>
                <span className="text-gray-400 ml-1">this month</span>
              </div>
            </div>
            <div className="bg-white p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wealth Plan Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Principal Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Earning
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tenure
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Maturity Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {investmentData.map((investment) => (
                      <tr key={investment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 mr-2">
                              <Image
                                src="/assets/svgs/litefi.svg"
                                alt="LiteFi"
                                width={32}
                                height={32}
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {investment.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {investment.principalAmount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {investment.earning}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {investment.tenure}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {investment.startDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {investment.maturityDate}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-green-600 mb-1">{investment.progress}%</span>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${investment.progress}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Button 
                            variant="outline" 
                            className="rounded-none h-9 bg-white hover:bg-gray-50 text-xs border-gray-200"
                            onClick={() => handleViewInvestment(investment.id)}
                          >
                            View Investment
                          </Button>
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

          {/* Upcoming Loan Payment Section */}
          <Card className="rounded-none shadow-none border-4 border-white overflow-hidden mt-6">
            <div className="bg-gray-50 p-6 border-b border-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Upcoming Loan Payment</h2>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <div className="bg-green-600 rounded-full p-1 mr-2 flex items-center justify-center">
                        <FaCheck className="text-white text-xs" />
                      </div>
                      <span className="text-base font-bold text-gray-700">3 loans due</span>
                    </div>
                    <span className="text-gray-400 ml-1">this month</span>
                  </div>
                </div>
                <Link 
                  href="/dashboard/loans"
                  className="bg-red-600 text-white px-6 py-2 text-sm hover:bg-red-700 transition-colors"
                >
                  View all loans
                </Link>
              </div>
            </div>
            <div className="bg-white p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Due
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tenure
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {loanPaymentData.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 mr-2">
                              <Image
                                src="/assets/svgs/litefi.svg"
                                alt="LiteFi"
                                width={32}
                                height={32}
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {loan.type}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {loan.dueDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {loan.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {loan.tenure}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={getStatusStyle(loan.status)}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button 
                            variant="outline" 
                            className="rounded-none h-9 bg-white hover:bg-gray-50 text-xs border-gray-200"
                            onClick={() => router.push(`/dashboard/loans/${loan.id}`)}
                          >
                            Repay
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
}