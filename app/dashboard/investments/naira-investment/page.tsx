"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import InvestmentSuccessModal from "@/app/components/InvestmentSuccessModal";
import InsufficientBalanceModal from "@/app/components/InsufficientBalanceModal";

export default function NairaInvestmentPage() {
  // State to store form values
  const [wealthPlanName, setWealthPlanName] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  
  // State to track view
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("wallet");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [testSuccess, setTestSuccess] = useState(true);
  
  const router = useRouter();

  // Handle form submission
  const handlePreviewTerms = () => {
    if (wealthPlanName && amount && tenure) {
      setShowTerms(true);
    }
  };

  // Toggle payment method
  const togglePaymentMethod = (method: string) => {
    if (selectedPaymentMethod === method) {
      // Allow deselection
      setSelectedPaymentMethod("");
    } else {
      setSelectedPaymentMethod(method);
    }
  };

  // Handle payment submission
  const handleProceedToPayment = () => {
    if (testSuccess) {
      setShowSuccessModal(true);
    } else {
      setShowFailureModal(true);
    }
  };

  // Handle modal actions
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseFailureModal = () => {
    setShowFailureModal(false);
  };

  const handleViewInvestment = () => {
    setShowSuccessModal(false);
    router.push('/dashboard/investments');
  };

  const handleFundWallet = () => {
    setShowFailureModal(false);
    // Implementation for funding wallet would go here
    console.log("Funding wallet");
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[800px]">
        <div className="mb-8">
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
            Back
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-6">
          {!showTerms ? "Create New Litefi Naira Investment" : "Investment terms"}
        </h2>

        {!showTerms ? (
          <div className="bg-white p-8">
            {/* Wallet Balance Section */}
            <div className="bg-gray-50 p-6 mb-8">
              <div className="text-3xl font-bold mb-1">₦ 1,500,100</div>
              <div className="text-gray-600">Your wallet balance</div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Wealth Plan Name */}
              <div className="mb-6">
                <label htmlFor="wealthPlanName" className="block mb-2 text-gray-700">
                  Wealth Plan Name
                </label>
                <Input
                  id="wealthPlanName"
                  placeholder="Enter Wealth Plan Name"
                  value={wealthPlanName}
                  onChange={(e) => setWealthPlanName(e.target.value)}
                  className="h-12 rounded-none"
                />
              </div>

              {/* Amount and Tenure Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="block mb-2 text-gray-700">
                    Amount
                  </label>
                  <Input
                    id="amount"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number" 
                    className="h-12 rounded-none"
                  />
                </div>

                {/* Tenure */}
                <div>
                  <label htmlFor="tenure" className="block mb-2 text-gray-700">
                    Tenure
                  </label>
                  <Select value={tenure} onValueChange={setTenure}>
                    <SelectTrigger id="tenure" className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preview Terms Button */}
              <Button
                type="button"
                onClick={handlePreviewTerms}
                disabled={!wealthPlanName || !amount || !tenure}
                className={`w-full py-3 h-12 rounded-none ${
                  !wealthPlanName || !amount || !tenure 
                    ? "bg-red-300 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                Preview Terms
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-8">
            <div className="bg-gray-50 p-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Principal Amount</span>
                  <span className="font-bold">150,000,000</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tenure</span>
                  <span className="font-bold">12 months</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-bold">5th April 2025</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Maturity Date</span>
                  <span className="font-bold">5th April 2026</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Earning</span>
                  <span className="font-bold">230,000,000</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Withholding Tax</span>
                  <span className="font-bold">100,000</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total Payouts</span>
                  <span className="font-bold">450,000,000</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-medium mb-4">Pay with</h3>
              
              {/* Payment options - side by side on md+ screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Wallet payment option with conditional styling */}
                <div 
                  className={`bg-gray-50 p-4 flex justify-between items-center cursor-pointer transition-colors ${selectedPaymentMethod === "wallet" ? "bg-green-50" : ""}`}
                  onClick={() => togglePaymentMethod("wallet")}
                >
                  <div>
                    <p className="text-xs text-gray-500">Your wallet balance</p>
                    <p className="font-bold">₦ 1,500,100</p>
                  </div>
                  <div className={`h-6 w-6 rounded-full border flex items-center justify-center ${selectedPaymentMethod === "wallet" ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
                    {selectedPaymentMethod === "wallet" && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Fund with Mono option */}
                <div 
                  className="bg-green-50 p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => togglePaymentMethod("mono")}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700">Fund your wallet</p>
                    <Image
                      src="/assets/svgs/mono.svg"
                      alt="Mono"
                      width={80}
                      height={24}
                    />
                  </div>
                  <Image
                    src="/assets/svgs/arrow-right.svg"
                    alt="Continue"
                    width={16}
                    height={16}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2 mb-4">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    By creating this investment, you agree to our <span className="text-red-600">Terms</span> and <span className="text-red-600">Investment terms</span>
                  </label>
                </div>
              </div>
              
              {/* Grey divider below terms agreement */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Testing toggle for success/failure scenario */}
              <div className="flex items-center justify-end space-x-2 mb-4 bg-gray-100 p-2 rounded">
                <Label htmlFor="test-success" className="text-xs text-gray-500">
                  Test {testSuccess ? "Success" : "Failure"}
                </Label>
                <Switch
                  id="test-success"
                  checked={testSuccess}
                  onCheckedChange={setTestSuccess}
                />
              </div>

              <Button
                type="button"
                disabled={!agreedToTerms || !selectedPaymentMethod}
                className={`w-full py-3 h-12 rounded-none ${
                  (!agreedToTerms || !selectedPaymentMethod) 
                    ? "bg-red-300 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
                onClick={handleProceedToPayment}
              >
                Proceed to make payment
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <InvestmentSuccessModal
          onClose={handleCloseSuccessModal}
          onViewInvestment={handleViewInvestment}
        />
      )}

      {/* Failure Modal */}
      {showFailureModal && (
        <InsufficientBalanceModal
          onClose={handleCloseFailureModal}
          onFundWallet={handleFundWallet}
        />
      )}
    </div>
  );
}
