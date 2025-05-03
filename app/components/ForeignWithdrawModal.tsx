"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EarningsDepositedModal from "./EarningsDepositedModal";

interface ForeignWithdrawModalProps {
  amount: string;
  onClose: () => void;
}

export default function ForeignWithdrawModal({ amount, onClose }: ForeignWithdrawModalProps) {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        {/* Modal */}
        <div className="bg-white w-full max-w-md p-8 z-10 relative mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Withdraw {amount}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Provide your international account details below to receive the funds
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="accountName" className="block text-sm mb-1">Account Name</label>
                  <Input
                    id="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="h-12 bg-gray-50 rounded-none"
                    placeholder="Enter account name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="accountNumber" className="block text-sm mb-1">Account Number / IBAN</label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="h-12 bg-gray-50 rounded-none"
                    placeholder="Enter account number"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sortCode" className="block text-sm mb-1">SWIFT/BIC Code</label>
                  <Input
                    id="sortCode"
                    value={sortCode}
                    onChange={(e) => setSortCode(e.target.value)}
                    className="h-12 bg-gray-50 rounded-none"
                    placeholder="Enter code"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="bankName" className="block text-sm mb-1">Bank Name</label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="h-12 bg-gray-50 rounded-none"
                    placeholder="Enter bank name"
                    required
                  />
                </div>
              </div>
              
              <div className="text-xs text-gray-600 mt-4 mb-4">
                Please ensure all international banking details are correct. Additional fees may apply for international transfers.
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 h-12 rounded-none text-white"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <EarningsDepositedModal 
          amount={amount}
          onViewWallet={() => {
            setShowSuccessModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
