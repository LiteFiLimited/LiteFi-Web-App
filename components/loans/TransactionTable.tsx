import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  date: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
}

interface TransactionTableProps {
  data: Transaction[];
  isLoading?: boolean;
}

export function TransactionTable({ data, isLoading = false }: TransactionTableProps) {
  return (
    <div className="bg-white border-4 border-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white">
                Debit
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white">
                Credit
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              // Skeleton loading state
              Array(5).fill(0).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-20" />
                  </td>
                </tr>
              ))
            ) : (
              data.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.debit || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.credit || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.balance}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
