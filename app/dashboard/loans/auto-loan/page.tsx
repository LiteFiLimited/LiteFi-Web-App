"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { HiOutlineUpload } from "react-icons/hi";
import { useDropzone } from "react-dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileWithPreview extends File {
  preview?: string;
}

export default function AutoLoanPage() {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [purpose, setPurpose] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");
  const [vin, setVin] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // State for different types of files
  const [carImages, setCarImages] = useState<{
    front?: FileWithPreview;
    back?: FileWithPreview;
    interior?: FileWithPreview;
    engine?: FileWithPreview;
  }>({});
  
  const [documents, setDocuments] = useState<{
    registration?: FileWithPreview;
    plateNumber?: FileWithPreview;
    ownership?: FileWithPreview;
    identificationDocument?: FileWithPreview;
    customs: FileWithPreview[];
  }>({
    customs: []
  });

  const handleCustomsDocDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setDocuments(prev => ({ 
      ...prev, 
      customs: [...(prev.customs || []), ...filesWithPreview] 
    }));
  }, []);

  const removeCustomsDoc = (fileToRemove: FileWithPreview) => {
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setDocuments(prev => ({
      ...prev,
      customs: prev.customs.filter(file => file !== fileToRemove)
    }));
  };

  const { getRootProps: getCustomsRootProps, getInputProps: getCustomsInputProps, isDragActive: isCustomsDragActive } = useDropzone({ 
    onDrop: handleCustomsDocDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!amount || !months || !purpose || !make || !model || !year || !mileage || !vin) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare loan application data
      const amountValue = Number(amount.replace(/[^0-9]/g, ""));
      const monthsValue = Number(months);
      
      // First fetch available loan products to get the correct product ID
      const { loanApi } = await import('@/lib/loanApi');
      const productsResponse = await loanApi.getLoanProducts();
      
      if (!productsResponse.success) {
        setError('Failed to fetch loan products. Please try again later.');
        setIsSubmitting(false);
        return;
      }
      
      // Find the first active AUTO type product
      const autoProduct = productsResponse.data?.find(
        (product: { type: string; status: string }) => product.type === 'AUTO' && product.status === 'ACTIVE'
      );
      
      if (!autoProduct) {
        setError('No available auto loan products found. Please try again later.');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare document IDs (this would be populated after document upload)
      const documentIds = [];
      if (documents.registration) documentIds.push('doc_registration');
      if (documents.plateNumber) documentIds.push('doc_plate');
      if (documents.ownership) documentIds.push('doc_ownership');
      if (documents.identificationDocument) documentIds.push('doc_id');
      if (documents.customs.length > 0) documentIds.push('doc_customs');
      
      const vehicleDetails = {
        make,
        model,
        year,
        mileage,
        color: color || 'Not specified',
        vin,
        plateNumber: plateNumber || 'Not specified'
      };
      
      const loanData = {
        productId: autoProduct.id,
        amount: amountValue,
        duration: monthsValue,
        purpose: purpose,
        vehicleDetails,
        documentIds: documentIds
      };
      
      // Submit loan application
      const response = await loanApi.createAutoLoan(loanData);
      
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
            Create New Auto loan
          </Link>
        </div>

        <h2 className="text-[32px] font-semibold mb-8">Apply for an Auto Loan</h2>

        <div className="bg-white p-8">
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
              <h3 className="font-medium">Loan Application Submitted!</h3>
              <p>Your auto loan application has been successfully submitted. You will be redirected to the loans page.</p>
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
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
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
                    <SelectItem value="purchase">Vehicle Purchase</SelectItem>
                    <SelectItem value="refinance">Vehicle Refinance</SelectItem>
                    <SelectItem value="repair">Vehicle Repair</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            <div>
              <h3 className="text-base font-medium mb-4">Provide collateral details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Select value={make} onValueChange={setMake}>
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="lexus">Lexus</SelectItem>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camry">Camry</SelectItem>
                      <SelectItem value="corolla">Corolla</SelectItem>
                      <SelectItem value="accord">Accord</SelectItem>
                      <SelectItem value="civic">Civic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => {
                        const year = 2024 - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-8">
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700 h-12 px-16 rounded-none"
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}