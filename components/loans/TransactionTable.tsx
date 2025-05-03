import React from "react";

interface Transaction {
  date: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
}

interface TransactionTableProps {
  data: Transaction[];
}

export function TransactionTable({ data }: TransactionTableProps) {
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
            {data.map((transaction, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.debit || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.credit || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
