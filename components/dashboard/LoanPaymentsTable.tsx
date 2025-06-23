import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { TableSkeleton } from "./TableSkeleton";

interface LoanPayment {
  id: string;
  type: string;
  reference?: string;
  amount: number;
  dueDate: string;
  status: string;
  loanId?: string;
}

interface LoanPaymentsTableProps {
  isLoading: boolean;
  payments: LoanPayment[];
  activeLoans: number;
  onViewLoans: () => void;
  onRepayLoan: (id: string) => void;
}

export function LoanPaymentsTable({
  isLoading,
  payments,
  activeLoans,
  onViewLoans,
  onRepayLoan,
}: LoanPaymentsTableProps) {
  if (isLoading) {
    return <TableSkeleton columnCount={5} rowCount={3} className="mt-6" />;
  }

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

  return (
    <Card className="rounded-none shadow-none border-4 border-white overflow-hidden mt-6">
      <div className="bg-gray-50 p-6 border-b border-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Upcoming Loan Payments</h2>
            {activeLoans > 0 && (
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <div className="bg-green-600 rounded-full p-1 mr-2 flex items-center justify-center">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <span className="text-base font-bold text-gray-700">{activeLoans} loan{activeLoans !== 1 ? 's' : ''} due</span>
                </div>
                <span className="text-gray-400 ml-1">this month</span>
              </div>
            )}
          </div>
          <Button 
            onClick={onViewLoans}
            className="bg-red-600 text-white px-6 py-2 text-sm hover:bg-red-700 transition-colors"
          >
            View all loans
          </Button>
        </div>
      </div>
      <div className="bg-white p-0">
        {payments && payments.length > 0 ? (
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
                    Amount
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
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
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
                          {payment.reference || payment.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(payment.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₦ {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusStyle(payment.status)}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        variant="outline" 
                        className="rounded-none h-9 bg-white hover:bg-gray-50 text-xs border-gray-200"
                        onClick={() => onRepayLoan(payment.loanId || payment.id)}
                      >
                        Repay
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No upcoming loan payments</p>
          </div>
        )}
      </div>
    </Card>
  );
} 