"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { InvestmentType } from "@/types/investments";

interface CreateNewInvestmentModalProps {
  investmentTypes: InvestmentType[];
  onClose: () => void;
}

export default function CreateNewInvestmentModal({ 
  investmentTypes, 
  onClose 
}: CreateNewInvestmentModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
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
                    onClick={() => {
                      router.push(`/dashboard/investments/${investment.route}`);
                      onClose();
                    }}
                  >
                    Create Investment
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
