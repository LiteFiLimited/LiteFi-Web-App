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

export default function TravelLoanPage() {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [purpose, setPurpose] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ amount, months, purpose, files });
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
            Create New Travel Loan
          </Link>
        </div>

        <h2 className="text-[32px] font-semibold mb-8">Apply for a Travel Loan</h2>

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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Loan purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="h-12 rounded-none">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="business">Business Trip</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="medical">Medical Trip</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Travel Documents (Optional)</Label>
              {files.length === 0 ? (
                <div 
                  {...getRootProps()} 
                  className={`cursor-pointer transition-all duration-200 p-8 text-center border-2 border-dashed 
                    ${isDragActive 
                      ? 'border-gray-400 bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-2">
                    <HiOutlineUpload className="w-6 h-6 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      {isDragActive ? 'Drop files here' : 'Upload'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
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

                  {/* Add more files option */}
                  <div 
                    {...getRootProps()} 
                    className="cursor-pointer transition-all duration-200 p-4 text-center border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 mt-2"
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-1">
                      <HiOutlineUpload className="w-5 h-5 text-gray-400" />
                      <div className="text-xs text-gray-600">Add more files</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 h-12 px-16 rounded-none"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}