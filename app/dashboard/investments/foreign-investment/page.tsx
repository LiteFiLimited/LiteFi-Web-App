"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { HiOutlineUpload } from "react-icons/hi";
import { useDropzone } from "react-dropzone";
import InvestmentPendingModal from "@/app/components/InvestmentPendingModal";
import CopyButton from "@/app/components/CopyButton";
import { useToastContext } from "@/app/components/ToastProvider";
import { useInvestments } from "@/hooks/useInvestments";
import { formatCurrency } from "@/lib/utils";

interface FileWithPreview extends File {
  preview?: string;
}

export default function ForeignInvestmentPage() {
  // State to store form values
  const [investmentName, setInvestmentName] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  
  // State for payment proof
  const [paymentProof, setPaymentProof] = useState<FileWithPreview | null>(null);
  
  // State to track view
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedReturns, setCalculatedReturns] = useState<any>(null);
  
  const router = useRouter();
  const { success, error, info } = useToastContext();
  const { 
    calculateReturns, 
    createForeignInvestment 
  } = useInvestments();

  // Define hardcoded foreign investment options
  const foreignOptions = {
    USD: {
      name: "USD Investment",
      description: "Foreign currency investment in USD",
      minimumAmount: 1000,
      maximumAmount: 1000000,
      minimumTenure: 3,
      maximumTenure: 36,
    },
    GBP: {
      name: "GBP Investment",
      description: "Foreign currency investment in GBP",
      minimumAmount: 1000,
      maximumAmount: 1000000,
      minimumTenure: 3,
      maximumTenure: 36,
    },
    EUR: {
      name: "EUR Investment",
      description: "Foreign currency investment in EUR",
      minimumAmount: 1000,
      maximumAmount: 1000000,
      minimumTenure: 3,
      maximumTenure: 36,
    }
  };
  
  // Calculate returns function - will only be called when user clicks Preview Terms
  const calculateInvestmentReturns = async () => {
    if (amount && tenure && currency) {
      setIsCalculating(true);
      try {
        console.log("Calculating foreign investment returns for:", {
          amount: Number(amount),
          tenure: Number(tenure),
          currency: currency,
          upfrontInterestPayment: false
        });
      
        const response = await calculateReturns(
          Number(amount), 
          Number(tenure), 
          currency, 
          false // Foreign investments don't use upfront interest payment
        );
        
        console.log("Foreign calculation API response:", response);
        
        if (response && (response.success || response.interestRate)) {
          // The API might return the data directly or nested in a data property
          const result = response.data || response;
          console.log("Foreign calculation result processed:", result);
          setCalculatedReturns(result);
          // Show terms if calculation is successful
          setShowTerms(true);
          success("Investment details calculated", "Reviewing terms and conditions");
        } else {
          error("Calculation failed", "Unable to calculate investment returns");
          console.error("No valid foreign calculation result returned", response);
        }
      } catch (err) {
        console.error("Error calculating foreign returns:", err);
        error("Calculation error", "Failed to calculate investment returns");
      } finally {
        setIsCalculating(false);
      }
    }
  };

  // Handle preview terms click
  const handlePreviewTerms = () => {
    if (investmentName && amount && tenure && currency) {
      // Calculate returns before showing terms
      calculateInvestmentReturns();
    } else {
      error("Please fill all required fields", "All fields are required to proceed");
    }
  };

  // Handle payment submission
  const handleProceedToPayment = async () => {
    // For bank transfer, check if proof is uploaded
    if (!paymentProof) {
      error("Payment proof required", "Please upload proof of payment to proceed");
      return;
    }
    
    if (!agreedToTerms) {
      error("Terms required", "Please accept the terms and conditions");
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Creating foreign investment with data:", {
        amount: Number(amount),
        name: investmentName,
        tenure: Number(tenure),
        currency,
        calculatedReturns
      });
      
      // In a real implementation, you would first upload the file and get a fileId
      const mockPaymentProofId = "proof-" + Date.now();
      
      const investmentData = await createForeignInvestment({
        amount: Number(amount),
        name: investmentName,
        tenure: Number(tenure),
        currency: currency,
        agreementAccepted: true,
        sourceOfFunds: "SAVINGS", // This should be a field in the form
        fundingMethod: "BANK_TRANSFER" // This is the only option for foreign investments
      });
      
      console.log("Foreign investment creation response:", investmentData);
      
      if (investmentData) {
        success("Investment created successfully!", "Your investment is now under review");
        setShowPendingModal(true);
      } else {
        error("Investment creation failed", "Please try again later");
      }
    } catch (err: any) {
      console.error("Error creating investment:", err);
      error("Investment creation failed", err.message || "An error occurred while creating your investment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file drop for payment proof
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0])
      });
      setPaymentProof(file);
      success("Payment proof uploaded", `${file.name} has been uploaded successfully`);
    }
  }, [success]);

  // Remove payment proof
  const removePaymentProof = () => {
    if (paymentProof?.preview) {
      URL.revokeObjectURL(paymentProof.preview);
    }
    setPaymentProof(null);
    info("Payment proof removed", "You can upload a new file");
  };

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  // Handle modal actions
  const handleClosePendingModal = () => {
    setShowPendingModal(false);
    router.push('/dashboard/investments');
  };

  const isValidToSubmit = () => {
    if (!agreedToTerms || !paymentProof) return false;
    return true;
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
          {!showTerms ? "Create New Litefi Foreign Investment" : "Investment terms"}
        </h2>

        {!showTerms ? (
          <div className="bg-white p-8">
            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Currency Selection */}
              <div>
                <label htmlFor="currency" className="block mb-2 text-gray-700">
                  Currency
                </label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="h-12 rounded-none">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Investment Plan Info */}
              <div>
                <label className="block mb-2 text-gray-700">
                  Investment Plan
                </label>
                <div className="border border-gray-200 p-4">
                  <h3 className="font-medium mb-1">{foreignOptions[currency as keyof typeof foreignOptions]?.name}</h3>
                  <p className="text-sm text-gray-500">{foreignOptions[currency as keyof typeof foreignOptions]?.description}</p>
                </div>
              </div>

              {/* Wealth Plan Name */}
              <div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className="text-xs text-gray-500 mt-1">
                    Min: {currency} {formatCurrency(foreignOptions[currency as keyof typeof foreignOptions]?.minimumAmount || 1000)} | 
                    Max: {currency} {formatCurrency(foreignOptions[currency as keyof typeof foreignOptions]?.maximumAmount || 1000000)}
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
                      </>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Loading indicator only shows when Preview Terms is clicked */}
              {isCalculating && (
                <div className="p-4 bg-gray-50">
                  <div className="text-center text-sm text-gray-500">Calculating investment returns...</div>
                </div>
              )}

              {/* Preview Terms Button */}
              <Button
                type="button"
                onClick={handlePreviewTerms}
                disabled={!investmentName || !amount || !tenure || !currency || isCalculating}
                className={`w-full py-3 h-12 rounded-none ${
                  !investmentName || !amount || !tenure || !currency || isCalculating
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
                  <span className="font-bold">{currency} {formatCurrency(Number(amount))}</span>
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
                  <span className="font-bold">{currency} {formatCurrency(calculatedReturns?.totalInterest || calculatedReturns?.earnings || 0)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Maturity Amount</span>
                  <span className="font-bold">{currency} {formatCurrency(calculatedReturns?.maturityAmount || calculatedReturns?.totalPayout || 0)}</span>
                </div>
                {calculatedReturns?.withholdingTax && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Withholding Tax</span>
                    <span className="font-bold">{currency} {formatCurrency(calculatedReturns?.withholdingTax || 0)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details Section with Payment Proof Upload inside */}
            <div className="bg-gray-50 p-6 mb-8">
              <h4 className="text-base uppercase font-semibold mb-4">ACCOUNT DETAILS</h4>
              <div className="mb-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Name</span>
                  <span className="font-bold">LiteFi MFB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">003920432342</span>
                    <CopyButton
                      textToCopy="003920432342"
                      onCopySuccess={() => success("Account number copied to clipboard")}
                      onCopyError={() => error("Failed to copy account number")}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sort Code</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">0923</span>
                    <CopyButton
                      textToCopy="0923"
                      onCopySuccess={() => success("Sort code copied to clipboard")}
                      onCopyError={() => error("Failed to copy sort code")}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name</span>
                  <span className="font-bold">Bank Of America</span>
                </div>
              </div>
              
              {/* Payment Proof Upload - Now inside the account details container */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="text-sm text-center text-gray-600 mb-4">
                  Make a transfer to the account details above and upload the payment proof
                </p>
                
                <div className="border-2 border-dashed border-gray-300 p-4 text-center">
                  {paymentProof ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-2 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-sm mb-1">{paymentProof.name}</div>
                      <div className="text-xs text-gray-500 mb-3">{(paymentProof.size / 1024 / 1024).toFixed(2)} MB</div>
                      <Button
                        type="button"
                        onClick={removePaymentProof}
                        variant="outline"
                        className="text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div 
                      {...getRootProps()} 
                      className="cursor-pointer py-10"
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center">
                        <div className="rounded-full p-3 bg-gray-100 mb-2">
                          <HiOutlineUpload className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium">
                          {isDragActive ? 'Drop the file here' : 'Upload proof of payment'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Drag and drop or click to browse
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2 mt-6 mb-4">
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
              disabled={!isValidToSubmit() || isSubmitting}
              className={`w-full py-3 h-12 rounded-none ${
                !isValidToSubmit() || isSubmitting
                  ? "bg-red-300 cursor-not-allowed" 
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
              onClick={handleProceedToPayment}
            >
              {isSubmitting ? "Processing..." : "Create Investment"}
            </Button>
          </div>
        )}
      </div>

      {/* Investment Pending Review Modal */}
      {showPendingModal && (
        <InvestmentPendingModal onViewStatus={handleClosePendingModal} />
      )}
    </div>
  );
}
