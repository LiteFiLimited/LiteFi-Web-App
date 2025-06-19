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
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Travel loan application submitted");
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount
                </label>
                <Input
                  placeholder="Enter amount"
                  className="h-12"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Destination
                </label>
                <Input
                  placeholder="Enter destination"
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date
                </label>
                <Input
                  type="date"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Date
                </label>
                <Input
                  type="date"
                  className="h-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Itinerary
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your travel plans..."
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

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 h-12">
              Submit Application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}