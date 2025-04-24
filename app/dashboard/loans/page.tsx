"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LoanTypeProps {
  title: string;
  amount: string;
  description: string;
}

const LoanTypeCard = ({ title, amount, description }: LoanTypeProps) => {
  return (
    <div className="bg-white p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <img src="/assets/svgs/logo.svg" alt="LiteFi" className="w-10 h-10 mr-3" />
        <h3 className="font-medium">{title}</h3>
      </div>
      
      <div className="mb-2">
        <p className="text-green-600 text-sm font-medium bg-green-50 inline-block px-3 py-1 rounded-full">Up to &#8358; {amount} naira</p>
      </div>
      
      <p className="text-sm text-gray-600">{description}</p>
      
      <div className="mt-auto pt-8">
        <Link 
          href={`/dashboard/loans/${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="block w-full bg-red-600 text-white text-center py-3 hover:bg-red-700 transition-colors"
        >
          Apply
        </Link>
      </div>
    </div>
  );
};

export default function LoansPage() {
  const loanTypes = [
    {
      title: "Salary Loan",
      amount: "500,000",
      description: "Get a salary loan now and repay in easy monthly instalments."
    },
    {
      title: "Working Capital Loan",
      amount: "5 million",
      description: "Boost Your Business Cash Flow – Get Fast, Flexible Financing for Your Daily Operations"
    },
    {
      title: "Auto Loan",
      amount: "50 million",
      description: "Drive Your Dream Car with Ease – Get an Auto Loan with Flexible Repayment Plans"
    },
    {
      title: "Travel Loan (POF)",
      amount: "30 million",
      description: "Explore the World Without Financial Worries – Get a Travel Loan with Proof of Funds Today"
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Loans</h1>
      <p className="text-muted-foreground mb-8">Manage your loans from this page</p>

      <div className="bg-white p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium mb-2">You do not have any active loan</h2>
          <p className="text-gray-500">You're all set! No active loans at the moment. Ready to explore new financing options?</p>
        </div>

        <div className="bg-gray-50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loanTypes.map((loan, index) => (
              <div key={loan.title}>
                <LoanTypeCard
                  title={loan.title}
                  amount={loan.amount}
                  description={loan.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 