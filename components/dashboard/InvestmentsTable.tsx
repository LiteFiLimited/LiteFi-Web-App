import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { TableSkeleton } from "./TableSkeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface Investment {
  id: string;
  name: string;
  amount: number;
  expectedReturns: number;
  maturityDate: string;
  status: string;
}

interface InvestmentsTableProps {
  isLoading: boolean;
  investments: Investment[];
  activeInvestments: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewInvestment: (id: string) => void;
}

export function InvestmentsTable({
  isLoading,
  investments,
  activeInvestments,
  currentPage,
  onPageChange,
  onViewInvestment,
}: InvestmentsTableProps) {
  if (isLoading) {
    return <TableSkeleton columnCount={6} rowCount={3} className="mt-6" />;
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
      case 'active':
      case 'completed':
        return 'text-green-600';
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
        <h2 className="text-xl font-bold">Investments</h2>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <div className="bg-green-600 rounded-full p-1 mr-2 flex items-center justify-center">
              <FaCheck className="text-white text-xs" />
            </div>
            <span className="text-base font-bold text-gray-700">
              {activeInvestments} investment{activeInvestments !== 1 ? 's' : ''} maturing
            </span>
          </div>
          <span className="text-gray-400 ml-1">this month</span>
        </div>
      </div>
      <div className="bg-white p-0">
        {investments && investments.length > 0 ? (
          <>
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
                      Maturity Date
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
                  {investments.map((investment) => (
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
                        ₦ {formatCurrency(investment.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ₦ {formatCurrency(investment.expectedReturns - investment.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(investment.maturityDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusStyle(investment.status)}>
                          {investment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="outline" 
                          className="rounded-none h-9 bg-white hover:bg-gray-50 text-xs border-gray-200"
                          onClick={() => onViewInvestment(investment.id)}
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
                        onPageChange(Math.max(1, currentPage - 1));
                      }} 
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink 
                      href="#"
                      isActive={currentPage === 1}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(1);
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
                        onPageChange(currentPage + 1);
                      }} 
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No active investments found</p>
          </div>
        )}
      </div>
    </Card>
  );
} 