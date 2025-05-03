"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "@/components/loans/TransactionTable";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function LoanDetailsPage() {
  const [isCollateralExpanded, setIsCollateralExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const searchParams = useSearchParams();

  const carImages = [
    "/assets/images/car.png",
    "/assets/images/car1.png",
    "/assets/images/car2.png"
  ];

  const documents = [
    { name: "Vehicle Registration Certificate", path: "#", type: "pdf" },
    { name: "Customs Documents", path: "#", type: "pdf" },
    { name: "Proof of Ownership", path: "#", type: "pdf" },
    { name: "Vehicle Inspection Report", path: "#", type: "docx" },
  ];

  const loanData = {
    id: "#46876",
    title: "Salary loan",
    amount: "₦ 1,500,000",
    dueAmount: "₦ 150,000",
    disbursement: "10th April 2025",
    outstanding: "840,000",
    tenure: "24 months",
    collateral: {
      make: "Toyota",
      model: "Camry",
      year: "2019",
      color: "Silver",
      plateNumber: "ABC 123 XYZ",
      mileage: "Camry",
      modelNumber: "KLOKSMJWJWI"
    }
  };

  const transactionData = Array(14).fill(null).map((_, index) => ({
    date: "23-03-2025",
    description: index % 2 === 0 ? "Payment" : "Payment Received",
    debit: index % 2 === 0 ? "₦ 800,000" : "",
    credit: index % 2 === 0 ? "" : "₦ 800,000",
    balance: "₦ 800,000"
  }));

  const toggleCollateralDetails = () => {
    setIsCollateralExpanded(!isCollateralExpanded);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  };

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
              <div className="text-sm text-gray-500 mt-2">Amount due today</div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xl font-bold">{loanData.dueAmount}</div>
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
              <span className="text-gray-600">{loanData.title}</span>
              <span className="text-xs text-gray-500">LOAN ID: {loanData.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{loanData.amount}</span>
              <span className="text-sm text-gray-500">
                Disbursed: <span className="font-bold text-black">{loanData.disbursement}</span>
              </span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between bg-gray-50 p-4">
              <span className="text-gray-600">Outstanding</span>
              <span className="font-bold">{loanData.outstanding}</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-4 mt-2">
              <span className="text-gray-600">Tenure</span>
              <span className="font-bold">{loanData.tenure}</span>
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
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleCollateralDetails}
            >
              <h3 className="font-medium">Collateral Details</h3>
              <Image 
                src="/assets/svgs/arrow-down.svg" 
                alt="Expand" 
                width={20}
                height={20}
                className={`transform transition-transform ${isCollateralExpanded ? 'rotate-180' : ''}`}
              />
            </div>
            {isCollateralExpanded && (
              <div className="mt-4 space-y-4">
                {/* Car Image Carousel */}
                <div className="relative">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image 
                      src={carImages[currentImageIndex]}
                      alt="Car Collateral"
                      className="object-cover"
                      fill
                    />
                  </div>
                  
                  {/* Navigation arrows */}
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-md transition-colors"
                    aria-label="Previous image"
                  >
                    <IoIosArrowBack size={14} />
                  </button>
                  
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-md transition-colors"
                    aria-label="Next image"
                  >
                    <IoIosArrowForward size={14} />
                  </button>
                </div>

                {/* Car Details with border - No border radius */}
                <div className="border border-gray-200">
                  {/* First Row - 3 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                    <div>
                      <p className="text-gray-500 text-sm">Make</p>
                      <p className="font-medium">{loanData.collateral.make}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Model</p>
                      <p className="font-medium">{loanData.collateral.model}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Year</p>
                      <p className="font-medium">{loanData.collateral.year}</p>
                    </div>
                  </div>
                  
                  {/* Divider that doesn't touch edges and hides on mobile */}
                  <div className="hidden md:block px-4">
                    <div className="border-t border-gray-200"></div>
                  </div>
                  
                  {/* Second Row - 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div>
                      <p className="text-gray-500 text-sm">Mileage</p>
                      <p className="font-medium">{loanData.collateral.mileage}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Model Number</p>
                      <p className="font-medium">{loanData.collateral.modelNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="pt-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="my-2">
                      <Link href={doc.path} className="flex items-center text-sm text-gray-700">
                        <Image 
                          src={doc.type === "pdf" ? "/assets/svgs/pdf.svg" : "/assets/svgs/docx.svg"}
                          alt={doc.type === "pdf" ? "PDF" : "DOCX"}
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        {doc.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Transactions Table */}
        <div className="flex-1">
          <TransactionTable data={transactionData} />
        </div>
      </div>
    </div>
  );
}
