"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { HiOutlineUpload } from "react-icons/hi";

interface FileWithPreview extends File {
  preview?: string;
}

export default function TravelLoanPage() {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [purpose, setPurpose] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelItinerary, setTravelItinerary] = useState("");
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
      if (!amount || !months || !purpose || !destination || !travelDate || !returnDate) {
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
      
      // Find the first active TRAVEL type product
      const travelProduct = productsResponse.data?.find(
        (product: { type: string; status: string }) => product.type === 'TRAVEL' && product.status === 'ACTIVE'
      );
      
      if (!travelProduct) {
        setError('No available travel loan products found. Please try again later.');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare document IDs (this would be populated after document upload)
      const documentIds = files.map((_, index) => `doc_travel_${index}`);
      
      const loanData = {
        productId: travelProduct.id,
        amount: amountValue,
        duration: monthsValue,
        purpose: purpose,
        destination: destination,
        travelDate: new Date(travelDate).toISOString(),
        returnDate: new Date(returnDate).toISOString(),
        documentIds: documentIds
      };
      
      // Submit loan application
      const response = await loanApi.createTravelLoan(loanData);
      
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (fileToRemove: FileWithPreview) => {
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files => files.filter(file => file !== fileToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  React.useEffect(() => {
    return () => files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
  }, [files]);

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
            Back
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Travel Loan Application</h2>

        <div className="bg-white p-8">
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
              <h3 className="font-medium">Loan Application Submitted!</h3>
              <p>Your travel loan application has been successfully submitted. You will be redirected to the loans page.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
                  <h3 className="font-medium">Error</h3>
                  <p>{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount *
                  </label>
                  <Input
                    placeholder="Enter amount (in Naira)"
                    className="h-12"
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Duration (Months) *
                  </label>
                  <select
                    className="w-full h-12 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    required
                  >
                    <option value="">Select duration</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Purpose *
                </label>
                <select
                  className="w-full h-12 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                >
                  <option value="">Select purpose</option>
                  <option value="vacation">Vacation</option>
                  <option value="business">Business Trip</option>
                  <option value="education">Educational Trip</option>
                  <option value="medical">Medical Tourism</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Destination *
                </label>
                <Input
                  placeholder="Enter destination"
                  className="h-12"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Date *
                  </label>
                  <Input
                    type="date"
                    className="h-12"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date *
                  </label>
                  <Input
                    type="date"
                    className="h-12"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Itinerary
                </label>
                <textarea
                  className="w-full min-h-[100px] p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your travel plans..."
                  value={travelItinerary}
                  onChange={(e) => setTravelItinerary(e.target.value)}
                />
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Upload Documents
              </label>
              <div 
                {...getRootProps()} 
                className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-gray-400"
              >
                <input {...getInputProps()} />
                <HiOutlineUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? "Drop the files here ..."
                    : "Drag & drop files here, or click to select files"
                  }
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, DOC, DOCX, PNG, JPG files up to 10MB
                </p>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Uploaded Files:</h4>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(file)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Submit Application'}
            </Button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}