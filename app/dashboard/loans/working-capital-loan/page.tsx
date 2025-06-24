"use client";

import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { HiOutlineUpload } from "react-icons/hi";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define FileWithPreview interface
interface FileWithPreview extends File {
  preview?: string;
}

export default function WorkingCapitalLoanPage() {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [purpose, setPurpose] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!amount || !months || !purpose || !businessName || !businessType || !registrationNumber || !monthlyRevenue) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare loan application data
      const amountValue = Number(amount.replace(/[^0-9]/g, ""));
      const monthsValue = Number(months);
      const monthlyRevenueValue = Number(monthlyRevenue.replace(/[^0-9]/g, ""));
      
      // First fetch available loan products to get the correct product ID
      const { loanApi } = await import('@/lib/loanApi');
      const productsResponse = await loanApi.getLoanProducts();
      
      if (!productsResponse.success) {
        setError('Failed to fetch loan products. Please try again later.');
        setIsSubmitting(false);
        return;
      }
      
      // Find the first active WORKING_CAPITAL type product
      const workingCapitalProduct = productsResponse.data?.find(
        (product: { type: string; status: string }) => product.type === 'WORKING_CAPITAL' && product.status === 'ACTIVE'
      );
      
      if (!workingCapitalProduct) {
        setError('No available working capital loan products found. Please try again later.');
        setIsSubmitting(false);
        return;
      }
      
      // Create document IDs array from uploaded files 
      // In a real implementation, you would upload these files to the server first
      // and get document IDs back
      const documentIds = files.map((_, index) => `doc_${index}`);
      
      const loanData = {
        productId: workingCapitalProduct.id,
        amount: amountValue,
        duration: monthsValue,
        purpose: purpose,
        businessName: businessName,
        businessType: businessType,
        registrationNumber: registrationNumber,
        monthlyRevenue: monthlyRevenueValue,
        documentIds: documentIds
      };
      
      // Submit loan application
      const response = await loanApi.createWorkingCapitalLoan(loanData);
      
      if (response.success) {
        setSuccess(true);
        // Redirect to loan details or confirmation page
        setTimeout(() => {
          window.location.href = '/dashboard/loans';
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit loan application');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the drop handler to add preview URLs
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  // Update remove function to revoke object URLs
  const removeFile = (fileToRemove: FileWithPreview) => {
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files.filter(file => file !== fileToRemove));
  };

  // Set up dropzone with isDragActive state
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[800px]">
        <div className="mb-8">
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
            Create a New Working Capital Loan
          </Link>
        </div>

        <h2 className="text-[32px] font-semibold mb-8">Apply for a Working Capital Loan</h2>

        <div className="bg-white p-8">
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
              <h3 className="font-medium">Loan Application Submitted!</h3>
              <p>Your working capital loan application has been successfully submitted. You will be redirected to the loans page.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                  <h3 className="font-medium">Error</h3>
                  <p>{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount you want to borrow *</Label>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Enter amount in naira (up to ₦100,000,000)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 rounded-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="months">How many months *</Label>
                  <Select value={months} onValueChange={setMonths} required>
                    <SelectTrigger className="h-12 rounded-none">
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

              <div className="space-y-2">
                <Label htmlFor="purpose">Loan purpose *</Label>
                <Select value={purpose} onValueChange={setPurpose} required>
                  <SelectTrigger className="h-12 rounded-none">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory">Inventory Purchase</SelectItem>
                    <SelectItem value="expansion">Business Expansion</SelectItem>
                    <SelectItem value="equipment">Equipment Purchase</SelectItem>
                    <SelectItem value="cashFlow">Cash Flow Management</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Enter your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="h-12 rounded-none"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select value={businessType} onValueChange={setBusinessType} required>
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LLC">Limited Liability Company (LLC)</SelectItem>
                      <SelectItem value="SOLE_PROPRIETORSHIP">Sole Proprietorship</SelectItem>
                      <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                      <SelectItem value="CORPORATION">Corporation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="Enter business registration number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="h-12 rounded-none"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlyRevenue">Monthly Revenue *</Label>
                  <Input
                    id="monthlyRevenue"
                    type="text"
                    placeholder="Enter your monthly revenue"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(e.target.value)}
                    className="h-12 rounded-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-medium mb-4">Required Documents *</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Please upload the following documents to process your loan application. We need your business registration
                  documents, financial statements, and bank statements.
                </p>
                
                <div {...getRootProps()} className={`border-2 border-dashed p-6 text-center cursor-pointer ${
                  isDragActive ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-2">
                    <HiOutlineUpload className="h-8 w-8 text-gray-400" />
                    <div className="text-base text-gray-600 font-medium">
                      {isDragActive ? 'Drop files here' : 'Upload business documents'}
                    </div>
                    <p className="text-sm text-gray-500">
                      Drag & drop files or click to browse
                    </p>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 text-xs">DOC</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file)}
                          className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 p-0 flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700 h-12 px-16 rounded-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}