import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RxEyeClosed } from "react-icons/rx";
import { VscEye } from "react-icons/vsc";
import { LoanType, ActiveLoan, Loan } from "@/types/loans";
import { useRouter } from "next/navigation";
import { format, parseISO, isToday } from "date-fns";

interface ActiveLoanCardProps {
  loan: LoanType;
  activeLoanData: ActiveLoan;
  loanId: string;
  nextRepaymentDate?: string | null;
}

export function ActiveLoanCard({ loan, activeLoanData, loanId, nextRepaymentDate }: ActiveLoanCardProps) {
  const [showLoanBalance, setShowLoanBalance] = useState(false);
  const router = useRouter();
  
  const handleViewLoanDetails = () => {
    router.push(`/dashboard/loans/details/${loanId}`);
  };

  // Determine if the loan payment is due today
  const isDueToday = nextRepaymentDate ? isToday(new Date(nextRepaymentDate)) : false;
  
  // Format due date to display
  const formattedDueDate = nextRepaymentDate 
    ? format(parseISO(nextRepaymentDate), 'MMM dd, yyyy')
    : 'No upcoming payment';

  return (
    <Card className="rounded-none shadow-none border-4 border-white overflow-hidden h-full">
      <div className="bg-gray-50 p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">{loan.title}</h3>
          {isDueToday ? (
            <div className="bg-orange-100 text-orange-700 text-xs px-2 py-1">DUE TODAY</div>
          ) : nextRepaymentDate ? (
            <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1">PAYMENT UPCOMING</div>
          ) : (
            <div className="bg-green-100 text-green-700 text-xs px-2 py-1">ACTIVE</div>
          )}
        </div>
        <div className="flex items-center gap-2 my-4">
          <div className="text-2xl font-bold">
            {showLoanBalance ? activeLoanData.totalAmount : "*****"}
          </div>
          <button 
            onClick={() => setShowLoanBalance(!showLoanBalance)}
            className="text-gray-500 flex items-center hover:text-gray-700 transition-colors"
          >
            {showLoanBalance ? <VscEye size={20} /> : <RxEyeClosed size={20} />}
          </button>
        </div>
        <Link href={`/dashboard/loans/${loanId}/repay`} className="block">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-none text-sm font-medium w-full md:w-auto">
            Repay
          </Button>
        </Link>
      </div>
      <div className="bg-white p-6">
        <div className="flex justify-between items-center lg:flex-col lg:items-start">
          <div>
            <p className="text-gray-500 text-sm mb-1">Due {formattedDueDate}</p>
            <p className="font-bold">{activeLoanData.dueAmount}</p>
          </div>
          <div className="text-right lg:text-left lg:w-full lg:mt-4">
            <Button 
              variant="outline" 
              className="border border-gray-300 hover:bg-gray-100 transition-colors text-gray-800 rounded-none text-sm font-medium h-auto px-4 py-3 lg:w-full"
              onClick={handleViewLoanDetails}
            >
              View loan details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
