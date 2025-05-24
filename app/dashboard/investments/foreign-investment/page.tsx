"use client";

import React, { useState, useCallback } from "react";
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

interface FileWithPreview extends File {
  preview?: string;
}

export default function ForeignInvestmentPage() {
  // State to store form values
  const [wealthPlanName, setWealthPlanName] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [currency, setCurrency] = useState("USD");
  
  // State for payment proof
  const [paymentProof, setPaymentProof] = useState<FileWithPreview | null>(null);
  
  // State to track view
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  
  const router = useRouter();
  const { success, error, info } = useToastContext();

  // Handle form submission
  const handlePreviewTerms = () => {
    if (wealthPlanName && amount && tenure && currency) {
      success("Investment details saved", "Reviewing terms and conditions");
      setShowTerms(true);
    } else {
      error("Please fill all required fields", "All fields are required to proceed");
    }
  };

  // Handle payment submission
  const handleProceedToPayment = () => {
    // For bank transfer, check if proof is uploaded
    if (!paymentProof) {
      error("Payment proof required", "Please upload proof of payment to proceed");
      return;
    }
    
    success("Investment created successfully!", "Your investment is now under review");
    setShowPendingModal(true);
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
              {/* Wealth Plan Name and Currency side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Wealth Plan Name */}
                <div>
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
                disabled={!wealthPlanName || !amount || !tenure || !currency}
                className={`w-full py-3 h-12 rounded-none ${
                  !wealthPlanName || !amount || !tenure || !currency
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
              disabled={!isValidToSubmit()}
              className={`w-full py-3 h-12 rounded-none ${
                !isValidToSubmit()
                  ? "bg-red-300 cursor-not-allowed" 
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
              onClick={handleProceedToPayment}
            >
              Create Investment
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
