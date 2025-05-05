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
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      amount,
      months,
      make,
      model,
      year,
      mileage,
      plateNumber,
      carImages,
      documents,
    });
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
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount you want to borrow</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="Enter amount in naira (up to ₦100,000,000)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="months">How many months</Label>
                <Select value={months} onValueChange={setMonths}>
                  <SelectTrigger className="h-12 rounded-none">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
        </div>
      </div>
    </div>
  );
}