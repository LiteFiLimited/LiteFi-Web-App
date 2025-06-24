import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RxEyeClosed } from "react-icons/rx";
import { VscEye } from "react-icons/vsc";
import { LoanType } from "@/types/loans";
import { useRouter } from "next/navigation";

interface PendingLoanCardProps {
  loan: LoanType;
  status: string;
  submittedDate: string;
  amount: string;
  loanId: string;
}

export function PendingLoanCard({ loan, status, submittedDate, amount, loanId }: PendingLoanCardProps) {
  const [showLoanAmount, setShowLoanAmount] = useState(false);
  const router = useRouter();

  const getStatusBadge = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1">PENDING</div>;
      case 'approved':
        return <div className="bg-green-100 text-green-700 text-xs px-2 py-1">APPROVED</div>;
      case 'rejected':
        return <div className="bg-red-100 text-red-700 text-xs px-2 py-1">REJECTED</div>;
      default:
        return <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1">{status.toUpperCase()}</div>;
    }
  };
  
  const handleViewDetails = () => {
    router.push(`/dashboard/loans/details/${loanId}`);
  };

  return (
    <Card className="rounded-none shadow-none border-4 border-white overflow-hidden h-full">
      <div className="bg-gray-50 p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">{loan.title}</h3>
          {getStatusBadge()}
        </div>
        <div className="flex items-center gap-2 my-4">
          <div className="text-2xl font-bold">
            {showLoanAmount ? amount : "*****"}
          </div>
          <button 
            onClick={() => setShowLoanAmount(!showLoanAmount)}
            className="text-gray-500 flex items-center hover:text-gray-700 transition-colors"
          >
            {showLoanAmount ? <VscEye size={20} /> : <RxEyeClosed size={20} />}
          </button>
        </div>
        <div className="h-10 flex items-center"> 
          <span className="text-sm text-gray-500">Your application is being processed</span>
        </div>
      </div>
      <div className="bg-white p-6">
        <div className="flex justify-between items-center lg:flex-col lg:items-start">
          <div>
            <p className="text-gray-500 text-sm mb-1">Applied on</p>
            <p className="font-bold">{submittedDate}</p>
          </div>
          <div className="text-right lg:text-left lg:w-full lg:mt-4">
            <Button 
              variant="outline" 
              className="border border-gray-300 hover:bg-gray-100 transition-colors text-gray-800 rounded-none text-sm font-medium h-auto px-4 py-3 lg:w-full"
              onClick={handleViewDetails}
            >
              View application details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
