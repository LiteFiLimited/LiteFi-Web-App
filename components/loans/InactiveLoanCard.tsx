import React from "react";
import Link from "next/link";
import { LoanType } from "@/types/loans";

interface InactiveLoanCardProps {
  loan: LoanType;
}

export function InactiveLoanCard({ loan }: InactiveLoanCardProps) {
  return (
    <div className="bg-white p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <img src="/assets/svgs/logo.svg" alt="LiteFi" className="w-10 h-10 mr-3" />
        <h3 className="font-medium">{loan.title}</h3>
      </div>
      
      <div className="mb-2">
        <p className="text-green-600 text-sm font-medium bg-green-50 inline-block px-3 py-1 rounded-full">Up to &#8358; {loan.amount} naira</p>
      </div>
      
      <p className="text-sm text-gray-600">{loan.description}</p>
      
      <div className="mt-auto pt-8">
        <Link 
          href={`/dashboard/loans/${loan.route}`}
          className="block w-full bg-red-600 text-white text-center py-3 hover:bg-red-700 transition-colors"
        >
          Apply
        </Link>
      </div>
    </div>
  );
}
