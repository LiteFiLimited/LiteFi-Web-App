"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoanTypePage() {
  const params = useParams();
  const loanType = params.loanType as string;
  
  // Convert slug to display name
  const loanName = loanType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const loanDetails = {
    "salary-loan": {
      title: "Salary Loan",
      amount: "500,000",
      description: "Get a salary loan now and repay in easy monthly instalments.",
      requirements: [
        "Active Bank Account",
        "Minimum 3 months employment",
        "Valid Government ID",
        "Proof of Income"
      ]
    },
    "working-capital-loan": {
      title: "Working Capital Loan",
      amount: "5 million",
      description: "Boost Your Business Cash Flow – Get Fast, Flexible Financing for Your Daily Operations",
      requirements: [
        "Business Registration",
        "6 months active business",
        "Business Bank Account",
        "Financial Statements"
      ]
    },
    "auto-loan": {
      title: "Auto Loan",
      amount: "50 million",
      description: "Drive Your Dream Car with Ease – Get an Auto Loan with Flexible Repayment Plans",
      requirements: [
        "Proof of Income",
        "Valid Driver's License",
        "Vehicle Information",
        "Down Payment"
      ]
    },
    "travel-loan-(pof)": {
      title: "Travel Loan (POF)",
      amount: "30 million",
      description: "Explore the World Without Financial Worries – Get a Travel Loan with Proof of Funds Today",
      requirements: [
        "Valid Passport",
        "Travel Itinerary",
        "Income Verification",
        "Proof of Return"
      ]
    }
  };

  const loan = loanDetails[loanType as keyof typeof loanDetails];

  if (!loan) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Loan Type Not Found</h1>
        <p className="mb-6">The loan type you're looking for doesn't exist.</p>
        <Link href="/dashboard/loans">
          <Button className="bg-red-600 hover:bg-red-700">Return to Loans</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/dashboard/loans" className="text-red-600 hover:underline mb-4 inline-block">
        &larr; Back to Loans
      </Link>
      
      <h1 className="text-2xl font-bold mb-2">{loan.title}</h1>
      <p className="text-muted-foreground mb-8">{loan.description}</p>

      <div className="bg-white p-8 mb-8 shadow-sm">
        <h2 className="text-xl font-medium mb-4">Apply for {loan.title}</h2>
        <p className="text-green-600 text-sm font-medium bg-green-50 inline-block px-3 py-1 rounded-full mb-6">Up to &#8358; {loan.amount} naira</p>
        
        <h3 className="font-medium mb-3">Requirements:</h3>
        <ul className="list-disc pl-5 mb-6">
          {loan.requirements.map((req, index) => (
            <li key={index} className="mb-1">{req}</li>
          ))}
        </ul>
        
        <Button className="bg-red-600 hover:bg-red-700 w-full py-6">
          Apply Now
        </Button>
      </div>
    </div>
  );
} 