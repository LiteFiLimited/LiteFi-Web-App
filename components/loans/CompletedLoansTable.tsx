import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CompletedLoan } from "@/types/loans";

interface CompletedLoansTableProps {
  data: CompletedLoan[];
  isLoading?: boolean;
}

export function CompletedLoansTable({ data, isLoading = false }: CompletedLoansTableProps) {
  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-white">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Application ID
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Load ID
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Application date
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
        {isLoading ? (
          // Skeleton loading state
          Array(5).fill(0).map((_, index) => (
            <tr key={`skeleton-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-20" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-16" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-24" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-20" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-24" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-20" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-8 w-24" />
              </td>
            </tr>
          ))
        ) : (
          data.map((loan, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">
                {loan.applicationId}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {loan.loanId}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {loan.type}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {loan.amount}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {loan.closedDate}
              </td>
              <td className={`px-6 py-4 text-sm ${loan.status === "Fully Paid" ? "text-green-600" : loan.status === "Rejected" ? "text-red-600" : "text-gray-900"}`}>
                {loan.status}
              </td>
              <td className="px-6 py-4">
                {loan.status === "Rejected" ? (
                  <span className="text-xs text-red-600 font-bold">Bad credit score</span>
                ) : (
                  <Button 
                    variant="outline" 
                    className="rounded-none h-9 bg-white hover:bg-gray-50 text-xs border-gray-200"
                  >
                    View details
                  </Button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
