import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoanType } from "@/types/loans";

interface EmptyLoanCardProps {
  loan: LoanType;
  isLoading?: boolean;
}

export function EmptyLoanCard({ loan, isLoading = false }: EmptyLoanCardProps) {
  return (
    <Card className="rounded-none shadow-none border-4 border-white overflow-hidden h-full">
      <div className="bg-gray-50 p-6">
        <h3 className="text-sm font-medium">{loan.title}</h3>
        <div className="flex items-center gap-2 my-4">
          <div className="text-2xl font-bold">₦ 0.00</div>
        </div>
        <Link href={`/dashboard/loans/${loan.route}`} className="block">
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-none text-sm font-medium w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Borrow"}
          </Button>
        </Link>
      </div>
      <div className="bg-white p-6">
        <p className="text-sm text-gray-500">
          {loan.description ? (
            <>
              <span className="font-medium">Loan Amount:</span> Up to ₦{loan.amount}
              <br />
              <span className="text-xs text-gray-400 mt-1">{loan.description}</span>
            </>
          ) : (
            "--"
          )}
        </p>
      </div>
    </Card>
  );
}
