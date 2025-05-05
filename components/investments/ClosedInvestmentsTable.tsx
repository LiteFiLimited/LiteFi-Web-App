import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import EarningsDepositedModal from "@/app/components/EarningsDepositedModal";

interface ClosedInvestment {
  principalAmount: string;
  currency: string;
  tenure: string;
  startDate: string;
  maturityDate: string;
  totalPayouts: string;
  canWithdraw?: boolean;
}

interface ClosedInvestmentsTableProps {
  data: ClosedInvestment[];
}

export function ClosedInvestmentsTable({ data }: ClosedInvestmentsTableProps) {
  const [showEarningsDepositedModal, setShowEarningsDepositedModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("");
  
  const handleWithdraw = (amount: string, currency: string) => {
    setSelectedAmount(amount);
    setShowEarningsDepositedModal(true);
  };

  return (
    <>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-white">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Principal Amount
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Currency
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
              Total Payouts
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((investment, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">
                {investment.principalAmount}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {investment.currency}
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
              <td className="px-6 py-4 text-sm text-gray-900">
                {investment.totalPayouts}
              </td>
              <td className="px-6 py-4 text-sm text-right">
                <Button 
                  variant="outline"
                  className={`text-sm px-4 py-1 h-auto rounded-none ${
                    investment.canWithdraw === false 
                      ? "text-gray-400 border-gray-200 cursor-not-allowed" 
                      : ""
                  }`}
                  onClick={() => {
                    if (investment.canWithdraw !== false) {
                      handleWithdraw(investment.totalPayouts, investment.currency);
                    }
                  }}
                  disabled={investment.canWithdraw === false}
                >
                  Withdraw to Wallet
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Earnings Deposited Modal */}
      {showEarningsDepositedModal && (
        <EarningsDepositedModal
          amount={selectedAmount}
          onViewWallet={() => setShowEarningsDepositedModal(false)}
        />
      )}
    </>
  );
}
