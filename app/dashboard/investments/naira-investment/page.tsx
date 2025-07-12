"use client";

import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import InvestmentSuccessModal from "@/app/components/InvestmentSuccessModal";
import InsufficientBalanceModal from "@/app/components/InsufficientBalanceModal";
import { useInvestments } from "@/hooks/useInvestments";
import InvestmentPendingModal from "@/app/components/InvestmentPendingModal";
import { useToastContext } from "@/app/components/ToastProvider";
import { useWallet } from "@/hooks/useWallet";
import { formatCurrency } from "@/lib/utils";

export default function NairaInvestmentPage() {
  // State to store form values
  const [investmentName, setInvestmentName] = useState("");
  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState(""); // For display with commas
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [tenure, setTenure] = useState("");
  
  // State to track view
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("wallet");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedReturns, setCalculatedReturns] = useState<any>(null);
  const [pendingInvestmentData, setPendingInvestmentData] = useState<any>(null);
  
  const router = useRouter();
  const { calculateReturns, createInvestment } = useInvestments();
  const { success, error: showError } = useToastContext();
  const { wallet, isLoading: walletLoading } = useWallet();

  // Define hardcoded Naira investment options
  const nairaOptions = {
    minimumAmount: 100000,
    maximumAmount: 100000000,
    minimumTenure: 3,
    maximumTenure: 60,
    description: "Earn monthly interest on your Naira investment"
  };
  
  // State to track upfront interest payment preference
  const [upfrontInterestPayment, setUpfrontInterestPayment] = useState(false);
  
  // Calculate returns function - will only be called when user clicks Preview Terms
  const calculateInvestmentReturns = async () => {
    if (amount && tenure) {
      setIsCalculating(true);
      try {
        console.log("Calculating returns for:", {
          amount: Number(amount),
          tenure: Number(tenure),
          currency: "NGN",
          upfrontInterestPayment
        });
        
        const response = await calculateReturns(
          Number(amount), 
          Number(tenure), 
          "NGN", 
          upfrontInterestPayment
        );
        
        console.log("Naira calculation API response:", response);
        
        if (response && (response.success || response.interestRate)) {
          // The API might return the data directly or nested in a data property
          const result = response.data || response;
          console.log("Naira calculation result processed:", result);
          setCalculatedReturns(result);
          // Show terms if calculation is successful
          setShowTerms(true);
          success("Investment details calculated", "Reviewing terms and conditions");
        } else {
          showError("Calculation failed", "Unable to calculate investment returns");
          console.error("No valid calculation result returned", response);
        }
      } catch (err) {
        console.error("Error calculating returns:", err);
        showError("Calculation error", "Failed to calculate investment returns");
      } finally {
        setIsCalculating(false);
      }
    }
  };

  // Handle preview terms click
  const handlePreviewTerms = () => {
    if (investmentName && amount && tenure) {
      // Calculate returns before showing terms
      calculateInvestmentReturns();
    } else {
      showError("Error", "Please fill in all required fields");
    }
  };

  // Toggle payment method
  const togglePaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  // Handle payment submission
  const handleProceedToPayment = async () => {
    if (!agreedToTerms) {
      showError("Error", "You must agree to the terms");
      return;
    }

    if (selectedPaymentMethod === "wallet") {
      // Check if user has sufficient balance
      if (wallet && wallet.balance < Number(amount)) {
        setShowFailureModal(true);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      console.log("Creating naira investment with data:", {
        amount: Number(amount),
        name: investmentName,
        tenure: Number(tenure),
        currency: "NGN",
        upfrontInterestPayment,
        calculatedReturns
      });
      
      // Create the investment
      const investmentData = await createInvestment({
        amount: Number(amount),
        name: investmentName,
        tenure: Number(tenure),
        currency: "NGN",
        agreementAccepted: true,
        upfrontInterestPayment: upfrontInterestPayment
      });

      console.log("Naira investment creation response:", investmentData);

      if (investmentData) {
        setPendingInvestmentData(investmentData);
        // For direct investments that don't require approval
        if (investmentData.status === "ACTIVE") {
          success("Investment created successfully!", "Your investment is now active");
          setShowSuccessModal(true);
        } else {
          success("Investment created successfully!", "Your investment is now pending approval");
          setShowPendingModal(true);
        }
      } else {
        showError("Investment creation failed", "Please try again later");
      }
    } catch (err: any) {
      console.error("Error creating investment:", err);
      showError("Investment creation failed", err.message || "An error occurred while creating your investment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal actions
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleClosePendingModal = () => {
    setShowPendingModal(false);
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
    router.push('/dashboard/wallet');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  // Calculate start and maturity dates if we have calculated returns
  const startDate = calculatedReturns?.startDate ? formatDate(calculatedReturns.startDate) : formatDate(new Date().toISOString());
  const maturityDate = calculatedReturns?.maturityDate ? formatDate(calculatedReturns.maturityDate) : '';

  // Helper function to handle amount input with formatting
  const handleAmountChange = (value: string) => {
    // Remove all non-digit characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Update the raw amount (for calculations)
    setAmount(numericValue);
    
    // Format for display if there's a value
    if (numericValue) {
      const formatted = formatCurrency(parseFloat(numericValue) || 0);
      setFormattedAmount(formatted);
    } else {
      setFormattedAmount('');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[800px]">
        <div className="mb-8">
          <Link 
            href="/dashboard/investments" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
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
              <div className="text-3xl font-bold mb-1">
                {walletLoading ? (
                  <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  `₦ ${formatCurrency(wallet?.balance || 0)}`
                )}
              </div>
              <div className="text-gray-600">Your wallet balance</div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Investment Plan Info */}
              <div className="mb-6">
                <label className="block mb-2 text-gray-700">
                  Investment Plan
                </label>
                <div className="border border-gray-200 p-4">
                  <h3 className="font-medium mb-1">Naira Fixed Monthly Investment</h3>
                  <p className="text-sm text-gray-500">{nairaOptions.description}</p>
                </div>
              </div>

              {/* Wealth Plan Name */}
              <div className="mb-6">
                <label htmlFor="investmentName" className="block mb-2 text-gray-700">
                  Wealth Plan Name
                </label>
                <Input
                  id="investmentName"
                  placeholder="Enter Wealth Plan Name"
                  value={investmentName}
                  onChange={(e) => setInvestmentName(e.target.value)}
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
                    value={formattedAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    type="text" 
                    className="h-12 rounded-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Min: ₦{formatCurrency(nairaOptions.minimumAmount)} | Max: ₦{formatCurrency(nairaOptions.maximumAmount)}
                  </p>
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
                      <>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                      </>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Interest Payment Preference */}
              <div className="mb-6">
                <label className="block mb-2 text-gray-700">
                  Interest Payment Preference
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border p-4 cursor-pointer ${!upfrontInterestPayment ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}
                    onClick={() => setUpfrontInterestPayment(false)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">At Maturity</span>
                      {!upfrontInterestPayment && <Check className="h-4 w-4 text-red-600" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive principal plus interest at the end of the investment tenure
                    </p>
                    <div className="mt-2 text-sm font-medium">Rate: 2.00% monthly</div>
                  </div>
                  
                  <div 
                    className={`border p-4 cursor-pointer ${upfrontInterestPayment ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}
                    onClick={() => setUpfrontInterestPayment(true)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Upfront</span>
                      {upfrontInterestPayment && <Check className="h-4 w-4 text-red-600" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Receive interest immediately and principal at maturity
                    </p>
                    <div className="mt-2 text-sm font-medium">Rate: 1.60% monthly</div>
                  </div>
                </div>
              </div>

              {/* Loading indicator only shows when Preview Terms is clicked */}
              {isCalculating && (
                <div className="mb-6 p-4 bg-gray-50">
                  <div className="text-center text-sm text-gray-500">Calculating investment returns...</div>
                </div>
              )}

              {/* Preview Terms Button */}
              <Button
                type="button"
                onClick={handlePreviewTerms}
                disabled={!investmentName || !amount || !tenure || isCalculating}
                className={`w-full py-3 h-12 rounded-none ${
                  !investmentName || !amount || !tenure || isCalculating
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
                  <span className="font-bold">₦{formatCurrency(Number(amount))}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tenure</span>
                  <span className="font-bold">{tenure} {Number(tenure) === 1 ? 'month' : 'months'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-bold">{startDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Maturity Date</span>
                  <span className="font-bold">{maturityDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-bold">{calculatedReturns?.interestRate || 0}%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-bold">₦{formatCurrency(calculatedReturns?.totalInterest || calculatedReturns?.earnings || 0)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Maturity Amount</span>
                  <span className="font-bold">₦{formatCurrency(calculatedReturns?.maturityAmount || calculatedReturns?.totalPayout || 0)}</span>
                </div>
                {calculatedReturns?.withholdingTax && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Withholding Tax</span>
                    <span className="font-bold">₦{formatCurrency(calculatedReturns?.withholdingTax || 0)}</span>
                  </div>
                )}
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
                    <p className="font-bold">₦{formatCurrency(wallet?.balance || 0)}</p>
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

              <Button
                type="button"
                disabled={!agreedToTerms || !selectedPaymentMethod || isSubmitting}
                className={`w-full py-3 h-12 rounded-none ${
                  (!agreedToTerms || !selectedPaymentMethod || isSubmitting) 
                    ? "bg-red-300 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
                onClick={handleProceedToPayment}
              >
                {isSubmitting ? "Processing..." : "Proceed to make payment"}
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
      
      {/* Pending Modal */}
      {showPendingModal && (
        <InvestmentPendingModal
          onViewStatus={handleClosePendingModal}
        />
      )}
    </div>
  );
}
