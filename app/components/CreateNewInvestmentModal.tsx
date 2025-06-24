"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { InvestmentType } from "@/types/investments";

import { investmentApi } from "@/lib/investmentApi";
import { useToastContext } from "@/app/components/ToastProvider";

interface CreateNewInvestmentModalProps {
  investmentTypes: InvestmentType[];
  onCloseAction: () => void;
}

export default function CreateNewInvestmentModal({ 
  investmentTypes, 
  onCloseAction 
}: CreateNewInvestmentModalProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToastContext();

  const handleSelectInvestmentType = (type: string) => {
    setSelectedType(type);
    
    // Route to the appropriate investment page
    if (type === "naira-investment") {
      router.push("/dashboard/investments/naira-investment");
    } else if (type === "foreign-investment") {
      router.push("/dashboard/investments/foreign-investment");
    }
    
    // Close the modal
    onCloseAction();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCloseAction} />
      
      {/* Modal with gray background instead of white */}
      <div className="bg-gray-50 w-full max-w-2xl p-8 z-10 relative mx-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Create New Investment
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Select any of the options below to create your investment
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investmentTypes.map((investment) => (
              <div 
                key={investment.title} 
                className="bg-white p-6 relative overflow-hidden"
              >
                <div 
                  className={`absolute ${investment.title === "Litefi Naira Investment" ? "right-2" : "right-01"} top-0`}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${investment.icon})`,
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: investment.title === "Litefi Naira Investment" ? 
                      "clamp(20%, 15%, 30%)" : "50%",
                    opacity: 1.0,
                  }}
                />
                
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">
                    {investment.title === "Litefi Naira Investment" ? (
                      <>🏦 {investment.title}</>
                    ) : (
                      <>🌍 {investment.title}</>
                    )}
                  </h3>
                  <p className="text-gray-600 mb-6">{investment.description}</p>
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-none"
                    onClick={() => handleSelectInvestmentType(investment.route)}
                    disabled={isLoading}
                  >
                    {isLoading && selectedType === investment.route ? (
                      <span className="flex items-center">
                        <span className="mr-2">Loading...</span>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </span>
                    ) : "Create Investment"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
