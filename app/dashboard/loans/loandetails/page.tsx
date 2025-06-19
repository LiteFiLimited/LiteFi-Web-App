"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "@/components/loans/TransactionTable";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Badge } from "@/components/ui/badge";

// Create a component that uses search params
function LoanDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showCollateralDetails, setShowCollateralDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get loan ID from search params
  const loanId = searchParams.get("id");

  // Sample loan data - in real app, fetch based on loanId
  const loan = {
    id: loanId || "1",
    type: "Auto Loan",
    amount: "₦2,500,000",
    status: "active",
    applicationId: "AL-2024-001",
    startDate: "2024-01-15",
    maturityDate: "2024-07-15",
    monthlyPayment: "₦450,000",
    interestRate: "18% per annum",
    remainingBalance: "₦1,800,000",
    nextPaymentDate: "2024-03-15",
    loanOfficer: "Sarah Johnson",
    purpose: "Vehicle Purchase",
    collateral: {
      type: "Vehicle",
      description: "2020 Toyota Camry",
      estimatedValue: "₦3,000,000",
      images: [
        "/assets/images/car1.png",
        "/assets/images/car2.png",
        "/assets/images/car.png"
      ]
    }
  };

  const handleBack = () => {
    router.back();
  };

  const toggleCollateralDetails = () => {
    setShowCollateralDetails(!showCollateralDetails);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % loan.collateral.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + loan.collateral.images.length) % loan.collateral.images.length);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Sample transaction data
  const transactions = [
    {
      date: "2024-02-15",
      description: "Monthly Payment",
      debit: "₦450,000",
      credit: "",
      balance: "₦2,050,000"
    },
    {
      date: "2024-01-15",
      description: "Monthly Payment",
      debit: "₦450,000",
      credit: "",
      balance: "₦2,500,000"
    },
    {
      date: "2024-01-01",
      description: "Loan Disbursement",
      debit: "",
      credit: "₦2,500,000",
      balance: "₦2,500,000"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link 
          href="/dashboard/loans" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <Image 
            src="/assets/svgs/arrow-back.svg" 
            alt="Back" 
            width={8}
            height={8}
            className="mr-2"
          />
          Loan Details
        </Link>
      </div>

      {/* Desktop and mobile layout container */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Loan Info Cards */}
        <div className="lg:w-3/10 flex-shrink-0 flex flex-col gap-6">
          {/* Due Today Card */}
          <div className="bg-white p-6">
            <div>
              <div className="inline-block bg-gray-50 p-2">
                <div className="text-orange-500 text-xs font-medium">DUE TODAY</div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xl font-bold">{loan.remainingBalance}</div>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-none text-sm"
                >
                  Repay Amount Due
                </Button>
              </div>
            </div>
          </div>

          {/* Loan Details Card */}
          <div className="bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">{loan.type}</span>
              <span className="text-xs text-gray-500">LOAN ID: {loan.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{loan.amount}</span>
              <span className="text-sm text-gray-500">
                Disbursed: <span className="font-bold text-black">{new Date(loan.startDate).toLocaleDateString()}</span>
              </span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between bg-gray-50 p-4">
              <span className="text-gray-600">Outstanding</span>
              <span className="font-bold">{loan.remainingBalance}</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-4 mt-2">
              <span className="text-gray-600">Tenure</span>
              <span className="font-bold">{new Date(loan.maturityDate).toLocaleDateString()}</span>
            </div>
            
            {/* Download statement button - moved below tenure */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="rounded-none h-9 bg-white hover:bg-gray-50 text-xs w-full border border-gray-300"
              >
                Download statement
              </Button>
            </div>
          </div>

          {/* Collateral Details Card */}
          <div className="bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Collateral Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCollateralDetails}
              >
                {showCollateralDetails ? 'Hide Details' : 'View Details'}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold">{loan.collateral.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Description</span>
                <span className="font-semibold">{loan.collateral.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Value</span>
                <span className="font-semibold text-green-600">{loan.collateral.estimatedValue}</span>
              </div>
            </div>

            {showCollateralDetails && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium mb-3">Collateral Images</h4>
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={loan.collateral.images[currentImageIndex]}
                      alt={`Collateral ${currentImageIndex + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {loan.collateral.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      >
                        <IoIosArrowBack size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      >
                        <IoIosArrowForward size={14} />
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex justify-center mt-2 space-x-1">
                  {loan.collateral.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        currentImageIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Transactions Table */}
        <div className="flex-1">
          <TransactionTable data={transactions} />
        </div>
      </div>
    </div>
  );
}

// Main page component with suspense
export default function LoanDetailsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading loan details...</p>
        </div>
      </div>
    }>
      <LoanDetailsContent />
    </Suspense>
  );
}
