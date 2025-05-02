import React from "react";
import { Button } from "@/components/ui/button";

interface UpcomingRepayment {
  applicationId: string;
  loanId: string;
  type: string;
  outstandingBalance: string;
  dueDate: string;
  amountDue: string;
}

interface UpcomingRepaymentsTableProps {
  data: UpcomingRepayment[];
}

export function UpcomingRepaymentsTable({ data }: UpcomingRepaymentsTableProps) {
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
            Outstanding Balance
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Due Date
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount Due
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {data.map((loan, index) => (
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
              {loan.outstandingBalance}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {loan.dueDate}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {loan.amountDue}
            </td>
            <td className="px-6 py-4">
              <Button 
                variant="outline" 
                className="rounded-none h-9 bg-white hover:bg-gray-50 text-xs border-gray-200"
              >
                Repay Loan
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
