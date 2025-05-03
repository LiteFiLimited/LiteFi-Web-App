"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AreaChart } from '@/components/ui/area-chart';

export default function InvestmentOverviewPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("this-year");
  const searchParams = useSearchParams();
  
  // Sample investment data - in a real app, this would come from an API based on the ID
  const investmentData = {
    id: "#QWKSJ",
    title: "Litefi Naira Investment",
    amount: "$100,000",
    change: "+$2.30",
    changePercentage: "+1.3%",
    principalAmount: "100,000",
    tenure: "12 months",
    startDate: "5th April 2025",
    maturityDate: "5th April 2026",
    maturityStatus: "Matured",
    earning: "75,000",
    withholdingTax: "2,000",
    totalPayouts: "250,000"
  };

  // Period options for the dropdown
  const periodOptions = [
    { value: "this-year", label: "This year" },
    { value: "last-year", label: "Last year" },
    { value: "all-time", label: "All time" },
    { value: "last-quarter", label: "Last quarter" },
    { value: "last-month", label: "Last month" },
  ];

  // Sample chart data - normally this would be fetched based on the investment ID
  const chartData = [
    { month: "Jan", value: 15000 },
    { month: "Feb", value: 65000 },
    { month: "Mar", value: 59000 },
    { month: "Apr", value: 62000 },
    { month: "May", value: 45000 },
    { month: "Jun", value: 55000 },
    { month: "Jul", value: 82000 },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link 
          href="/dashboard/investments" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <Image 
            src="/assets/svgs/arrow-back.svg" 
            alt="Back" 
            width={8}
            height={8}
            className="mr-2"
          />
          Investment Overview
        </Link>
      </div>

      {/* Desktop and mobile layout container */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Investment Card - full width on mobile, 30% width on desktop */}
        <div className="lg:w-3/10 flex-shrink-0 flex flex-col gap-6">
          {/* Litefi Naira Investment section - separate container */}
          <div className="bg-white p-8">
            <div className="flex items-center mb-2">
              <Image
                src="/assets/svgs/litefi.svg"
                alt="Litefi"
                width={32}
                height={32}
                className="mr-3"
              />
              <h2 className="font-medium">{investmentData.title}</h2>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-baseline">
                <span className="text-2xl font-bold mr-2">{investmentData.amount}</span>
                <span className="text-green-500 text-sm">
                  {investmentData.change} ({investmentData.changePercentage})
                </span>
              </div>
              <div>
                <Image
                  src="/assets/svgs/chart.svg"
                  alt="Chart indicator"
                  width={40}
                  height={16}
                />
              </div>
            </div>
          </div>

          {/* Investment Breakdown - completely separate container */}
          <div className="bg-white p-8">
            <h3 className="font-medium mb-2">Investment breakdown</h3>
            {/* Gray divider below the heading */}
            <div className="mb-4 pb-2 border-b border-gray-200"></div>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Investment ID</span>
                <span className="font-bold">{investmentData.id}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Principal Amount</span>
                <span className="font-bold">{investmentData.principalAmount}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tenure</span>
                <span className="font-bold">{investmentData.tenure}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Start Date</span>
                <span className="font-bold">{investmentData.startDate}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Maturity Date</span>
                <div className="flex items-center">
                  <span className="text-green-500 text-xs bg-green-50 px-2 py-1 rounded mr-2">
                    {investmentData.maturityStatus}
                  </span>
                  <span className="font-bold">{investmentData.maturityDate}</span>
                </div>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Earning</span>
                <span className="font-bold">{investmentData.earning}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Withholding Tax</span>
                <span className="font-bold">{investmentData.withholdingTax}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Total Payouts</span>
                <span className="font-bold">{investmentData.totalPayouts}</span>
              </div>
            </div>

            {/* Button */}
            <div className="mt-8">
              <button className="w-full bg-red-600 text-white py-4 hover:bg-red-700 transition-colors">
                Withdraw Investment
              </button>
            </div>
          </div>
        </div>

        {/* Performance Chart - Full width on mobile, 70% width on desktop */}
        <div className="bg-white p-8 lg:flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Portfolio performance</h3>
            <Select 
              value={selectedPeriod} 
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="text-xs border border-gray-200 h-auto px-3 py-1 rounded-full hover:bg-gray-100 transition-colors w-auto gap-1">
                <SelectValue placeholder="This year" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* AreaChart component */}
          <AreaChart
            data={chartData}
            xAxisDataKey="month"
            areaDataKey="value"
            colorKey="green"
            height={320}
            className="mt-4"
            yAxisFormatter={(value) => {
              if (value === 0) return "$0";
              if (value >= 1000) return `$${Math.floor(value / 1000)}k`;
              return `$${value}`;
            }}
            tooltipFormatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
          />
        </div>
      </div>
    </div>
  );
}
