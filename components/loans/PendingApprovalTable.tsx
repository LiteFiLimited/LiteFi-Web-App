import React from "react";

interface PendingApproval {
  applicationId: string;
  loanId: string;
  type: string;
  amount: string;
  submittedDate: string;
  status: string;
}

interface PendingApprovalTableProps {
  data: PendingApproval[];
}

export function PendingApprovalTable({ data }: PendingApprovalTableProps) {
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
              {loan.amount}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {loan.submittedDate}
            </td>
            <td className="px-6 py-4 text-sm text-orange-500">
              {loan.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
