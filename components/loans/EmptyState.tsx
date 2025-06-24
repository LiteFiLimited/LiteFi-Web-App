import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, BarChart4, Receipt } from "lucide-react";
import { LoanType } from "@/types/loans";
import { InactiveLoanCard } from "@/components/loans/InactiveLoanCard";

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
  type?: 'loan' | 'investment' | 'default';
  loanTypes?: LoanType[];
  showLoanTypes?: boolean;
}

export function EmptyState({ 
  title, 
  message, 
  buttonText, 
  buttonLink, 
  type = 'default',
  loanTypes = [],
  showLoanTypes = false
}: EmptyStateProps) {
  return (
    <div className="w-full bg-gray-50 p-8 flex flex-col items-center justify-center text-center">
      <div className="mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          {type === 'loan' ? (
            <Receipt size={24} />
          ) : type === 'investment' ? (
            <BarChart4 size={24} />
          ) : (
            <PlusCircle size={24} />
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      
      {buttonText && buttonLink && (
        <Link href={buttonLink}>
          <Button className="bg-red-600 hover:bg-red-700 rounded-none">
            {buttonText}
          </Button>
        </Link>
      )}

      {/* Display loan types if requested and available */}
      {showLoanTypes && loanTypes.length > 0 && (
        <div className="w-full mt-8">
          <h3 className="text-lg font-medium mb-4">Available Loan Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loanTypes.map((loan) => (
              <div key={loan.title} className="h-full">
                <InactiveLoanCard loan={loan} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
